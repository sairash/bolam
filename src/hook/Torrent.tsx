import { TorrentContext } from "@/context/TorrentContex"
import { useContext } from "react"

export const useTorrent = () => {
    const context = useContext(TorrentContext)
    
    if (!context) {
        throw new Error('useTorrent must be used within a TorrentProvider')
    }

    return context
}