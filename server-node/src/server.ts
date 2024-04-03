import fastify from "fastify"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"

const app = fastify()

const prisma = new PrismaClient({
    log: ["query"]
})

// Métodos HTTP: GET, POST, DELETE, PATCH, HEAD, OPTIONS, ...
// Corpo da requisição (Request Body)
// Paramentros de busca (Search Params / Query Params) `http://localhost:3333/users?name=Danilo`
// Parametros de rota (Route Params) -> Identificação de recursos
// Cabeçalho (Headers) -> Contexto

// Driver nativo / Query Builderss / ORMs

app.post("/events", async (request, reply) => {
    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
    })

    const data = createEventSchema.parse(request.body)

    const event = await prisma.event.create({
        data: {
            title: data.title,
            details: data.details,
            maximumAttendees: data.maximumAttendees,
            slug: new Date().toISOString()
        }
    })

    return reply.status(201).send({ eventId: event.id })
})

app.listen({ port: 3333 }).then(() => {
    console.log("HTTP server running!\nhttp://localhost:3333")
})