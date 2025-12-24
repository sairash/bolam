import { ScrollArea } from "@/components/ui/scroll-area"
import SendMessage from "./SendMessage"
import Message from "./Message"
import Header from "./header"
import { usePeerStore } from "../store/peer"
import { useMemo } from "react"
import { type Message as messageType } from "@/types/message"

type FlatMessage = Exclude<messageType, { type: "relay" } | { type: "peer-list" }>;

function MessagesContainer() {
    const peerId = usePeerStore((state) => state.peerId)
    const messages = usePeerStore((state) => state.messages)

    const displayMessages = useMemo(() => {
        return messages
            .map((m) => {
                if (m.type === "relay") {
                    return m.content;
                }
                return m;
            })
            .filter((m): m is FlatMessage => {
                return m.type !== "peer-list" && m.type !== "relay";
            });
    }, [messages]);

    return (
        <div className="px-4 py-2 flex flex-col h-full w-full overflow-hidden">
            <Header />
            <ScrollArea className="flex-1 h-0 py-4">
                {displayMessages.map(m =>
                    <Message
                        key={m.id}
                        message={m.content}
                        peerId={m.peerId}
                        timestamp={m.timestamp}
                        isSelf={m.peerId === peerId}
                        msgType={m.type}
                    />
                )}
            </ScrollArea>
            <SendMessage />
        </div>
    )
}

export default MessagesContainer