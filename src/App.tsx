import MessagesContainer from './MessagesContainer'
import ConnectionProvider from './provider/ConnectionProvider'
import GeolocationProvider from './provider/GeolocationProvider'

function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <ConnectionProvider>
        <GeolocationProvider>
          <MessagesContainer />
        </GeolocationProvider>
      </ConnectionProvider>
    </div>
  )
}

export default App
