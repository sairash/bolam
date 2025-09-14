import { GeolocationContext } from '@/context/GeolocationContext'
import { useState, useEffect } from 'react'
import { useGeolocated } from "react-geolocated";
import geohash from 'ngeohash'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePersistStore } from '@/store/persist'
import { LuGithub } from 'react-icons/lu';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';

export default function GeolocationProvider({ children }: { children: React.ReactNode }) {
    const [enterCustomChannel, setEnterCustomChannel] = useState(false)
    const geohash_persist = usePersistStore((state) => state.geoHash)
    const setGeoHash = usePersistStore((state) => state.setGeoHash)
    const [customChannel, setCustomChannel] = useState('')
    const setWelcomeMessageShown = usePersistStore((state) => state.setWelcomeMessageShown)
    const welcomeMessageShown = usePersistStore((state) => state.welcomeMessageShown)
    
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

    useEffect(() => {
        if (coords) {
            const geoHash = geohash.encode(coords.latitude, coords.longitude, 6)
            setGeoHash(geoHash)
        }
    }, [coords, setGeoHash])


    return !welcomeMessageShown ? (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bolam: बोलम <span className='text-sm'>(Nepali word for "let's talk")</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        <img src="/bolam-logo.svg" alt="Bolam Logo" width={100} height={100} className='mb-4' />
                        <div>
                            Bolam is a decentralized peer-to-peer chat app that lets you connect directly with others without relying on central servers or storing any data. 
                            You can join channels to chat with people worldwide or enable location access to discover and talk with users nearby. 
                            All data, including your location, stays only in your browser, ensuring privacy. 
                            Built on torrent technology, Bolam bypasses censorship while giving you full control to easily add or remove trackers, making your conversations private, resilient, and truly yours.
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className='cursor-pointer' asChild>
                    <a href="https://github.com/sairash/bolam" target="_blank" rel="noopener noreferrer" className='flex items-center gap-2'>
                            <LuGithub className='size-5' />
                            <span>GitHub</span>
                        </a>
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => setWelcomeMessageShown(true)}>Next</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ) : geohash_persist !== '' ? (
        <GeolocationContext.Provider value={geohash_persist}>
            {children}
        </GeolocationContext.Provider>
    ) : !isGeolocationAvailable ? (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Your browser does not support Geolocation</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please enable Geolocation in your browser settings. The location is not stored anywhere.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => window.location.reload()}>Reload</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ) : !isGeolocationEnabled && !enterCustomChannel ? (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Geolocation is not enabled</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please enable Geolocation in your browser settings. The location is not stored anywhere.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setEnterCustomChannel(true)}>Enter A Custom Channel</AlertDialogAction>
                    <AlertDialogAction onClick={() => window.location.reload()}>Reload</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ) : enterCustomChannel ? (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Geolocation is not enabled</AlertDialogTitle>
                    <AlertDialogDescription>
                        If you don't want to use the geolocation, you can enter a custom channel.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className='flex flex-col gap-3 my-5'>
                    <Label htmlFor="channel">Enter Custom Channel</Label>
                    <Input type="text" placeholder="Channel" id="channel" value={customChannel} onChange={(e) => setCustomChannel(e.target.value)} />
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => { setGeoHash(customChannel); setEnterCustomChannel(false) }}>Change To Channel</AlertDialogAction>
                    <AlertDialogAction onClick={() => window.location.reload()}>Reload</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ) : (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Getting the location data&hellip; </AlertDialogTitle>
                    <AlertDialogDescription>Please wait while we get the location data.</AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    );
}