import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { CodeSketch } from "@/configs/schema";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Received Data:", body);

        const { description, imageUrl, model, uid, email } = body;

        const result = await db.insert(CodeSketch).values({
            description,
            imageURL: imageUrl,
            model,
            uid : uid,
            createdBy: email,
        }).returning();

        console.log("Insert Result:", result);
        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error("Error:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}