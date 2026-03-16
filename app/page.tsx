"use client";
// Powered By KalJamsut & XyTeam - XY-MAIL V2
import { useState, useEffect } from "react";
import { db, auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, orderBy, doc, getDoc, setDoc } from "firebase/firestore";
import { LucideCopy, LucideMail, LucideRefreshCcw, LucideX, LucideZap, LucideShieldCheck, LucideCrown, LucideLogIn, LucideLogOut, LucideSettings } from "lucide-react";
import { XY_ASSETS } from "@/lib/assets";

export default function XYUltimateMail() {
  const MY_DOMAIN = "xykel.my.id";
  const [user, setUser] = useState<any>(null);
  const [address, setAddress] = useState("");
  const [emails, setEmails] = useState<any[]>([]);
  const [selectedMail, setSelectedMail] = useState<any>(null);
  const [showBilling, setShowBilling] = useState(false);
  const [customName, setCustomName] = useState("");
  const [userData, setUserData] = useState<any>(null);

  // AUTH OBSERVER
  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, "users", u.uid));
        if (d.exists()) setUserData(d.data());
      } else {
        setUser(null);
        setUserData(null);
      }
    });
  }, []);

  // INIT ADDRESS
  useEffect(() => {
    const saved = localStorage.getItem("xy_addr");
    if (saved) setAddress(saved); else generateRandom();
  }, []);

  const generateRandom = () => {
    const addr = `${Math.random().toString(36).substring(2, 8)}@${MY_DOMAIN}`;
    setAddress(addr);
    localStorage.setItem("xy_addr", addr);
  };

  // REALTIME INBOX
  useEffect(() => {
    if (!address) return;
    const q = query(collection(db, "emails"), where("to", "==", address.toLowerCase()), orderBy("createdAt", "desc"));
    return onSnapshot(q, (s) => setEmails(s.docs.map(d => ({id: d.id, ...d.data()}))));
  }, [address]);

  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); } catch (e) { alert("Login Failed"); }
  };

  const buyPlan = async (plan: string) => {
    if (!user) return alert("Login dulu Kal!");
    // Simulasi Payment Success -> Update DB
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      plan: plan,
      customAlias: customName || user.email.split('@')[0],
      updatedAt: new Date()
    }, { merge: true });
    alert(`Paket ${plan} Aktif!`);
    setShowBilling(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-black font-mono p-4 md:p-10 border-[15px] border-black">
      {/* NAVBAR */}
      <nav className="flex flex-col md:flex-row justify-between items-center mb-12 border-b-8 border-black pb-6 gap-6">
        <div>
          <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none select-none">XY-MAIL<span className="text-blue-600">.BOX</span></h1>
          <p className="bg-black text-white inline-block px-2 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">SaaS Edition // {XY_ASSETS.branding}</p>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <button onClick={handleLogin} className="bg-yellow-400 border-4 border-black px-6 py-3 font-black flex items-center gap-2 hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_0px_black] active:shadow-none transition-all">
              <LucideLogIn/> LOGIN GOOGLE
            </button>
          ) : (
            <div className="flex items-center gap-4 bg-white border-4 border-black p-2 pr-4 shadow-[4px_4px_0px_0px_black]">
              <img src={user.photoURL} className="w-10 h-10 border-2 border-black" />
              <div className="text-[10px] font-black uppercase">
                <p>{user.displayName}</p>
                <p className="text-blue-600">PLAN: {userData?.plan || "FREE"}</p>
              </div>
              <button onClick={() => signOut(auth)} className="text-red-500 hover:scale-110"><LucideLogOut size={18}/></button>
            </div>
          )}
        </div>
      </nav>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* PANEL KIRI */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-white border-4 border-black p-6 shadow-[10px_10px_0px_0px_black]">
            <h2 className="text-2xl font-black uppercase underline decoration-blue-600 mb-6 flex items-center gap-2 italic">
              <LucideSettings/> Configuration
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-black uppercase mb-2 block text-gray-400 italic">Target Mailbox</label>
                <div className="bg-blue-600 text-white border-4 border-black p-5 text-2xl font-black break-all flex justify-between items-center">
                  {address}
                  <button onClick={() => {navigator.clipboard.writeText(address)}} className="hover:scale-110"><LucideCopy/></button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase block text-gray-400 italic">Custom Alias (Premium)</label>
                <div className="flex border-4 border-black group">
                  <input 
                    type="text" 
                    placeholder="kall-ganteng" 
                    className="flex-1 p-4 font-black outline-none uppercase placeholder:opacity-30" 
                    onChange={(e)=>setCustomName(e.target.value)}
                  />
                  <div className="bg-gray-200 border-l-4 border-black p-4 font-black">@{MY_DOMAIN}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => {
                     if(userData?.plan) setAddress(`${customName}@${MY_DOMAIN}`);
                     else setShowBilling(true);
                   }} className="bg-yellow-400 border-4 border-black py-4 font-black uppercase hover:bg-black hover:text-white transition-all">Set Alias</button>
                   <button onClick={generateRandom} className="bg-white border-4 border-black py-4 font-black uppercase hover:bg-gray-100 transition-all flex justify-center items-center gap-2"><LucideRefreshCcw size={18}/> New Random</button>
                </div>
              </div>

              <button onClick={() => setShowBilling(true)} className="w-full bg-pink-500 text-white border-4 border-black py-4 font-black uppercase text-xl italic flex items-center justify-center gap-3 hover:bg-black transition-all shadow-[6px_6px_0px_0px_#db2777]">
                <LucideCrown/> Upgrade To Premium
              </button>
            </div>
          </section>

          <div className="bg-black text-white p-6 border-4 border-black italic font-black text-xs space-y-2">
            <p className="text-blue-400 flex items-center gap-2"><LucideShieldCheck size={14}/> SECURITY STATUS: ENCRYPTED</p>
            <p className="flex items-center gap-2"><LucideZap size={14}/> CONNECTION: VERCEL_EDGE_STABLE</p>
          </div>
        </div>

        {/* PANEL KANAN (INBOX) */}
        <div className="lg:col-span-7">
          <div className="bg-white border-8 border-black shadow-[15px_15px_0px_0px_#2563eb] min-h-[600px] flex flex-col">
            <div className="bg-black text-white p-4 font-black uppercase tracking-widest flex justify-between items-center">
              <span className="flex items-center gap-2 italic"><LucideMail/> Inbox_Manager.exe</span>
              <span className="bg-green-600 px-2 py-0.5 text-[10px] animate-pulse">● Recv_Data</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {emails.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-10 py-40">
                  <LucideMail size={120} strokeWidth={3} />
                  <p className="text-4xl font-black uppercase italic mt-4 underline">No Data</p>
                </div>
              ) : (
                emails.map(mail => (
                  <div key={mail.id} onClick={() => setSelectedMail(mail)} className="p-6 border-b-4 border-black hover:bg-blue-50 cursor-pointer transition-all flex justify-between items-center group">
                    <div className="truncate pr-10">
                      <p className="text-[10px] font-black text-blue-600 uppercase mb-1">{mail.from}</p>
                      <h4 className="text-xl font-black uppercase truncate group-hover:underline">{mail.subject}</h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-1">{new Date(mail.createdAt?.seconds*1000).toLocaleString()}</p>
                    </div>
                    <div className="bg-black text-white p-3 border-2 border-black group-hover:bg-blue-600"><LucideZap/></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER RAME */}
      <footer className="mt-32 border-t-[10px] border-black pt-12 pb-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <h2 className="text-4xl font-black italic mb-4 uppercase">XY-Infrastructure</h2>
          <p className="font-bold text-sm uppercase leading-relaxed text-gray-600">
            Sistem Tempmail SaaS paling brutal. Dibangun untuk keamanan tingkat hardcore. 
            Mendukung email permanen dan custom alias untuk user premium. 
            Powered by KalJamsut Dev Team.
          </p>
          <div className="flex gap-4 mt-6">
            <div className="bg-white border-4 border-black p-2 font-black text-xs">FIREBASE_REALTIME</div>
            <div className="bg-white border-4 border-black p-2 font-black text-xs">NEXTJS_V15</div>
            <div className="bg-white border-4 border-black p-2 font-black text-xs">TAILWIND_V4</div>
          </div>
        </div>
        <div>
          <h4 className="font-black uppercase mb-4 underline decoration-4 decoration-blue-500">Links</h4>
          <ul className="text-xs font-black space-y-3 uppercase">
            <li className="hover:text-blue-600 cursor-pointer">{'>'} Developer Portfolio</li>
            <li className="hover:text-blue-600 cursor-pointer">{'>'} XY-Store Official</li>
            <li className="hover:text-blue-600 cursor-pointer">{'>'} API Documentation</li>
            <li className="hover:text-blue-600 cursor-pointer">{'>'} Privacy Policy</li>
          </ul>
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="text-right">
              <p className="font-black text-sm italic uppercase">{XY_ASSETS.branding}</p>
              <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">{XY_ASSETS.copyright}</p>
           </div>
           <div className="w-20 h-20 bg-black border-4 border-blue-600 flex items-center justify-center text-white font-black text-3xl italic shadow-[5px_5px_0px_0px_#2563eb]">XY</div>
        </div>
      </footer>

      {/* BILLING MODAL */}
      {showBilling && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white border-[10px] border-black p-10 max-w-6xl w-full shadow-[30px_30px_0px_0px_#db2777] relative overflow-y-auto max-h-[90vh]">
             <button onClick={()=>setShowBilling(false)} className="absolute top-5 right-5 bg-red-500 text-white p-2 border-4 border-black font-black hover:rotate-90 transition-all"><LucideX size={32}/></button>
             <h2 className="text-6xl font-black italic uppercase mb-12 border-b-[10px] border-black inline-block">Subscription_Plans.exe</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {id: "NYAWIT", price: "5K", color: "bg-green-400", features: ["Custom Alias", "7 Days Storage", "Standard Route"]},
                  {id: "MAYAN", price: "10K", color: "bg-blue-400", features: ["Unlimited Alias", "1 Month Storage", "Express Server"]},
                  {id: "PROPLER", price: "20K", color: "bg-pink-500", features: ["PERMANENT MAIL", "No Auto-Delete", "Priority Support"]}
                ].map(p => (
                  <div key={p.id} className={`${p.color} border-8 border-black p-8 shadow-[10px_10px_0px_0px_black] flex flex-col`}>
                    <h3 className="text-4xl font-black italic uppercase underline decoration-4 mb-4">{p.id}</h3>
                    <div className="text-5xl font-black mb-6">Rp {p.price}<span className="text-xs uppercase">/Month</span></div>
                    <ul className="flex-1 space-y-4 mb-10">
                      {p.features.map(f => <li key={f} className="font-black text-xs uppercase flex items-center gap-2"><div className="w-3 h-3 bg-black"/> {f}</li>)}
                    </ul>
                    <button onClick={() => buyPlan(p.id)} className="w-full bg-black text-white py-5 font-black uppercase text-xl border-4 border-black hover:bg-white hover:text-black transition-all">Pilih Paket</button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* MODAL BACA EMAIL (HTML READY) */}
      {selectedMail && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[1000] backdrop-blur-sm">
          <div className="bg-white border-[8px] border-black w-full max-w-5xl h-[85vh] flex flex-col shadow-[20px_20px_0px_0px_#2563eb]">
            <div className="bg-yellow-400 p-5 border-b-8 border-black flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase italic truncate">{selectedMail.subject}</h3>
              <button onClick={()=>setSelectedMail(null)} className="bg-black text-white p-2 border-4 border-white hover:bg-red-600 transition-all"><LucideX/></button>
            </div>
            <div className="bg-gray-100 p-3 border-b-4 border-black text-[10px] font-black flex gap-6">
              <span>SENDER: {selectedMail.from}</span>
              <span>DEST: {selectedMail.to}</span>
              <span className="text-blue-600">ID: {selectedMail.id}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-10 bg-white font-sans prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: selectedMail.content }} />
            </div>
            <div className="p-4 bg-black text-white text-[10px] font-black flex justify-between uppercase">
              <span>XY-Encryption: Verified</span>
              <span>Destroy_Date: {new Date(selectedMail.deleteAt?.seconds*1000).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .prose img { max-width: 100%; border: 4px solid black; }
        .prose a { color: #2563eb; text-decoration: underline; font-weight: 800; }
        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #fff; border: 3px solid #000; }
      `}</style>
    </div>
  );
}