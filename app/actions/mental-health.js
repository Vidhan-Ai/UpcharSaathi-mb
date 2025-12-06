'use server'

import { prisma } from "@/lib/db";
import { stackServerApp } from "@/stack/server";

export async function saveAssessmentResult(data) {
    const user = await stackServerApp.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    try {
        const record = await prisma.mentalHealthAssessment.create({
            data: {
                userId: user.id,
                assessmentId: data.assessmentId,
                assessmentName: data.assessmentName,
                score: data.score,
                resultText: data.resultText,
                color: data.color,
            }
        });
        return { success: true, data: record };
    } catch (error) {
        console.error("Failed to save assessment:", error);
        return { success: false, error: error.message };
    }
}

export async function saveMoodEntry(data) {
    const user = await stackServerApp.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    try {
        const record = await prisma.moodEntry.create({
            data: {
                userId: user.id,
                moodLabel: data.moodLabel,
                moodColor: data.moodColor,
                note: data.note || "",
            }
        });
        return { success: true, data: record };
    } catch (error) {
        console.error("Failed to save mood:", error);
        return { success: false, error: error.message };
    }
}

export async function getAssessmentHistory() {
    const user = await stackServerApp.getUser();
    if (!user) return [];

    try {
        return await prisma.mentalHealthAssessment.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    } catch (error) {
        return [];
    }
}

export async function getMoodHistory() {
    const user = await stackServerApp.getUser();
    if (!user) return [];

    try {
        return await prisma.moodEntry.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 30
        });
    } catch (error) {
        return [];
    }
}
