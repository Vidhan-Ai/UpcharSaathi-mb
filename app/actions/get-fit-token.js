'use server'

import { stackServerApp } from "@/stack/server";

export async function getGoogleFitToken() {
    try {
        const user = await stackServerApp.getUser();

        if (!user) {
            return null;
        }

        // Logic to extract Google Access Token from Stack User
        // NOTE: You must enable "Store Access Tokens" in Stack Dashboard -> OAuth Providers -> Google
        // and ensure the scopes (fitness.activity.read, etc.) are added there.

        // This structure is a best-effort guess based on Stack's common patterns.
        // You may need to inspect the 'user' object logs to find the exact path if this differs.
        const linkedAccounts = user.linkedAccounts || user.connectedAccounts || [];
        const googleAccount = linkedAccounts.find(acc => acc.provider === 'google');

        if (googleAccount && googleAccount.accessToken) {
            return googleAccount.accessToken;
        }

        return null;
    } catch (error) {
        console.error("Error retrieving Google Fit token from Stack:", error);
        return null;
    }
}
