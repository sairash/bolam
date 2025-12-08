import { useState, useEffect } from "react";
import { type ConnectionStatus } from "@/types/connection";


export default function Connection() {
    const [connection, setConnection] = useState<ConnectionStatus>(navigator.onLine ? 'online' : 'offline')
    const [previousConnection, setPreviousConnection] = useState<ConnectionStatus>(navigator.onLine ? 'online' : 'offline')

    useEffect(() => {
        window.addEventListener('online', () => {
            setConnection('online')
        })
        window.addEventListener('offline', () => {
            setConnection('offline')
        })

        return () => {
            window.removeEventListener('online', () => {
                setConnection('online')
            })
            window.removeEventListener('offline', () => {
                setConnection('offline')
            })
        }
    }, [])


    useEffect(() => {
        if (connection === 'online' && previousConnection !== connection) {
            setConnection('connecting')

            setTimeout(() => {
                setConnection('online')
                setPreviousConnection('online')
            }, 3000)
        }
        setPreviousConnection(connection)

    }, [connection])

    return (
        <>
            {connection === 'offline' && (
                <div className="w-full bg-destructive text-destructive-foreground text-xs text-center">
                    No connection
                </div>
            )}
            {connection === 'connecting' && (
                <div className="w-full bg-primary text-primary-foreground text-xs text-center">
                    Connecting...
                </div>
            )}
        </>

    )
}