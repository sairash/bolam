import { NavLink } from "react-router";
import { ScrollArea } from "./components/ui/scroll-area";
import Color from "./components/Color";
import { BadgeInfo, MapPin } from "lucide-react"
import { Button } from "./components/ui/button";
import { useState } from "react";
import { generateRandomString } from "./helper/usernameGen";
import { InfoModal } from "./components/infoModal";
// import happyGif from "@/assets/happy.gif"
import lolGif from "@/assets/lol.gif"

const randomStringLength = 6
function App() {
  const [ranodmName, setRandomName] = useState(generateRandomString(randomStringLength));
  const [isOpenInfo, setIsOpenInfo] = useState(false);

  const generateNew = () => {
    setRandomName(generateRandomString(randomStringLength))
  }
  return (
    <>
      <div className="flex flex-col h-screen w-screen p-2 overflow-hidden">
        <div className="flex justify-between">
          <div className="text-base font-medium">
            <Button variant="ghost" asChild size="default" className='cursor-pointer px-1' onClick={() => generateNew()}>
              <span>
                Bolam /
                <Color name={ranodmName}>बोलम</Color>
              </span>
            </Button>
          </div>
          <div className="">
            <Button variant="ghost" asChild size="default" className='cursor-pointer px-1' onClick={() => setIsOpenInfo(true)}>
              <span>
                <BadgeInfo />
              </span>
            </Button>
          </div>
        </div>
        <ScrollArea className="h-full w-full pt-2">
          <NavLink to="/chat/location">
            <div className="w-full border p-2 py-6 flex gap-2 hover:bg-secondary"><span>Go to Location Chat</span> <MapPin className="mt-0.5" size={18} /></div>
          </NavLink>
            <div className="w-full border border-dashed p-2 py-6 flex gap-2 hover:bg-secondary h-64 mt-2 flex justify-center items-center">
              Other Features comming soon! <img className="h-16 mb-5" src={lolGif} />
            </div>
        </ScrollArea>
      </div>
      {isOpenInfo && <InfoModal closeText="Close" close={() => setIsOpenInfo(false)} />}
    </>
  )
}

export default App
