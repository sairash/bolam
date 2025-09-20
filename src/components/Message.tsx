import { useEffect, useRef, useState, type RefObject } from "react"
import Color from "./Color"
import moment from "moment"
import { usePeerStore } from "@/store/peer"
import { type MessageType } from "@/types/message"
import WebTorrent, { type TorrentFile } from "webtorrent"
import { Download } from "lucide-react"
// import { Button } from "./ui/button"
// import { BsEmojiSurpriseFill } from "react-icons/bs";

// import { ImBug, ImTux } from "react-icons/im";
// import { Award, Cat } from "lucide-react";


export function Msg({ client, msg, type, isSelf }: { client: WebTorrent.Instance | null, msg: string, type: MessageType, isSelf: boolean }) {
    const fileContainer = useRef<HTMLElement | HTMLImageElement | null>(null)
    const setTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [progress, setProgress] = useState<number>(0)
    const fileName = useRef<string>('')
    const [fileType, setFileType] = useState<string>('')
    const [file, setFile] = useState<TorrentFile | null>(null)
    const [blob, setBlob] = useState<Blob | null>(null)

    useEffect(() => {
        if (type === 'file') {
            if (!client || setTimeoutRef.current) return

            client.add(msg, async (torrent) => {
                if (torrent.files.length > 0) {
                    const file = torrent.files[0]
                    fileName.current = file.name
                    setFileType(file.type.split('/')[0])
                    setFile(file)

                    setTimeoutRef.current = setInterval(() => {
                        if (file.progress == 1 && setTimeoutRef.current) {
                            setProgress(file.progress * 100)
                            clearInterval(setTimeoutRef.current)
                        }
                        setProgress(file.progress * 100)
                    }, 100)
                }
            })

        }

        return () => {
            if (setTimeoutRef.current) {
                clearTimeout(setTimeoutRef.current)
            }
        }
    }, [msg, type, setTimeoutRef])

    useEffect(() => {
        if (file) {
            if (fileType === 'application') {
                
                const blob = async () => {
                    const blob = await file.blob()
                    setBlob(blob)
                }

                blob()
                return
            }
            file.streamTo(fileContainer.current)
        }
    }, [fileType])



    const progressText = isSelf ? 'Sending' : 'Receiving'
    const receivedText = isSelf ? 'Sent' : 'Received'

    if (type === 'file') return <div>
        {progress < 100 && <div className="progress-bar">
            <div className="progress-bar-value"></div>
        </div>}
        <div>
            {fileType === 'image' && <img className="w-full max-w-74" src={msg} ref={fileContainer as RefObject<HTMLImageElement>} />}
            {fileType === 'video' && <video controls className="w-full max-w-74" src={msg} ref={fileContainer as RefObject<HTMLVideoElement>} />}
            {fileType === 'audio' && <audio controls className="w-full max-w-74" src={msg} ref={fileContainer as RefObject<HTMLAudioElement>} />}
            {fileType === 'application' && blob && (
                <div className="flex items-center gap-2">
                    <span>{fileName.current}</span>
                    <a href={URL.createObjectURL(blob)} download={fileName.current} className="flex gap-1 text-popover-foreground">[ Download <Download size={18} />]</a>
                </div>
            )}
            <span className="text-sm text-muted-foreground">{progress < 100 ? progressText : receivedText} {fileType}: {`${fileName.current}`} {`[${progress}%]`}</span>
        </div>
    </div>
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
                        <Msg client={client} msg={message} type={msgType} isSelf={isSelf} />
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