import { z } from 'zod'

export const MessageTypeSchema = z.enum(['chat', 'file', 'connect', 'disconnect', 'update-username'])

export const messageSchema = z.object({
    id: z.string(),
    type: MessageTypeSchema,
    content: z.string(),
    peerId: z.string(),
    timestamp: z.string(),
    username: z.string(),
})

export type Message = z.infer<typeof messageSchema>
export type MessageType = z.infer<typeof MessageTypeSchema>