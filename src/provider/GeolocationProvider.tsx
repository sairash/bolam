import { GeolocationContext } from '@/context/GeolocationContext'
import { useState, useEffect } from 'react'
import { useGeolocated } from "react-geolocated";
import * as geokit from 'geokit';

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
import { InfoModal } from '@/components/infoModal';

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
            const geoHash = geokit.hash({
                lat: coords.latitude,
                lng: coords.longitude
            }, 6)
            setGeoHash(geoHash)
        }
    }, [coords, setGeoHash])


    return !welcomeMessageShown ? (
        <InfoModal closeText='Next' close={() => setWelcomeMessageShown(true)} />
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