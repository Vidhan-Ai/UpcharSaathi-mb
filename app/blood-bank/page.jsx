import BloodBankClient from './BloodBankClient'; // Import the client component

// 1. Export the metadata (This is a Server Component)
export const metadata = {
  title: 'Blood Bank - UpcharSaathi',
  description: 'Find blood availability and get help from our AI blood bank assistant.',
}

// 2. Render the Client Component
export default function BloodBankPage() {
  return <BloodBankClient />;
}