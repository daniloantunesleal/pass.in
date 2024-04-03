import { prisma } from "../src/lib/prisma"

async function seed() {
    await prisma.event.create({
        data: {
            id: "005831fa-6fd3-40c6-980e-a2c3db5eb756",
            title: "Noul Solutions",
            slug: "noul-solutions",
            details: "Primeiro evento da Noul!",
            maximumAttendees: 100
        }
    })
}

seed().then(() => {
    console.log("Database seeded!")
    prisma.$disconnect()
})