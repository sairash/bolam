import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel
} from "@/components/ui/alert-dialog"
import { LuGithub } from 'react-icons/lu';

export function InfoModal({
    closeText = "Close",
    close,
}: {
    closeText?: string;
    close: () => void;
}) {
    return (
        <AlertDialog
            onOpenChange={() => close()}
            open={true}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Bolam: बोलम <span className="text-sm font-normal text-muted-foreground">(Nepali word for "let's talk")</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <span className="flex flex-col gap-4">
                            <img
                                src="/bolam-logo.svg"
                                alt="Bolam Logo"
                                width={100}
                                height={100}
                                className="mb-0"
                            />
                            <span>
                                Bolam is a decentralized peer-to-peer chat app that lets you
                                connect directly with others without relying on central servers or
                                storing any data. You can join channels to chat with people
                                worldwide or enable location access to discover and talk with
                                users nearby. All data, including your location, stays only in
                                your browser, ensuring privacy. Built on torrent technology,
                                Bolam bypasses censorship while giving you full control to
                                easily add or remove trackers, making your conversations
                                private, resilient, and truly yours.
                            </span>
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer" asChild>
                        <a
                            href="https://github.com/sairash/bolam"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                        >
                            <LuGithub className="size-5" />
                            <span>GitHub</span>
                        </a>
                    </AlertDialogCancel>

                    <AlertDialogAction onClick={() => close()}>
                        {closeText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}