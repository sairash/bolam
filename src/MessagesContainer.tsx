import { ScrollArea } from "@/components/ui/scroll-area"
import SendMessage from "./components/SendMessage"
import Message from "./components/Message"
import TorrentProvider from "./provider/TorrentProvider"
import Header from "./components/header"
import { usePeerStore } from "./store/peer"

function MessagesContainer() {
    const peerId = usePeerStore((state) => state.peerId)
    const messages = usePeerStore((state) => state.messages)

    return (
        <TorrentProvider>
            <div className="px-4 py-2 flex flex-col h-full w-full overflow-hidden">
                <Header />
                <ScrollArea className="flex-1 h-0 py-4">
                    {messages.map((message) => (
                        <Message key={message.id} message={message.content} peerId={message.peerId} timestamp={message.timestamp} isSelf={message.peerId == peerId} msgType={message.type} />
                    ))}
                </ScrollArea>
                <SendMessage />
            </div>
        </TorrentProvider>

    )
}

export default MessagesContainer