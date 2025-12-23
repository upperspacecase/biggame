import { notFound } from "next/navigation";
import connectMongo from "@/libs/mongoose";
import Game from "@/models/Game";
import GamePageClient from "./GamePageClient";

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }) {
    await connectMongo();
    const { id } = await params;
    const game = await Game.findById(id).lean();

    if (!game) {
        return { title: "Game not found" };
    }

    return {
        title: `${game.name} | BIG game`,
        description: game.tagline || `Play ${game.name} - a party game for ${game.playerCount?.min}-${game.playerCount?.max} players`,
        openGraph: {
            title: game.name,
            description: game.tagline || `A party game for ${game.playerCount?.min}-${game.playerCount?.max} players`,
            type: "website",
        },
    };
}

export default async function GamePage({ params }) {
    await connectMongo();
    const { id } = await params;

    let game;
    try {
        game = await Game.findById(id).lean();
    } catch {
        notFound();
    }

    if (!game) {
        notFound();
    }

    // Convert MongoDB document to plain object
    const gameData = JSON.parse(JSON.stringify(game));

    return <GamePageClient game={gameData} />;
}
