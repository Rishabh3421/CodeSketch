import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { CodeSketch, usersTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received Data:", body);

    const { description, imageUrl, model, uid, email } = body;

    // Fetch user credits
    const credits = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (credits[0]?.credits && credits[0].credits > 0) {
      // Insert sketch
      const result = await db
        .insert(CodeSketch)
        .values({
          description,
          imageURL: imageUrl,
          model,
          uid,
          createdBy: email,
        })
        .returning();

        const data = await db.update(usersTable).set({
          credits: credits[0].credits - 1,
        }).where(eq(usersTable.email, email));

      // console.log("Insert Result:", result);
      return NextResponse.json({ success: true, result });
    } else {
      return NextResponse.json(
        { success: false, error: "Not enough credits" },
        { status: 403 }
      );
    }
  } catch (error: any) {
    // console.error("Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const uid = searchParams?.get("uid");
  const email = searchParams?.get("email");
  if (uid) {
    const result = await db
      .select()
      .from(CodeSketch)
      .where(eq(CodeSketch.uid, uid));
    return NextResponse.json(result[0]);
  }else if(email){
    const result = await db
     .select()
     .from(CodeSketch)
     .where(eq(CodeSketch.createdBy, email));
    return NextResponse.json(result);
  }
  return NextResponse.json({ error: "No Data Found" });
}

export async function PUT(req: NextRequest) {
  try {
    const { uid, CodeResponse } = await req.json();

    const result = await db
      .update(CodeSketch)
      .set({ code: CodeResponse })
      .where(eq(CodeSketch.uid, uid))
      .returning({ uid: CodeSketch.uid });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      console.error("PUT Error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    } else {
      console.error("PUT Error:", error);
      return NextResponse.json(
        { success: false, error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}

