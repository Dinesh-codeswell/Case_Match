import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resourceId = parseInt(params.id)
    
    if (isNaN(resourceId)) {
      return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 })
    }

    // First, try to increment the view count
    const { data: incrementData, error: incrementError } = await supabaseAdmin
      .rpc("increment_view_count", { resource_id_param: resourceId })

    if (incrementError) {
      // If the resource doesn't exist in the views table, create it with initial count
      const { data: newData, error: insertError } = await supabaseAdmin
        .from("resource_views")
        .insert({ resource_id: resourceId, view_count: 2500 })
        .select("view_count")
        .single()

      if (insertError) {
        console.error("Error creating resource view record:", insertError)
        return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
      }

      return NextResponse.json({ viewCount: newData.view_count })
    }

    return NextResponse.json({ viewCount: incrementData })
  } catch (error) {
    console.error("Error in resource view API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resourceId = parseInt(params.id)
    
    if (isNaN(resourceId)) {
      return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 })
    }

    // Get the current view count for this resource
    const { data, error } = await supabaseAdmin
      .from("resource_views")
      .select("view_count")
      .eq("resource_id", resourceId)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // Resource not found in views table, return default
        return NextResponse.json({ viewCount: 2500 })
      }
      console.error("Error fetching resource view count:", error)
      return NextResponse.json({ error: "Failed to fetch view count" }, { status: 500 })
    }

    return NextResponse.json({ viewCount: data.view_count })
  } catch (error) {
    console.error("Error in resource view API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}