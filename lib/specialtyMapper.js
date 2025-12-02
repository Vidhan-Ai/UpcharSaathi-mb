// Simple mapping of common symptoms/terms to medical specialties
// This helps in "query expansion"
const SYMPTOM_MAP = {
    'headache': 'Neurology',
    'migraine': 'Neurology',
    'stomach': 'Gastroenterology',
    'heart': 'Cardiology',
    'chest pain': 'Cardiology',
    'skin': 'Dermatology',
    'rash': 'Dermatology',
    'eye': 'Ophthalmology',
    'vision': 'Ophthalmology',
    'bone': 'Orthopedics',
    'joint': 'Orthopedics',
    'fracture': 'Orthopedics',
    'child': 'Pediatrics',
    'baby': 'Pediatrics',
    'women': 'Gynecology',
    'pregnancy': 'Gynecology',
    'tooth': 'Dentistry',
    'teeth': 'Dentistry',
    'mental': 'Psychiatry',
    'depression': 'Psychiatry',
    'anxiety': 'Psychiatry',
    'cancer': 'Oncology',
    'kidney': 'Nephrology',
    'urinary': 'Urology',
    'ear': 'ENT',
    'nose': 'ENT',
    'throat': 'ENT',
    'diabetes': 'Endocrinology',
    'hormone': 'Endocrinology',
    'blood': 'Hematology'
};

export function getSpecialtyFromSymptom(query) {
    if (!query) return null;
    const lowerQuery = query.toLowerCase();

    for (const [key, value] of Object.entries(SYMPTOM_MAP)) {
        if (lowerQuery.includes(key)) {
            return value;
        }
    }
    return null;
}
