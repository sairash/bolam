import { useEffect, useMemo, useRef, useState, type RefObject } from "react"
import Color from "./Color"
import moment from "moment"
import { usePeerStore } from "@/store/peer"
import { type MessageType } from "@/types/message"
import WebTorrent from "webtorrent"
// import { Button } from "./ui/button"
// import { BsEmojiSurpriseFill } from "react-icons/bs";

// import { ImBug, ImTux } from "react-icons/im";
// import { Award, Cat } from "lucide-react";


export function Msg({ client, msg, type }: { client: WebTorrent.Instance | null, msg: string, type: MessageType }) {
    const fileContainer = useRef<HTMLElement | HTMLImageElement | null>(null)

    useEffect(() => {
        if (type === 'file') {
            if (!client) return

            client.add(msg, (torrent) => {
                if (torrent.files.length > 0) {
                    const file = torrent.files[0]
                    file.streamTo(fileContainer.current)
                }
            })

        }
    }, [msg, type])

    if(type === 'file') return <img className="w-full max-w-74" src={msg} ref={fileContainer as RefObject<HTMLImageElement>} />
    return <span className="pr-2">{msg}</span>
}


export default function Message({ message, timestamp, isSelf, peerId, msgType }: { message: string, timestamp: string, isSelf: boolean, peerId: string, msgType: MessageType }) {
    const activeUsers = usePeerStore((state) => state.activeUsers)
    const client = usePeerStore((state) => state.client)
    const [user, setUser] = useState({ username: '', randomString: '' })

    let formattedTimestamp = ""
    if (moment().diff(moment(Number(timestamp)), 'days') > 1) {
        formattedTimestamp = moment(Number(timestamp)).format('MMM DD, YYYY')
    } else {
        formattedTimestamp = moment(Number(timestamp)).format('HH:mm:ss')
    }

    useEffect(() => {
        setUser(activeUsers[peerId] || { username: '', randomString: '' })
    }, [activeUsers, peerId])




    return (
        <div className="relative group">
            <div className={`p-1 py-2  ${isSelf ? 'bg-secondary' : 'bg-base'}`}>
                <div className="">
                    <Color name={`@${user.username}#${user.randomString}`}>
                        <span className="font-bold pr-2">{`<${user.username}#${user.randomString}>`}</span>
                        <Msg client={client} msg={message} type={msgType} />
                        <span className="text-sm text-muted-foreground">{`[${formattedTimestamp}]`}</span>
                    </Color>
                </div>
                {/* <div className="px-1 pt-1">
                <Button variant="outline" size='sm'><span className="flex gap-1"><Award color="yellow" />1</span></Button>
                </div> */}
            </div>
            {/* <div className="z-10 absolute right-0 hidden group-hover:flex w-72 flex justify-end">
                <Button variant="outline" size='lg'><Award color="yellow" /></Button>
                <Button variant="outline" size='lg'><ImBug color="skyblue"/></Button>
                <Button variant="outline" size='lg'><Cat color="pink" /></Button>
                <Button variant="outline" size='lg'><ImTux color="lightgreen" /></Button>
                <Button variant="outline" size='lg'><BsEmojiSurpriseFill color="grey" /></Button>
            </div> */}
        </div>
    )
}