import { useEffect, useRef, useState } from "react"
import Color from "./Color"
import moment from "moment"
import { usePeerStore } from "@/store/peer"
import { type MessageType } from "@/types/message"
import WebTorrent, { type TorrentFile } from "webtorrent"
import { Download } from "lucide-react"
import ImageViewer_Motion from "./commerce-ui/image-viewer-motion"

// Helper to get file type category from MIME type or filename
function getFileTypeCategory(mimeType: string | undefined, filename: string): string {
    // Try MIME type first
    if (mimeType) {
        const category = mimeType.split('/')[0]
        if (['image', 'video', 'audio'].includes(category)) return category
    }
    // Fallback to extension
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
    const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv']
    const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a']
    
    if (imageExts.includes(ext)) return 'image'
    if (videoExts.includes(ext)) return 'video'
    if (audioExts.includes(ext)) return 'audio'
    return 'application'
}

interface ExtendedTorrentFile extends TorrentFile {
    type: string
    streamURL: string
    streamTo: (elem: HTMLMediaElement) => HTMLMediaElement
}


export function Msg({ client, msg, type, isSelf }: { client: WebTorrent.Instance | null, msg: string, type: MessageType, isSelf: boolean }) {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const setTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [progress, setProgress] = useState<number>(0)
    const fileName = useRef<string>('')
    const [fileType, setFileType] = useState<string>('')
    const [file, setFile] = useState<ExtendedTorrentFile | null>(null)
    const [blob, setBlob] = useState<Blob | null>(null)
    const [mediaSrc, setMediaSrc] = useState<string>('')


    
    useEffect(() => {
        if (type === 'file') {
            if (!client || setTimeoutRef.current) return

            client.add(msg, async (torrent) => {
                if (torrent.files.length > 0) {
                    const file = torrent.files[0] as ExtendedTorrentFile
                    fileName.current = file.name
                    setFileType(getFileTypeCategory(file.type, file.name))
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
                file.getBlob((err, blob) => {
                    if (!err && blob) {
                        setBlob(blob)
                    }
                })
                return
            }
            try {
                setMediaSrc(file.streamURL)
            } catch {
                file.getBlob((err, blob) => {
                    if (!err && blob) {
                        setMediaSrc(URL.createObjectURL(blob))
                    }
                })
            }
        }
    }, [fileType, file])



    const progressText = isSelf ? 'Sending' : 'Receiving'
    const receivedText = isSelf ? 'Sent' : 'Received'

    if (type === 'file') return <div>
        {progress < 100 && <div className="progress-bar">
            <div className="progress-bar-value"></div>
        </div>}
        <div>
            {fileType === 'image' && mediaSrc && <ImageViewer_Motion className="w-full max-w-74" imageTitle={fileName.current} src={mediaSrc} />}
            {fileType === 'video' && mediaSrc && <video controls className="w-full max-w-74" src={mediaSrc} ref={videoRef} />}
            {fileType === 'audio' && mediaSrc && <audio controls className="w-full max-w-74" src={mediaSrc} ref={audioRef} />}
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