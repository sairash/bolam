import { usePeerStore } from "@/store/peer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SendHorizonal, Upload } from "lucide-react";
import { useState, useCallback } from "react";
import { usePersistStore } from "@/store/persist";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

export default function Message() {
    const [message, setMessage] = useState('');
    const peerId = usePeerStore((state) => state.peerId);
    const sendMessage = usePeerStore((state) => state.sendMessage);
    const username = usePersistStore((state) => state.username);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    }

    const handleSubmit = useCallback(() => {
        if (!peerId) return;

        const messageContent = message.trim();
        setMessage('');
        if (!messageContent) return;

        const id = crypto.randomUUID();

        sendMessage(id, username, messageContent, 'chat');
    }, [message, peerId, sendMessage, username])
    return (
        <>
            <div className="flex gap-2">
                <Input placeholder="Message... or /help" value={message} onChange={handleChange} onKeyDown={handleKeyDown} />
                <Button type="submit" variant="secondary" className="cursor-pointer" onClick={() => setIsUploadOpen(true)}>
                    <Upload />
                </Button>
                <Button type="submit"  className="cursor-pointer" onClick={handleSubmit}>
                    <SendHorizonal />
                </Button>
            </div>

            {/* {Upload Dialog} */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Files</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Upload file function comming soon.
                    </DialogDescription>
                    <DialogFooter>
                        <Button type="submit" variant="secondary" className="cursor-pointer" onClick={() => setIsUploadOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                    </DialogContent>
            </Dialog>
        </>
    )
}