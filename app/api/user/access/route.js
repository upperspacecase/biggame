import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ hasAccess: false });
        }

        await connectMongo();

        const dbUser = await User.findOne({ clerkId: user.id });

        if (!dbUser) {
            return NextResponse.json({ hasAccess: false });
        }

        return NextResponse.json({ hasAccess: dbUser.hasAccess || false });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
