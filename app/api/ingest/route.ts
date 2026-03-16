import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const secret = req.headers.get("X-XY-SECRET");
    if (secret !== "KALL_SECRET_123") return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const toEmail = body.to.toLowerCase();
    const username = toEmail.split('@')[0];

    // Cek Status Premium di Collection 'users'
    let expiryHours = 72; // Default 3 hari
    const userQ = query(collection(db, "users"), where("customAlias", "==", username), limit(1));
    const userSnapshot = await getDocs(userQ);

    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      if (userData.plan === "PROPLER") expiryHours = 87600; // Permanent
      else if (userData.plan === "MAYAN") expiryHours = 720; // 1 Bulan
      else if (userData.plan === "NYAWIT") expiryHours = 168; // 1 Minggu
    }

    const deleteAt = new Date(Date.now() + (expiryHours * 60 * 60 * 1000));

    await addDoc(collection(db, "emails"), {
      from: body.from,
      to: toEmail,
      subject: body.subject || "No Subject",
      content: body.content,
      createdAt: serverTimestamp(),
      deleteAt: deleteAt,
      isPermanent: expiryHours > 1000
    });

    return new Response("OK", { status: 200 });
  } catch (err) {
    return new Response("Error", { status: 500 });
  }
}