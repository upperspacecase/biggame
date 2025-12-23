import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectMongo();

        // Find or create user
        let dbUser = await User.findOne({ clerkId: user.id }).populate("favorites");

        if (!dbUser) {
            dbUser = await User.create({
                clerkId: user.id,
                email: user.emailAddresses[0]?.emailAddress,
                name: `${user.firstName} ${user.lastName}`.trim(),
                image: user.imageUrl,
                favorites: [],
            });
        }

        return NextResponse.json(dbUser.favorites);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { gameId } = await req.json();

        if (!gameId) {
            return NextResponse.json({ error: "Game ID required" }, { status: 400 });
        }

        await connectMongo();

        // Ensure user exists
        let dbUser = await User.findOne({ clerkId: user.id });
        if (!dbUser) {
            dbUser = await User.create({
                clerkId: user.id,
                email: user.emailAddresses[0]?.emailAddress,
                name: `${user.firstName} ${user.lastName}`.trim(),
                image: user.imageUrl,
                favorites: [],
            });
        }

        // Toggle favorite
        const isFavorite = dbUser.favorites.includes(gameId);

        if (isFavorite) {
            dbUser.favorites = dbUser.favorites.filter(id => id.toString() !== gameId);
        } else {
            dbUser.favorites.push(gameId);
        }

        await dbUser.save();

        return NextResponse.json({
            favorites: dbUser.favorites,
            isFavorite: !isFavorite
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
