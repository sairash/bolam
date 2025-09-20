import { usePeerStore } from "@/store/peer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowDown, ArrowUp, SendHorizonal, Upload } from "lucide-react";
import { useState, useCallback } from "react";
import { usePersistStore } from "@/store/persist";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { useDropzone } from "react-dropzone";

function DialogUpload() {
    const sendFile = usePeerStore((state) => state.sendFile);
    const username = usePersistStore((state) => state.username);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
            'image/gif': [],
            'image/webp': [],
            'image/svg': [],
            'image/bmp': [],
            'image/tiff': [],
            'image/ico': [],
            // 'video/mp4': [],
            // 'video/mov': [],
            // 'video/avi': [],
            // 'audio/mp3': [],
            // 'audio/wav': [],
            // 'audio/ogg': [],
            // 'application/pdf': [],
            // 'application/doc': [],
            // 'application/docx': [],
            // 'application/txt': [],
        },
        maxFiles: 1,
        multiple: false,
    });


    const handleSendFile = useCallback(() => {
        if (acceptedFiles.length > 0 && acceptedFiles[0]) {
            sendFile(crypto.randomUUID(), username, acceptedFiles[0], 'file')
        }
        setIsUploadOpen(false)
        
    }, [acceptedFiles, sendFile, username, setIsUploadOpen])

    const files = acceptedFiles.map(file => (
        file.type.startsWith('image/') ? (
            <img className="h-20" src={URL.createObjectURL(file)} alt={file.name} />
        ) : (
            <div key={file.path}>
                {file.path} - {file.size} bytes
            </div>
        )
    ));

    return (
        <>
        <Button type="submit" variant="secondary" className="cursor-pointer" onClick={() => setIsUploadOpen(true)}>
            <Upload />
        </Button>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                </DialogDescription>
                <section className="w-full">
                    <div {...getRootProps({ className: 'h-20 flex items-center justify-center bg-secondary p-2 mb-4 border border-dashed border-gray-300 rounded-md' })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                    <aside>
                        <h4>Files</h4>
                        {files}
                    </aside>
                </section>
                <DialogFooter>
                    <Button type="submit" variant="secondary" className="cursor-pointer" onClick={handleSendFile}>
                        Send
                    </Button>
                    <Button variant="secondary" className="cursor-pointer" onClick={() => setIsUploadOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>

    );


}


export default function Message() {
    const client = usePeerStore((state) => state.client);
    const [message, setMessage] = useState('');
    const peerId = usePeerStore((state) => state.peerId);
    const sendMessage = usePeerStore((state) => state.sendMessage);
    const username = usePersistStore((state) => state.username);
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
        
            <div className="flex gap-2 relative">
                <div className="absolute right-0 -top-5 text-muted-foreground text-xs flex gap-2">
                    {client && <div className="flex items-center gap-1">{Math.trunc(client.downloadSpeed)} KB/s <ArrowDown size={12} /></div>}
                    {client && <div className="flex items-center gap-1">{Math.trunc(client.uploadSpeed)} KB/s <ArrowUp size={12} /></div>}
                </div>
                <Input placeholder="Message... or /help" value={message} onChange={handleChange} onKeyDown={handleKeyDown} />
                {/* {Upload Dialog} */}
                <DialogUpload />
                <Button type="submit" className="cursor-pointer" onClick={handleSubmit}>
                    <SendHorizonal />
                </Button>
            </div>

        </>
    )
}