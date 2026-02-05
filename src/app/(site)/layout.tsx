import { Navbar } from "@/components/layout/Navbar";
import { PlayerProvider } from "@/lib/PlayerContext";
import { GlobalPlayer } from "@/components/beats/GlobalPlayer";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PlayerProvider>
            <div className="relative min-h-screen flex flex-col pb-24">
                <main className="flex-1 flex flex-col">
                    {children}
                </main>
                <GlobalPlayer />
            </div>
        </PlayerProvider>
    );
}
