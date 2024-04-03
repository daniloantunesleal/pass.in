import { FastifyInstance } from "fastify"
import { BadRequest } from "./routes/_erros/bad-request"
import { ZodError } from "zod"

type FastifyErrorHandler = FastifyInstance["errorHandler"]

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: `Error during validation`,
            errors: error.flatten().fieldErrors
        })
    }

    if (error instanceof BadRequest) {
        return reply.status(400).send(error.message)
    }

    return reply.status(500).send("Internal server error!")
}