import { Suspense } from 'react';
import FindCareClient from './FindCareClient';

export const metadata = {
    title: 'Find Care - UpcharSaathi',
    description: 'Locate doctors, hospitals, and blood banks near you.',
}

export default function FindCarePage() {
    return (
        <Suspense fallback={<div className="min-vh-100 d-flex align-items-center justify-content-center">Loading...</div>}>
            <FindCareClient />
        </Suspense>
    );
}
