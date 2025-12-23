"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import GameDetailModal from "@/components/GameDetailModal";
import GamePlayMode from "@/components/GamePlayMode";
import PricingModal from "@/components/PricingModal";

export default function GamePageClient({ game }) {
    const router = useRouter();
    const { isSignedIn } = useUser();
    const [showPlayMode, setShowPlayMode] = useState(false);
    const [showPricing, setShowPricing] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        if (isSignedIn) {
            fetch("/api/user/access")
                .then(res => res.json())
                .then(data => setHasAccess(data.hasAccess))
                .catch(err => console.error(err));
        } else {
            setHasAccess(false);
        }
    }, [isSignedIn]);

    const handleClose = () => {
        router.push("/");
    };

    const handleEdit = () => {
        router.push("/?edit=" + game._id);
    };

    const handleStartGame = () => {
        if (hasAccess) {
            setShowPlayMode(true);
        } else {
            setShowPricing(true);
        }
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

            {showPricing && (
                <PricingModal onClose={() => setShowPricing(false)} />
            )}
        </div>
    );
}
