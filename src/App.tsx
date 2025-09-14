import MessagesContainer from './MessagesContainer'
import GeolocationProvider from './provider/GeolocationProvider'

function App() {
  return (
    <GeolocationProvider>
      <MessagesContainer />
    </GeolocationProvider>
  )
}

export default App
