'use server'

import { prisma } from '@/lib/db'
import { stackServerApp } from '@/stack/server' // Assuming stack auth usage

export async function saveHealthScreening(data) {
    // data: { deficienciesDetected, analysisData, images }
    const user = await stackServerApp.getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        const result = await prisma.healthScreening.create({
            data: {
                userId: user.id,
                deficienciesDetected: data.deficienciesDetected,
                analysisData: data.analysisData,
                images: data.images
            }
        });
        return { success: true, id: result.id };
    } catch (error) {
        console.error("Failed to save health screening:", error);
        return { success: false, error: "Failed to save results" };
    }
}

export async function getHealthScreeningHistory() {
    const user = await stackServerApp.getUser();
    if (!user) {
        return [];
    }

    try {
        const history = await prisma.healthScreening.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        return history;
    } catch (error) {
        console.error("Failed to fetch screening history:", error);
        return [];
    }
}

export async function deleteHealthScreening(id) {
    const user = await stackServerApp.getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.healthScreening.deleteMany({
            where: {
                id: id,
                userId: user.id // Ensure user owns the record
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to delete health screening:", error);
        return { success: false, error: "Failed to delete record" };
    }
}
