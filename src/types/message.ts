import { z } from 'zod'

export const MessageTypeSchema = z.enum([
    "chat",
    "file",
    "connect",
    "disconnect",
    "update-username",
    "peer-list",
    "relay"
]);

const BaseMessageZSchema = z.object({
    id: z.string(),
    peerId: z.string(),
    timestamp: z.string(),
    username: z.string(),
    content: z.string(),
});


const stringContentSchema = BaseMessageZSchema.extend({
    type: z.enum(["chat", "file", "connect", "disconnect", "update-username"]),
    content: z.string(),
});

const peerListSchema = BaseMessageZSchema.extend({
    type: z.literal("peer-list"),
    content: z.array(z.string()),
});


export type Message =
    | z.infer<typeof stringContentSchema>
    | z.infer<typeof peerListSchema>
    | { type: "relay"; content: Message };

export const messageSchema: z.ZodType<Message> = z.discriminatedUnion("type", [
    stringContentSchema,
    peerListSchema,
    BaseMessageZSchema.extend({
        type: z.literal("relay"),
        content: z.lazy(() => messageSchema),
    }),
]);

export type BaseMessageSchema = z.infer<typeof BaseMessageZSchema>;
export type MessageType = z.infer<typeof MessageTypeSchema>