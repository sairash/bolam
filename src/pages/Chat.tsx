import Connection from '@/components/connection'
import MessagesContainer from '@/components/MessagesContainer'
import GeolocationProvider from '@/provider/GeolocationProvider'

export default function Chat() {
    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">
            <Connection />
            <GeolocationProvider>
                <MessagesContainer />
            </GeolocationProvider>
        </div>
    )
}