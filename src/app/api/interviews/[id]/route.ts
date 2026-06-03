import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";
import jwt from "jsonwebtoken";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "cracktheloop_secret_auth_key_2026_z8y";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get("authorization");
  const jwtToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  if (!jwtToken) {
    return NextResponse.json({ error: "Unauthorized. Token required." }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(jwtToken, NEXTAUTH_SECRET);
    const { id } = await params;

    await connectToDatabase();

    const session = await InterviewSession.findOne({
      _id: id,
      user_id: decoded.user_id
    }).populate("user_id");

    if (!session) {
      return NextResponse.json({ error: "Interview session not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ success: true, interview: session });
  } catch (err: any) {
    console.error("[GET INTERVIEW ID ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to load session" }, { status: 500 });
  }
}
