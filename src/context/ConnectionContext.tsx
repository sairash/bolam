import { createContext } from 'react'
import { type ConnectionStatus } from '@/types/connection'

export const ConnectionContext = createContext<ConnectionStatus>('offline')