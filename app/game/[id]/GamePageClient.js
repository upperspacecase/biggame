"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GameDetailModal from "@/components/GameDetailModal";
import GamePlayMode from "@/components/GamePlayMode";

export default function GamePageClient({ game }) {
    const router = useRouter();
    const [showPlayMode, setShowPlayMode] = useState(false);

    const handleClose = () => {
        router.push("/");
    };

    const handleEdit = () => {
        // For now, redirect to home - could implement inline editing later
        router.push("/?edit=" + game._id);
    };

    const handleStartGame = () => {
        setShowPlayMode(true);
    };

    if (showPlayMode) {
        return (
            <GamePlayMode
                game={game}
                onClose={() => setShowPlayMode(false)}
            />
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "var(--bg-cream)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
        }}>
            <GameDetailModal
                game={game}
                onClose={handleClose}
                onEdit={handleEdit}
                onStartGame={handleStartGame}
            />
        </div>
    );
}
