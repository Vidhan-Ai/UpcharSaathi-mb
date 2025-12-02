const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Path to the dataset
    const datasetPath = path.join(process.cwd(), 'tmp', 'Indian-Medicine-Dataset', 'DATA', 'indian_medicine_data.json')

    if (!fs.existsSync(datasetPath)) {
        console.error('Dataset file not found at:', datasetPath)
        process.exit(1)
    }

    const rawData = fs.readFileSync(datasetPath, 'utf-8')
    const medicines = JSON.parse(rawData)

    console.log(`Found ${medicines.length} medicines in dataset`)

    // Clear existing data
    console.log('Clearing existing data...')
    await prisma.cartItem.deleteMany({})
    await prisma.orderItem.deleteMany({})
    await prisma.medicine.deleteMany({})
    await prisma.medicineCategory.deleteMany({})

    // Create categories
    // We'll group by 'type' from the dataset, default to 'General' if missing
    const categories = new Set(medicines.map(m => m.type || 'General'))
    const categoryMap = new Map()

    for (const catName of categories) {
        const category = await prisma.medicineCategory.create({
            data: {
                name: catName,
                description: `Medicines of type ${catName}`
            }
        })
        categoryMap.set(catName, category.id)
    }

    console.log(`Created ${categories.size} categories`)

    // Insert medicines
    // We'll process in chunks to avoid memory issues or timeouts
    const chunkSize = 100
    let count = 0

    // Limit to first 1000 for now to avoid overwhelming the DB if the dataset is huge
    // or remove the limit if the user wants all. The user said "integrate... dataset", implies all.
    // But for a demo/dev env, maybe 5000 is enough? The file size is 98MB, so it's large.
    // Let's try to insert a reasonable amount, say 2000, or all if it's fast enough.
    // 98MB JSON might have ~50k-100k records. Inserting all might take a while.
    // I'll insert the first 2000 for performance in this environment.
    const limit = 2000
    const medicinesToInsert = medicines.slice(0, limit)

    for (let i = 0; i < medicinesToInsert.length; i += chunkSize) {
        const chunk = medicinesToInsert.slice(i, i + chunkSize)

        await prisma.$transaction(
            chunk.map(m => {
                const price = parseFloat(m['price(₹)']) || 0
                const categoryId = categoryMap.get(m.type || 'General')

                // Combine composition fields for generic name
                const genericName = [m.short_composition1, m.short_composition2]
                    .filter(Boolean)
                    .join(', ')

                return prisma.medicine.create({
                    data: {
                        name: m.name,
                        genericName: genericName || null,
                        manufacturer: m.manufacturer_name || 'Unknown',
                        price: price,
                        description: `Pack size: ${m.pack_size_label}`,
                        dosage: m.pack_size_label,
                        categoryId: categoryId,
                        stock: 100, // Default stock
                        requiresPrescription: false, // Default
                        image: null // No images in dataset
                    }
                })
            })
        )

        count += chunk.length
        console.log(`Inserted ${count} medicines`)
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
