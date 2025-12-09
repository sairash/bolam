import { Button } from './ui/button'
import Color from './Color'
import { LuUsers, LuEllipsisVertical } from 'react-icons/lu'
import { usePeerStore } from '@/store/peer'
import { useState, useEffect } from 'react'
import { deterministicRandomString } from '@/helper/usernameGen'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { NavLink } from 'react-router'

import { Input } from './ui/input'
import { stringToHexColor } from '@/helper/color'
import { GEOHASH_COVERS, MAX_USERNAME_LENGTH } from '@/helper/constants'
import { usePersistStore } from '@/store/persist'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from '@radix-ui/react-label'
import { Trash, Plus, BadgeQuestionMark, ArrowLeft } from 'lucide-react'
import { isValidGeohash } from '@/helper/helpers'

export default function Header() {
  const activePeers = usePeerStore((state) => state.peers)
  const totalPeers = usePeerStore((state) => state.totalPeers)
  const peerId = usePeerStore((state) => state.peerId)
  const username = usePersistStore((state) => state.username)
  const setUsername = usePersistStore((state) => state.setUsername)
  const sendMessage = usePeerStore((state) => state.sendMessage)
  const getUsername = usePeerStore((state) => state.getUsername)
  const [generatedUsername, setGeneratedUsername] = useState('')
  const setGeoHash = usePersistStore((state) => state.setGeoHash)
  const geoHash = usePersistStore((state) => state.geoHash)
  const [usernameChanging, setUsernameChanging] = useState(username)
  const [availableGeoHashes, setAvailableGeoHashes] = useState([geoHash])
  const [selectedGeoHash, setSelectedGeoHash] = useState(geoHash)
  const [customChannel, setCustomChannel] = useState('')
  const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false)
  const [isChangeGeoHashOpen, setIsChangeGeoHashOpen] = useState(false)
  const [isUserListOpen, setIsUserListOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [torrentTracker, setTorrentTracker] = useState('')


  const torrentTrackers = usePersistStore((state) => state.torrentTrackers)
  const addTorrentTracker = usePersistStore((state) => state.addTorrentTracker)
  const removeTorrentTracker = usePersistStore((state) => state.removeTorrentTracker)
  const resetTorrentTrackers = usePersistStore((state) => state.resetTorrentTrackers)
  const purge = usePersistStore((state) => state.purge)


  useEffect(() => {
    if (peerId && username) {
      deterministicRandomString(peerId).then((randomString) => {
        setGeneratedUsername(randomString)
      })
    }
  }, [peerId, username])


  function handleUsernameChange() {
    setUsername(usernameChanging);
    setIsChangeUsernameOpen(false)
    sendMessage(crypto.randomUUID(), usernameChanging, 'update-username', 'update-username')
  }

  function handleGeoHashChange() {
    if (customChannel) {
      setGeoHash(customChannel);
    } else {
      setGeoHash(selectedGeoHash);
    }
    setIsChangeGeoHashOpen(false)
  }

  useEffect(() => {
    const geohash = geoHash
    const newGeoHashes = [geohash]
    for (let i = geohash.length - 1; i > 1; i--) {
      const newGeoHash = geohash.slice(0, i)
      newGeoHashes.push(newGeoHash)
    }
    setAvailableGeoHashes(newGeoHashes)
  }, [geoHash])

  const userList = activePeers.filter((peer: string) => getUsername(peer).username !== '')

  return (
    <>
      <header className="flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-2">
          <NavLink to="/" end>
            <Button variant="ghost" asChild size="default" className='cursor-pointer px-1' >
              <ArrowLeft size={30} />
            </Button>
          </NavLink>
          <h1 className="text-base font-medium cursor-default">Bolam /
            <Button variant="ghost" asChild size="default" className='cursor-pointer px-1' onClick={() => setIsChangeUsernameOpen(true)}>
              <span>
                <Color name={`@${username}#${generatedUsername}`}>@{username}</Color><span className='xs text-secondary -ml-1'>#{generatedUsername}</span>
              </span>
            </Button>
          </h1>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" onClick={() => { setIsChangeGeoHashOpen(true) }} asChild size="sm" className='cursor-pointer text-primary'>
              <span>#{geoHash}</span>
            </Button>

            <Button variant="ghost" asChild size="sm" className='cursor-pointer text-primary' onClick={() => setIsUserListOpen(true)}>
              <span>
                <LuUsers className="size-5" />
                {totalPeers}
              </span>
            </Button>

            <Button variant="ghost" asChild size="sm" className='cursor-pointer -mx-2 ' onClick={() => setIsSettingsOpen(true)}>
              <LuEllipsisVertical className="size-12" />
            </Button>
          </div>
        </div>
      </header>

      {/* Change Username Dialog */}
      <Dialog onOpenChange={() => { setIsChangeUsernameOpen(!isChangeUsernameOpen) }} open={isChangeUsernameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Username</DialogTitle>
            <DialogDescription>
              Change your username to a custom one.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input
              placeholder='Username...'
              id="username"
              defaultValue={usernameChanging}
              maxLength={MAX_USERNAME_LENGTH}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUsernameChange()
                }
              }}
              onChange={(e) => {
                setUsernameChanging(e.target.value)
              }}
            />
            <Button variant="outline" style={{ backgroundColor: stringToHexColor(`@${usernameChanging}#${generatedUsername}`) }}>#{generatedUsername}</Button>
            <div>
              <Button variant="secondary">{usernameChanging.length} / {MAX_USERNAME_LENGTH}</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" className='w-full cursor-pointer' onClick={handleUsernameChange}>Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Geo Hash Dialog */}
      <Dialog onOpenChange={() => { setIsChangeGeoHashOpen(!isChangeGeoHashOpen) }} open={isChangeGeoHashOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>#Location Channels {isValidGeohash(selectedGeoHash) ? "True" : "False"} </DialogTitle>

            <DialogDescription> Chat with people in the same location using geohash channels. Only a coarse level of precision is used. Do not share or screenshot this to protect your privacy. </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            {isValidGeohash(selectedGeoHash) &&
              <Select defaultValue={selectedGeoHash} onValueChange={(value) => setSelectedGeoHash(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {availableGeoHashes.map((char, index) => (
                    <SelectItem value={char} key={index} disabled={char === selectedGeoHash}>
                      {char} - <span className='text-sm text-muted-foreground'>{GEOHASH_COVERS[index]}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
            <Input type="text" placeholder="Custom Channel" defaultValue={geoHash} onChange={(e) => setCustomChannel(e.target.value)} />
          </div>
          <Button variant="secondary" className='cursor-pointer' onClick={handleGeoHashChange}>Change</Button>
        </DialogContent>
      </Dialog>

      {/* User List Dialog */}
      <Dialog onOpenChange={() => { setIsUserListOpen(!isUserListOpen) }} open={isUserListOpen}>
        <DialogContent className='overflow-y-none'>
          <DialogHeader>
            <DialogTitle>Connected Peer List</DialogTitle>
            <DialogDescription>List of users in this channel.</DialogDescription>
          </DialogHeader>
          <Separator />
          <ScrollArea className="h-72">
            1: <Color name={`@${username}#${generatedUsername}`}>@{username}</Color><span className='text-secondary'>#{generatedUsername}</span>
            {userList.map((peer: string, index: number) => (
              <div key={index}>
                {index + 2}: <Color name={`@${getUsername(peer).username}#${getUsername(peer).randomString}`}>@{getUsername(peer).username}</Color><span className='text-secondary'>#{getUsername(peer).randomString}</span>
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>


      {/* Settings Dialog */}
      <Dialog onOpenChange={() => { setIsSettingsOpen(!isSettingsOpen) }} open={isSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Change your settings that affects the app experience.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-between">
            <div className="flex gap-2 mt-1">
              <Label>Torrent Trackers</Label>
              <HoverCard>
                <HoverCardTrigger>
                  <BadgeQuestionMark className='size-5' />
                </HoverCardTrigger>
                <HoverCardContent>
                  <p>Torrent Trackers are used to download torrents from the internet. We use them to communicate/ chat with other peers. You can easily add or remove trackers to bypass censorship.</p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <Button variant="secondary" className='cursor-pointer' size="sm" onClick={() => { resetTorrentTrackers() }}>Reset</Button>
          </div>
          <ScrollArea className="h-72 mb-4">
            {torrentTrackers.map((tracker, index) => (
              <div key={index} className='flex items-center gap-2 mb-2'>
                <Input type="text" placeholder="Torrent Tracker" value={tracker} disabled />
                <Button variant="secondary" className='cursor-pointer' onClick={() => { removeTorrentTracker(tracker) }}><Trash className='size-4' /></Button>
              </div>
            ))}
          </ScrollArea>
          <DialogFooter className='flex flex-col sm:flex-col gap-2'>
            <div className="w-full flex gap-2">
              <Input type="text" placeholder="New Torrent Tracker" value={torrentTracker} onChange={(e) => setTorrentTracker(e.target.value)} />
              <Button variant="secondary" className='cursor-pointer' onClick={() => { addTorrentTracker(torrentTracker); setTorrentTracker('') }}><Plus className='size-4' /></Button>
            </div>
            <div className="">
              <Button variant="destructive" className='cursor-pointer w-full' onClick={() => { purge() }}>Purge All Data</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}