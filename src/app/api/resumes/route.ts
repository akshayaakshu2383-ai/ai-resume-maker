import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET all resumes for the current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // We use email as the lookup because id might still be Google ID in some sessions
    // until the user re-logs in or the session is refreshed.
    // The safest way is to find the profile by email.
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!profile) return NextResponse.json([], { status: 200 });

    const { data, error } = await supabaseAdmin
      .from("resumes")
      .select("*")
      .eq("user_id", profile.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("API GET Resumes Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// POST a new resume
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, template_id } = await req.json();

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin
      .from("resumes")
      .insert({
        user_id: profile.id,
        title: title || "Untitled Resume",
        content: content || {},
        template_id: template_id || "minimalist",
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("API POST Resume Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
