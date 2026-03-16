// Powered By KalJamsut & XyTeam
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const secret = req.headers.get("X-XY-SECRET");
    if (secret !== "KALL_SECRET_123") {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    
    // Logic: 3 hari dari sekarang (dalam Milliseconds)
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    const deleteAt = new Date(Date.now() + threeDaysInMs);

    await addDoc(collection(db, "emails"), {
      from: body.from,
      to: body.to,
      subject: body.subject || "No Subject",
      content: body.content,
      createdAt: serverTimestamp(),
      deleteAt: deleteAt, // Digunakan untuk Index TTL Firebase
    });

    return new Response("OK", { status: 200 });
  } catch (err) {
    return new Response("Error", { status: 500 });
  }
}