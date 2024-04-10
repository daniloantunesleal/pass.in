import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function getEventAttendees(app: FastifyInstance) {
    app.
        withTypeProvider<ZodTypeProvider>()
        .get("/events/:eventId/attendees", {
            schema: {
                summary: "Get event attendees",
                tags: ["events"],
                params: z.object({
                    eventId: z.string().uuid()
                }),
                querystring: z.object({
                    query: z.string().nullish(),
                    pageIndex: z.string().nullable().default("0").transform(Number)
                }),
                response: {
                    200: z.object({
                        attendees: z.array(
                            z.object({
                                id: z.number().int(),
                                name: z.string(),
                                email: z.string().email(),
                                createdAt: z.date(),
                                checkedInAt: z.date().nullish()
                            })
                        ),
                        total: z.number()
                    })
                }
            }
        }, async (request, reply) => {
            const { eventId } = request.params
            const { pageIndex, query } = request.query

            const [attendees, total] = await Promise.all([
                prisma.attendee.findMany({
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                        checkIn: {
                            select: {
                                createdAt: true
                            }
                        }
                    },
                    where: query ? {
                        name: {
                            contains: query
                        },
                        eventId
                    } : {
                        eventId
                    },
                    take: 10,
                    skip: pageIndex * 10,
                    orderBy: {
                        createdAt: "desc"
                    }
                }),
                prisma.attendee.count({
                    where: query ? {
                        name: {
                            contains: query
                        },
                        eventId
                    } : {
                        eventId
                    }
                })
            ])

            return reply.status(200).send({ 
                attendees: attendees.map(attendee => ({
                    id: attendee.id,
                    name: attendee.name,
                    email: attendee.email,
                    createdAt: attendee.createdAt,
                    checkedInAt: attendee.checkIn?.createdAt ?? null
                })),
                total
            })
        })
}