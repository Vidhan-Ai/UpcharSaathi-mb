import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        const newMessage = {
            id: Date.now().toString(),
            name,
            email,
            message,
            submittedAt: new Date().toISOString(),
        };

        const dataDir = path.join(process.cwd(), 'data');
        const filePath = path.join(dataDir, 'contact_submissions.json');

        // Ensure data directory exists
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir, { recursive: true });
        }

        // Read existing data
        let submissions = [];
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            submissions = JSON.parse(fileContent);
        } catch (error) {
            // File might not exist or be empty, start with empty array
        }

        submissions.push(newMessage);

        // Write back to file
        await fs.writeFile(filePath, JSON.stringify(submissions, null, 2));

        return NextResponse.json({ success: true, message: 'Message saved successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to save message' },
            { status: 500 }
        );
    }
}
