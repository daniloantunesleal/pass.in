import { Prisma } from "@prisma/client"
import { prisma } from "../src/lib/prisma"
import { faker } from "@faker-js/faker"
import dayjs from "dayjs"

async function seed() {
    const eventId = "005831fa-6fd3-40c6-980e-a2c3db5eb756"

    await prisma.event.deleteMany()

    await prisma.event.create({
        data: {
            id: eventId,
            title: "Noul Solutions",
            slug: "noul-solutions",
            details: "Primeiro evento da Noul!",
            maximumAttendees: 100
        }
    })

    const attendeesToInsert: Prisma.AttendeeUncheckedCreateInput[] = []

    for (let i = 0; i <= 120; i++) {
        attendeesToInsert.push({
            id: 1000 + i,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            eventId,
            createdAt: faker.date.recent({ days: 30, refDate: dayjs().subtract(8, "days").toDate() }),
            checkIn: faker.helpers.arrayElement<Prisma.CheckInUncheckedCreateNestedOneWithoutAttendeeInput | undefined>([
                undefined,
                {
                  create: {
                    createdAt: faker.date.recent({ days: 7 }),
                  }
                }
              ])
        })
    }

    await Promise.all(attendeesToInsert.map(data => prisma.attendee.create({ data })))
}

seed().then(() => {
    console.log("Database seeded!")
    prisma.$disconnect()
})