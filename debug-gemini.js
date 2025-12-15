const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    try {
        // The SDK doesn't have a direct listModels on the client instance in some versions, 
        // but usually separate `GoogleGenerativeAI` class methods or similar.
        // Actually, in @google/generative-ai, there isn't a top-level listModels helper easily accessible in the main flow 
        // without using the ModelService directly/REST.

        // Let's try to just fetch a known model that usually exists if the key is valid.
        // If the key is invalid, any call fails.

        // Trying a simpler model name or verifying valid key via a simple generate
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        await model.generateContent("test");
        console.log("gemini-pro exists!");
    } catch (error) {
        console.error("Error details:", error.message);
        if (error.response) {
            console.error("Response:", await error.response.json());
        }
    }
}

// Better approach: Use fetch directly to list models if SDK is obscure
async function listModelsRaw() {
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!key) {
        console.log("No API Key found in .env");
        return;
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.models) {
            console.log("Visible Generative Models:");
            const genModels = data.models.filter(m =>
                m.supportedGenerationMethods &&
                m.supportedGenerationMethods.includes('generateContent') &&
                m.name.includes('gemini')
            );
            genModels.forEach(m => console.log(m.name));

            if (genModels.length === 0) {
                console.log("No 'gemini' models found with generateContent support. All models:", data.models.map(m => m.name));
            }
        } else {
            console.log("No models returned. Response:", JSON.stringify(data));
        }
    } catch (e) {
        console.log("Fetch error:", e);
    }
}

listModelsRaw();
