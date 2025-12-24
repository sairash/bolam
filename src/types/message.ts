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
});

const stringContentSchema = BaseMessageZSchema.extend({
    type: z.enum(["chat", "file", "connect", "disconnect", "update-username"]),
    content: z.string(),
});

const peerListSchema = BaseMessageZSchema.extend({
    type: z.literal("peer-list"),
    content: z.array(z.string()),
});

type StringContentMessage = z.infer<typeof stringContentSchema>;
type PeerListMessage = z.infer<typeof peerListSchema>;

type RelayMessage = {
    id: string;
    peerId: string;
    timestamp: string;
    username: string;
    type: "relay";
    content: Message;
};

export type Message = StringContentMessage | PeerListMessage | RelayMessage;

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