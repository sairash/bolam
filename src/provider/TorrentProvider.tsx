import { TorrentContext } from "@/context/TorrentContex"
import chatExtensionMaker from "@/helper/chatExtensionMaker"
import { generateInfoHash } from "@/helper/helpers"
import { usePeerStore } from "@/store/peer"
import { useEffect, useRef } from "react"
import WebTorrent from "webtorrent"
import { usePersistStore } from "@/store/persist"

export default function TorrentProvider({ children }: { children: React.ReactNode }) {
    const torrent = usePeerStore((state) => state.torrent)
    const setTotalPeers = usePeerStore((state) => state.setTotalPeers)
    const client = usePeerStore((state) => state.client)
    const removePeer = usePeerStore((state) => state.removePeer)
    const setTorrent = usePeerStore((state) => state.setTorrent)
    const setClient = usePeerStore((state) => state.setClient)
    const destroy = usePeerStore((state) => state.destroy)
    const sendMessage = usePeerStore((state) => state.sendMessage)
    const username = usePersistStore((state) => state.username)
    const geoHash = usePersistStore((state) => state.geoHash)
    const torrentTrackers = usePersistStore((state) => state.torrentTrackers)
    const clearMessages = usePeerStore((state) => state.clearMessages)
    
    const isInitializing = useRef(false)
    const currentRoomName = useRef('')

    async function joinRoom() {
        if (isInitializing.current) return

        isInitializing.current = true
        clearMessages()
        try {
            let webTorrentClient = client
            if (!webTorrentClient) {
                webTorrentClient = new WebTorrent()
                const controller = await navigator.serviceWorker.ready
                webTorrentClient.createServer({controller})
                setClient(webTorrentClient)
            }

            const infoHash = await generateInfoHash(geoHash)
            
            webTorrentClient.on('error', (err) => {
                console.log(`❌ Client error: ${err}`)
                isInitializing.current = false
            });

            const newTorrent = webTorrentClient.add(infoHash, {
                announce: [
                    ...torrentTrackers,
                ]
            });
            
            newTorrent.on('infoHash', () => {
                console.log('✅ Torrent added. Waiting for peers...');
                setTorrent(newTorrent)
                isInitializing.current = false
            });

            newTorrent.on('wire', (wire) => {
                console.log(`🔗 Connected to a new peer: ${wire.peerId}`);
                setTotalPeers()
                wire.use(chatExtensionMaker());

                wire.on('extended', (extendedData) => {
                    if(extendedData === 'handshake') {
                        const id = crypto.randomUUID();
                        sendMessage(id, username, 'Peer has connected with you', 'connect')
                    }
                });
                
                wire.on('close', () => {
                    setTotalPeers()
                    removePeer(wire.peerId)
                    console.log('Peer disconnected:', wire.peerId);
                });
                
                wire.on('end', () => {
                    setTotalPeers()
                    removePeer(wire.peerId)
                    console.log('Peer connection ended:', wire.peerId);
                });
            });

            newTorrent.on('error', (err) => {
                console.log(`❌ Torrent error: ${err}`)
                isInitializing.current = false
            });

        } catch (error) {
            console.error('Error joining room:', error)
            isInitializing.current = false
        }
    }

    async function removeTorrentFromClient(geoHash: string) {
        if(geoHash === '') return
        const infoHash = await generateInfoHash(geoHash)

        
        const webTorrentClient = client
        if (!webTorrentClient) return
        webTorrentClient.remove(infoHash, {}, async (torrent) => {
            isInitializing.current = false
            joinRoom()
            console.log('Torrent removed from client:', torrent)
            
        })
    }

    useEffect(() => {
        if (currentRoomName.current !== geoHash) {
            removeTorrentFromClient(currentRoomName.current)
            currentRoomName.current = geoHash
            return
        }

        joinRoom()

        return () => {
            if (currentRoomName.current !== geoHash) return
            
            isInitializing.current = false
        }
    }, [geoHash, torrentTrackers]) // Only depend on geoHash and torrentTrackers

    useEffect(() => {
        return () => {
            destroy()
        }
    }, []) // Empty dependency array for unmount cleanup

    return (
        <TorrentContext.Provider value={torrent}>
            {children}
        </TorrentContext.Provider>
    )
}