
import { useEffect, useState } from "react"
import Color from "./Color"
import moment from "moment"
import { usePeerStore } from "@/store/peer"
// import { Button } from "./ui/button"
// import { BsEmojiSurpriseFill } from "react-icons/bs";

// import { ImBug, ImTux } from "react-icons/im";
// import { Award, Cat } from "lucide-react";

export default function Message({ message, timestamp, isSelf, peerId }: { message: string, timestamp: string, isSelf: boolean, peerId: string }) {
    const activeUsers = usePeerStore((state) => state.activeUsers)
    const [user, setUser] = useState({ username: '', randomString: '' })
    let formattedTimestamp = ""

    if (moment().diff(moment(Number(timestamp)), 'days') > 1) {
        formattedTimestamp = moment(Number(timestamp)).format('MMM DD, YYYY')
    } else {
        formattedTimestamp = moment(Number(timestamp)).format('HH:mm:ss')
    }


    useEffect(() => {
        console.log('activeUsers', 'changing', 'username')
        setUser(activeUsers[peerId] || { username: '', randomString: '' })
    }, [activeUsers, peerId])

    return (
        <div className="relative group">
            <div className={`p-1 py-2  ${isSelf ? 'bg-secondary' : 'bg-base'}`}>
                <div className="">
                    <Color name={`@${user.username}#${user.randomString}`}>
                        <span className="font-bold pr-2">{`<${user.username}#${user.randomString}>`}</span>
                        <span className="pr-2">{message}</span>
                        <span className="text-sm text-muted-foreground">{`[${formattedTimestamp}]`}</span>
                    </Color>
                </div>
                {/* <div className="px-1 pt-1">
                <Button variant="outline" size='sm'><span className="flex gap-1"><Award color="yellow" />1</span></Button>
                </div> */}
            </div>
            {/* <div className="z-10 absolute right-0 hidden group-hover:flex w-72 flex justify-end">
                <Button variant="outline" size='lg'><Award color="yellow" /></Button>
                <Button variant="outline" size='lg'><ImBug color="skyblue"/></Button>
                <Button variant="outline" size='lg'><Cat color="pink" /></Button>
                <Button variant="outline" size='lg'><ImTux color="lightgreen" /></Button>
                <Button variant="outline" size='lg'><BsEmojiSurpriseFill color="grey" /></Button>
            </div> */}
        </div>
    )
}