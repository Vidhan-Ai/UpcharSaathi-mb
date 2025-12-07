'use server'

import { stackServerApp } from "@/stack/server";

export async function getGoogleFitToken() {
    try {
        const user = await stackServerApp.getUser();

        if (!user) {
            return null;
        }


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
