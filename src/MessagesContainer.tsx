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
            <div className="flex flex-col h-screen w-screen px-4 lg:px-6 py-2 overflow-hidden">
                <Header />
                <ScrollArea className="flex-1 h-0 py-4">
                    {messages.map((message, key) => (
                        <Message key={key} message={message.content} peerId={message.peerId} timestamp={message.timestamp} isSelf={message.peerId == peerId} />
                    ))}
                </ScrollArea>
                <SendMessage />
            </div>
        </TorrentProvider>

    )
}

export default MessagesContainer