import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import WebTorrent from 'webtorrent'
import { type Message, type MessageType } from '@/types/message'
import { deterministicRandomString } from '@/helper/usernameGen'

interface PeerState {
  client: WebTorrent.Instance | null
  torrent: WebTorrent.Torrent | null
  totalPeers: number
  peerId: string | null
  isConnected: boolean
  peers: string[]
  messages: Message[]
  activeUsers: Record<string, { username: string, randomString: string }>

  setClient: (client: WebTorrent.Instance) => void
  setTorrent: (torrent: WebTorrent.Torrent) => void
  setConnected: (connected: boolean) => void
  setTotalPeers: () => void
  addPeer: (peerId: string) => void
  removePeer: (peerId: string) => void
  getUsername: (peerId: string) => { username: string, randomString: string }
  sendMessage: (id: string, username: string, message: string, type: MessageType) => void
  relayMessage: (message: Message) => void
  addMessage: (message: Message) => void
  clearMessages: () => void
  destroy: () => void

  sendFile: (id: string, username: string, file: File, type: MessageType) => void
}

export const usePeerStore = create<PeerState>()(
  subscribeWithSelector((set, get) => ({
    client: null,
    torrent: null,
    totalPeers: 1,
    peerId: null,
    isConnected: false,
    peers: [],
    messages: [],
    activeUsers: {},
    clearMessages: () => set({ messages: [] }),
    setTotalPeers: () => {
      const { torrent } = get()
      if(!torrent) return
      set({ totalPeers: torrent.numPeers + 1 })
    },
    getUsername: (peerId) => {
      const { activeUsers } = get()
      return activeUsers[peerId] || { username: '', randomString: '' }
    },
    sendMessage: (id, username, messageContent, type) => {
      const { peerId, torrent } = get()
      if (!peerId || !torrent) return

      const message: Message = {
        id: id,
        type: type,
        content: messageContent,
        peerId: peerId,
        timestamp: Date.now().toString(),
        username: username
      };

      const payload = JSON.stringify(message);

      for (const wire of torrent.wires) {
        wire.torrentChat.send(payload);
      }

      get().addMessage(message)
    },
    relayMessage: (message: Message) => {
      const { torrent } = get()
      if (!torrent) return

      const payload = JSON.stringify(message);
      for (const wire of torrent.wires) {
        wire.torrentChat.send(payload);
      }
    },

    sendFile: (id, username, file, type) => {
      const {client, peerId, torrent } = get()
      if (!client || !peerId || !torrent) return

      client.seed(file, (v)=>{
        console.log('seeded', v.magnetURI)
        get().sendMessage(id, username, v.magnetURI, type)
      })

    },

    setClient: (client) => set({ client, peerId: client.peerId }),

    setTorrent: (torrent) => {
      set({ torrent, isConnected: true })

      // Set up peer tracking
      torrent.on('wire', (wire) => {
        get().addPeer(wire.peerId)

        wire.on('close', () => {
          get().removePeer(wire.peerId)
        })

        wire.on('end', () => {
          get().removePeer(wire.peerId)
        })
      })
    },

    setConnected: (connected) => set({ isConnected: connected }),

    addPeer: (peerId) => set((state) => ({
      peers: state.peers.includes(peerId) ? state.peers : [...state.peers, peerId]
    })),

    removePeer: (peerId) => set((state) => ({
      peers: state.peers.filter(id => id !== peerId)
    })),

    addMessage: async (message: Message) => {
      const { messages,activeUsers, peerId } = get()

      if(messages.find(m => m.id === message.id)) return

      const randomString = await deterministicRandomString(message.peerId)
      switch (message.type) {
        case 'update-username':
          activeUsers[message.peerId] = { username: message.username, randomString: randomString }
          set({ activeUsers: {...activeUsers} })
          return
        case 'disconnect':
          delete activeUsers[message.peerId]
          set({ activeUsers: {...activeUsers} })
          return
        case 'connect':
          if(activeUsers[message.peerId] || message.peerId == peerId) {
            return
          }
          break
        case 'file':
          break
        default:
          break
      }

      if (!activeUsers[message.peerId]) {
        activeUsers[message.peerId] = { username: message.username, randomString: randomString }
        set({ activeUsers: activeUsers })
      }


      set((state) => ({
        messages: [...state.messages, message],
      }))

      get().relayMessage(message)
    },

    destroy: () => {
      const { client, torrent } = get()

      try {
        // Clean up torrent first
        if (torrent) {
          torrent.removeAllListeners()
          torrent.destroy()
        }

        // Clean up client
        if (client) {
          client.removeAllListeners()
          client.destroy()
        }
      } catch (error) {
        console.error('Error during cleanup:', error)
      }

      // Reset state
      set({
        client: null,
        torrent: null,
        isConnected: false,
        peers: []
      })
    }
  }))
)