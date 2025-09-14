import { useContext } from "react"
import { GeolocationContext } from "@/context/GeolocationContext"


export const useGeolocation = () => {
    const geo = useContext(GeolocationContext)
    
    if (!geo) {
      throw new Error('useGeolocation must be used within a GeolocationProvider')
    }

    return geo
  }