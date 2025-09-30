import { ConnectionContext } from "@/context/ConnectionContext";
import { useState, useEffect } from "react";

export default function ConnectionProvider({ children }: { children: React.ReactNode }) {
    const [connection, setConnection] = useState(navigator.onLine)

    useEffect(() => {
        window.addEventListener('online', () => {
            setConnection(true)
        })
        window.addEventListener('offline', () => {
            setConnection(false)
        })

        return () => {
            window.removeEventListener('online', () => {
                setConnection(true)
            })
            window.removeEventListener('offline', () => {
                setConnection(false)
            })
        }
    }, [])

    return (
        <ConnectionContext.Provider value={connection}>
            {!connection && (
                <div className="w-full bg-destructive text-destructive-foreground text-xs text-center">
                    No connection
                </div>
            )}
            {children}
        </ConnectionContext.Provider>
    )
}