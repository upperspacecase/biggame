import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Game from "@/models/Game";

// GET /api/games - List all games with optional filtering
export async function GET(request) {
    try {
        await connectMongo();

        const { searchParams } = new URL(request.url);
        const tag = searchParams.get("tag");
        const random = searchParams.get("random");
        const search = searchParams.get("search");

        let query = {};

        // Filter by tag (category)
        if (tag && tag !== "all") {
            // Handle special filters
            if (tag === "High" || tag === "Low" || tag === "Medium") {
                // Energy level filter
                query.energy = tag;
            } else if (tag === "quick") {
                // Quick games (under 5 min)
                query["duration.max"] = { $lte: 5 };
            } else if (tag === "large") {
                // Large groups (8+ players)
                query["playerCount.max"] = { $gte: 8 };
            } else if (tag === "noprops") {
                // No props needed
                query.propsNeeded = false;
            } else {
                // Regular category tag
                query.tags = { $regex: new RegExp(tag, "i") };
            }
        }

        // Search by name if provided
        if (search) {
            query.name = { $regex: new RegExp(search, "i") };
        }

        let games;

        if (random === "true") {
            // Get a random game
            const count = await Game.countDocuments(query);
            const randomIndex = Math.floor(Math.random() * count);
            games = await Game.findOne(query).skip(randomIndex);
            return NextResponse.json(games ? [games] : []);
        } else {
            // Get all games matching query, sorted by number
            games = await Game.find(query).sort({ number: 1 });
        }

        return NextResponse.json(games);
    } catch (error) {
        console.error("Error fetching games:", error);
        return NextResponse.json(
            { error: "Failed to fetch games" },
            { status: 500 }
        );
    }
}

// POST /api/games - Create a new game
export async function POST(request) {
    try {
        await connectMongo();

        const body = await request.json();

        // Auto-generate number if not provided
        if (!body.number) {
            const count = await Game.countDocuments();
            body.number = `#${String(count + 1).padStart(3, "0")}`;
        }

        const game = await Game.create(body);

        return NextResponse.json(game, { status: 201 });
    } catch (error) {
        console.error("Error creating game:", error);
        return NextResponse.json(
            { error: "Failed to create game" },
            { status: 500 }
        );
    }
}
