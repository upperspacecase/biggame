import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Game from "@/models/Game";

// GET /api/games/[id] - Get single game
export async function GET(request, { params }) {
    try {
        await connectMongo();
        const { id } = await params;

        const game = await Game.findById(id);

        if (!game) {
            return NextResponse.json(
                { error: "Game not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(game);
    } catch (error) {
        console.error("Error fetching game:", error);
        return NextResponse.json(
            { error: "Failed to fetch game" },
            { status: 500 }
        );
    }
}

// PUT /api/games/[id] - Update game
export async function PUT(request, { params }) {
    try {
        await connectMongo();
        const { id } = await params;
        const body = await request.json();

        const game = await Game.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!game) {
            return NextResponse.json(
                { error: "Game not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(game);
    } catch (error) {
        console.error("Error updating game:", error);
        return NextResponse.json(
            { error: "Failed to update game" },
            { status: 500 }
        );
    }
}

// DELETE /api/games/[id] - Delete game
export async function DELETE(request, { params }) {
    try {
        await connectMongo();
        const { id } = await params;

        const game = await Game.findByIdAndDelete(id);

        if (!game) {
            return NextResponse.json(
                { error: "Game not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Game deleted successfully" });
    } catch (error) {
        console.error("Error deleting game:", error);
        return NextResponse.json(
            { error: "Failed to delete game" },
            { status: 500 }
        );
    }
}
