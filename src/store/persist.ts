import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'
import { encryptedStorage } from "@/lib/encryptor"
import { DEFAULT_TORRENT_TRACKERS, DEFAULT_USERNAME } from "@/helper/constants"

interface PersistState {
    savedRooms: string[]
    welcomeMessageShown: boolean
    username: string

    geoHash: string
    torrentTrackers: string[]
    setSavedRooms: (savedRooms: string[]) => void
    setWelcomeMessageShown: (welcomeMessageShown: boolean) => void
    setUsername: (username: string) => void
    setGeoHash: (geoHash: string) => void
    addTorrentTracker: (torrentTracker: string) => void
    removeTorrentTracker: (torrentTracker: string) => void
    resetTorrentTrackers: () => void
    purge: () => void
}


export const usePersistStore = create<PersistState>()(
    persist(
        (set, get) => ({
            savedRooms: [],
            welcomeMessageShown: false,
            username: DEFAULT_USERNAME,
            geoHash: '',
            torrentTrackers: DEFAULT_TORRENT_TRACKERS,
            setSavedRooms: savedRooms => set({ savedRooms }),
            setWelcomeMessageShown: welcomeMessageShown => set({ welcomeMessageShown }),
            setUsername: username => set({ username }),
            setGeoHash: geoHash => set({ geoHash }),
            addTorrentTracker: torrentTracker => set({ torrentTrackers: [...get().torrentTrackers, torrentTracker] }),
            removeTorrentTracker: torrentTracker => set({ torrentTrackers: get().torrentTrackers.filter(tracker => tracker !== torrentTracker) }),
            resetTorrentTrackers: () => set({ torrentTrackers: DEFAULT_TORRENT_TRACKERS }),
            purge: () => set({ welcomeMessageShown: false, username: DEFAULT_USERNAME, geoHash: '', torrentTrackers: DEFAULT_TORRENT_TRACKERS }),
        }),
        {
            name: 'persist-store',
            storage: createJSONStorage(() => encryptedStorage),
        }
    )
)