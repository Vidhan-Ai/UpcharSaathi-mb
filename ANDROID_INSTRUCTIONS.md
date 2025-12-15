
# UpcharSaathi Android Health Sync Integration (With Google Auth)

This document provides the necessary Android Kotlin code to integrate Health Connect syncing with your backend, SECURED by Google Sign-In.

## dependencies (build.gradle)

Add Google Play Services Auth:

```gradle
dependencies {
    implementation "com.google.android.gms:play-services-auth:20.7.0"
    implementation "androidx.health.connect:connect-client:1.1.0-alpha07"
    implementation "com.squareup.retrofit2:retrofit:2.9.0"
    implementation "com.squareup.retrofit2:converter-gson:2.9.0"
    implementation "androidx.compose.ui:ui:1.5.0"
    implementation "androidx.compose.material3:material3:1.1.0"
}
```

## Android Manifest

Same permissions as before.

## Kotlin Code (MainActivity.kt)

Replace `MainActivity.kt`.
**CRITICAL**: Replace `"YOUR_WEB_CLIENT_ID"` with your actual Web Client ID from Google Cloud Console. This MUST match the one used by your Next.js server.

```kotlin
package com.example.healthsync

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import kotlinx.coroutines.launch
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Request
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import java.time.Instant
import java.time.temporal.ChronoUnit

// --- 1. Network Interface ---
interface BackendApi {
    @GET("/api/health/check-sync-status")
    suspend fun checkSyncStatus(): Map<String, Boolean> // No param needed, uses Token

    @POST("/api/health/upload")
    suspend fun uploadData(@Body body: UploadBody): Map<String, String>
}

data class UploadBody(val data: List<HealthData>) // No userId needed
data class HealthData(val type: String, val count: Long? = null, val bpm: Long? = null, val date: String)

// --- 2. Main Activity ---
class MainActivity : ComponentActivity() {

    // UPDATE: Your Web Client ID here
    private val WEB_CLIENT_ID = "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
    
    // UPDATE: Your Backend URL
    private val BASE_URL = "https://usmb.vercel.app/"

    private var googleIdToken: String? = null

    // Retrofit with Auth Interceptor
    private fun getApi(): BackendApi {
        val client = OkHttpClient.Builder().addInterceptor { chain ->
            val original: Request = chain.request()
            val builder: Request.Builder = original.newBuilder()
            if (googleIdToken != null) {
                builder.header("Authorization", "Bearer $googleIdToken")
            }
            chain.proceed(builder.build())
        }.build()

        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(BackendApi::class.java)
    }

    private val permissions = setOf(
        HealthPermission.getReadPermission(StepsRecord::class),
        HealthPermission.getReadPermission(HeartRateRecord::class)
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val healthConnectClient = HealthConnectClient.getOrCreate(this)

        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    HealthSyncScreen(healthConnectClient)
                }
            }
        }
    }

    @Composable
    fun HealthSyncScreen(healthConnectClient: HealthConnectClient) {
        var statusMessage by remember { mutableStateOf("Please Sign In with Google") }
        var showSignInButton by remember { mutableStateOf(true) }
        var showPermissionButton by remember { mutableStateOf(false) }

        // Google Sign In Launcher
        val signInLauncher = rememberLauncherForActivityResult(contract = ActivityResultContracts.StartActivityForResult()) { result ->
            val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
            try {
                val account = task.getResult(ApiException::class.java)
                googleIdToken = account.idToken
                statusMessage = "Signed In. Checking Permissions..."
                showSignInButton = false
                checkPermissionsAndSync(healthConnectClient) { msg, showPerm -> 
                    statusMessage = msg 
                    showPermissionButton = showPerm
                }
            } catch (e: ApiException) {
                statusMessage = "Sign In Failed: ${e.message}"
            }
        }

        // Permission Launcher
        val permissionLauncher = rememberLauncherForActivityResult(
            contract = PermissionController.createRequestPermissionResultContract()
        ) { granted ->
            if (granted.containsAll(permissions)) {
                showPermissionButton = false
                statusMessage = "Permissions granted. Checking backend..."
                checkBackendAndSync(healthConnectClient) { msg -> statusMessage = msg }
            } else {
                statusMessage = "Permissions denied."
                showPermissionButton = true
            }
        }

        Column(
            modifier = Modifier.fillMaxSize().padding(16.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = statusMessage, style = MaterialTheme.typography.bodyLarge)

            if (showSignInButton) {
                Button(onClick = {
                    val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                        .requestIdToken(WEB_CLIENT_ID)
                        .requestEmail()
                        .build()
                    val intent = GoogleSignIn.getClient(this@MainActivity, gso).signInIntent
                    signInLauncher.launch(intent)
                }, modifier = Modifier.padding(top = 16.dp)) {
                    Text("Sign In with Google")
                }
            }

            if (showPermissionButton) {
                Button(onClick = { permissionLauncher.launch(permissions) }, modifier = Modifier.padding(top = 16.dp)) {
                    Text("Grant Health Permissions")
                }
            }
        }
    }
    
    // ... checkPermissionsAndSync similar to before but triggering perms
    
    private fun checkPermissionsAndSync(client: HealthConnectClient, updateUI: (String, Boolean) -> Unit) {
        kotlinx.coroutines.GlobalScope.launch {
            val granted = client.permissionController.getGrantedPermissions()
            if (granted.containsAll(permissions)) {
                updateUI("Checking backend...", false)
                checkBackendAndSync(client) { m -> updateUI(m, false) }
            } else {
                updateUI("Permissions needed", true)
            }
        }
    }

    private fun checkBackendAndSync(
        client: HealthConnectClient,
        updateStatus: (String) -> Unit
    ) {
        kotlinx.coroutines.GlobalScope.launch {
            try {
                val api = getApi()
                val status = api.checkSyncStatus() // Uses Token!
                if (status["sync_pending"] == true) {
                    updateStatus("Sync pending... Reading Health Connect...")
                    performSync(client, api, updateStatus)
                } else {
                    updateStatus("Idle: No sync requested.")
                }
            } catch (e: Exception) {
                updateStatus("Error: ${e.message}")
                Log.e("Sync", "Network error", e)
            }
        }
    }

    private suspend fun performSync(client: HealthConnectClient, api: BackendApi, updateStatus: (String) -> Unit) {
        try {
            val endTime = Instant.now()
            val startTime = endTime.minus(24, ChronoUnit.HOURS)

            val stepsResponse = client.readRecords(
                ReadRecordsRequest(StepsRecord::class, TimeRangeFilter.between(startTime, endTime))
            )
            
            val uploadList = mutableListOf<HealthData>()
            stepsResponse.records.forEach { record ->
                uploadList.add(HealthData("Steps", count = record.count, date = record.startTime.toString()))
            }

            if (uploadList.isNotEmpty()) {
                api.uploadData(UploadBody(uploadList))
                updateStatus("Success: Uploaded ${uploadList.size} records.")
            } else {
                updateStatus("Success: No local data found.")
            }
        } catch (e: Exception) {
            updateStatus("Sync Failed: ${e.message}")
        }
    }
}
```
