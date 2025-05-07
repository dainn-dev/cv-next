import { NextResponse } from "next/server"
import { db } from "@/lib/firebase/admin"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    // Fetch the 'data' document from the 'portfolio' collection
    const docRef = db.collection("portfolio").doc("data")
    const doc = await docRef.get()

    if (!doc.exists) {
      return new NextResponse("Portfolio data not found", { status: 404 })
    }

    const data = doc.data()
    const items = data?.items || []
    // Find the item with the matching id
    const item = items.find((item: any) => item.id === id)

    if (!item) {
      return new NextResponse("Portfolio item not found", { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching portfolio item:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 