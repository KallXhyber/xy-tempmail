"use client";
import { useState, useEffect } from "react";
import { LucideCopy, LucideTrash2, LucideMail, LucideRefreshCcw, LucideShieldCheck } from "lucide-react";
import { XY_ASSETS } from "@/lib/assets";

export default function XYTempMail() {
  const [address, setAddress] = useState("loading...");
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate random email address (Contoh: user_xyz@domain.com)
  useEffect(() => {
    const randomTag = Math.random().toString(36).substring(7);
    setAddress(`xy_${randomTag}@yourdomain.com`);
    // Simulasi loading skeleton origin
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-black font-mono p-4 md:p-10">
      {/* HEADER SECTION */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10 border-b-4 border-black pb-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">XY-TEMPMAIL</h1>
          <p className="text-sm font-bold text-blue-600">{XY_ASSETS.branding}</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs font-black uppercase">Status: <span className="text-green-500 underline">System Online</span></p>
          <p className="text-xs font-bold">Expires in: 72 Hours</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Address Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            <label className="text-xs font-black uppercase block mb-2 text-gray-500">Your Temp Address</label>
            <div className="flex items-center gap-2 bg-blue-50 border-2 border-dashed border-black p-4 mb-4">
              <span className="text-lg font-bold truncate">{address}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-yellow-400 border-2 border-black py-3 font-black uppercase hover:bg-yellow-500 active:scale-95 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <LucideCopy size={18} /> Copy
              </button>
              <button className="flex items-center justify-center gap-2 bg-black text-white border-2 border-black py-3 font-black uppercase hover:bg-gray-800 active:scale-95 transition-all">
                <LucideRefreshCcw size={18} /> New
              </button>
            </div>
          </div>

          <div className="bg-blue-600 text-white border-4 border-black p-4 font-bold flex items-center gap-3">
            <LucideShieldCheck />
            <span className="text-sm uppercase italic">Auto-delete active: Email kept for 3 days.</span>
          </div>
        </div>

        {/* RIGHT: Inbox Section */}
        <div className="lg:col-span-7">
          <div className="bg-white border-4 border-black min-h-[500px] shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]">
            <div className="border-b-4 border-black p-4 bg-gray-50 flex justify-between items-center">
              <h2 className="font-black uppercase flex items-center gap-2"><LucideMail /> Inbox (0)</h2>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-black"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                /* LOADING SKELETON SHIMER ORIGIN */
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="relative h-20 bg-gray-100 border-2 border-black overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-20deg] animate-[shimmer_1.5s_infinite]" />
                    </div>
                  ))}
                </div>
              ) : (
                /* EMPTY STATE */
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <LucideMail size={80} strokeWidth={3} />
                  <p className="font-black uppercase mt-4">Waiting for incoming mail...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-20 text-center text-xs font-black uppercase text-gray-400">
        &copy; 2026 XY-STORE. All Rights Reserved. {XY_ASSETS.branding}
      </footer>

      {/* Tailwind v4 Style for Shimmer */}
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}