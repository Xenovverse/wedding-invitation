/* ═══════════════════════════════════════════════════════════
   js/app.js — Semua komponen React (JSX)
   Diproses oleh Babel Standalone.
   Variabel global dari config.js, audio.js, api.js, export.js
   sudah tersedia karena dimuat lebih dulu di index.html.
   ═══════════════════════════════════════════════════════════ */

const { useState, useEffect, useRef } = React;

/* ════════════════════════════════════════════════════════════
   TRUNTUM — Motif batik sebagai background pattern
════════════════════════════════════════════════════════════ */
function Truntum({ id = "tr", op = 0.055, light = false }) {
  const f  = light ? "#F9FAFB" : "#1F2937";
  const fi = light ? "#1C1A14" : "#F9FAFB";
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <pattern id={id} x="0" y="0" width="96" height="96" patternUnits="userSpaceOnUse">
          <g transform="translate(48,48)">
            {[0,45,90,135,180,225,270,315].map((a,i)=>(
              <ellipse key={i} cx="0" cy="-15" rx="3.2" ry="8.5" fill={f} transform={`rotate(${a})`}/>
            ))}
            {[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map((a,i)=>(
              <ellipse key={i} cx="0" cy="-23" rx="2" ry="4.5" fill={f} opacity=".55" transform={`rotate(${a})`}/>
            ))}
            <circle cx="0" cy="0" r="5"   fill={f}/>
            <circle cx="0" cy="0" r="2.5" fill={fi} opacity=".9"/>
            <circle cx="0" cy="0" r="1"   fill={f}/>
          </g>
          {[[0,0],[96,0],[0,96],[96,96]].map(([cx,cy],i)=>(
            <g key={i} transform={`translate(${cx},${cy})`}>
              {[0,45,90,135,180,225,270,315].map((a,j)=>(
                <ellipse key={j} cx="0" cy="-8" rx="1.8" ry="4.5" fill={f} opacity=".4" transform={`rotate(${a})`}/>
              ))}
              <circle cx="0" cy="0" r="2.5" fill={f} opacity=".4"/>
              <circle cx="0" cy="0" r="1"   fill={fi} opacity=".7"/>
            </g>
          ))}
          {[[48,0],[0,48],[96,48],[48,96]].map(([cx,cy],i)=>(
            <g key={i} transform={`translate(${cx},${cy})`}>
              {[0,90,180,270].map((a,j)=>(
                <ellipse key={j} cx="0" cy="-5.5" rx="1.4" ry="3" fill={f} opacity=".25" transform={`rotate(${a})`}/>
              ))}
              <circle cx="0" cy="0" r="1.8" fill={f} opacity=".25"/>
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={op}/>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   COVER — Amplop undangan interaktif
   Panel atas & bawah "membuka" saat tombol diklik.
   startGamelan() dipanggil di sini (user gesture = autoplay OK).
════════════════════════════════════════════════════════════ */
function Cover({ onOpen }) {
  const [phase, setPhase] = useState("idle"); // idle | opening

  /* Kunci scroll selama cover tampil */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleOpen = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    startGamelan(); // ← musik dimulai dari gesture pengguna
    setTimeout(() => {
      document.body.style.overflow = "";
      onOpen();
    }, 1100);
  };

  const opening = phase === "opening";
  const panelBase = {
    position: "absolute", left: 0, right: 0, overflow: "hidden",
    background: "#1C1A14",
  };
  const stars = [
    { top:"18%", left:"12%",  dur:"3.1s", delay:"0s"   },
    { top:"30%", left:"88%",  dur:"4.2s", delay:"0.8s" },
    { top:"72%", left:"7%",   dur:"3.7s", delay:"0.3s" },
    { top:"80%", left:"91%",  dur:"2.9s", delay:"1.1s" },
    { top:"50%", left:"4%",   dur:"4.5s", delay:"0.6s" },
    { top:"50%", left:"96%",  dur:"3.4s", delay:"1.4s" },
  ];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, pointerEvents: opening ? "none" : "auto" }}>
      {/* Bintang dekoratif */}
      {stars.map((s,i) => (
        <div key={i} className="cover-star" style={{ position:"absolute", top:s.top, left:s.left, zIndex:10001, pointerEvents:"none", "--dur":s.dur, "--delay":s.delay }}>
          <svg width="8" height="8" viewBox="0 0 8 8">
            <polygon points="4,0 4.6,3.4 8,4 4.6,4.6 4,8 3.4,4.6 0,4 3.4,3.4" fill="#C9A96E"/>
          </svg>
        </div>
      ))}

      {/* ─── Panel Atas ─── */}
      <div className="cover-panel" style={{ ...panelBase, top:0, height:"50%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", transform: opening ? "translateY(-100%)" : "translateY(0)", borderBottom:"1px solid rgba(201,169,110,.22)" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}><Truntum id="ctr-top" op={0.07} light/></div>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse 100% 130% at 50% 110%, rgba(28,26,20,0) 20%, rgba(28,26,20,.75) 100%)" }}/>
        {/* Ornamen sudut */}
        {[{top:18,left:18,d:"M2 2H46V6H6V46H2Z",cx:11,cy:11},{top:18,right:18,d:"M46 2H2V6H42V46H46Z",cx:37,cy:11}].map((c,i)=>(
          <div key={i} style={{ position:"absolute", top:c.top, left:c.left, right:c.right, width:48, height:48, opacity:.28, pointerEvents:"none" }}>
            <svg viewBox="0 0 48 48" fill="none"><path d={c.d} fill="#C9A96E"/><circle cx={c.cx} cy={c.cy} r="2.2" fill="#C9A96E"/></svg>
          </div>
        ))}
        <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"0 32px 40px", width:"100%", maxWidth:560 }}>
          <p className="cover-content" style={{ "--cd":"0.3s", fontFamily:"var(--font-sans)", fontSize:9, letterSpacing:".48em", textTransform:"uppercase", color:"#C9A96E", margin:"0 0 18px", opacity:.85 }}>Undangan Pernikahan</p>
          <div className="cover-content" style={{ "--cd":"0.45s", display:"flex", alignItems:"center", justifyContent:"center", gap:14, marginBottom:22 }}>
            <div style={{ height:1, width:44, background:"rgba(201,169,110,.3)" }}/><span style={{ color:"#E2725B", fontSize:16 }}>✦</span><div style={{ height:1, width:44, background:"rgba(201,169,110,.3)" }}/>
          </div>
          <h1 className="font-serif cover-content" style={{ "--cd":"0.6s", fontSize:"clamp(46px,13vw,94px)", fontWeight:500, lineHeight:.88, letterSpacing:"-.025em", color:"rgba(255,255,255,.94)", margin:0 }}>{C.bride.first}</h1>
          <div className="cover-content" style={{ "--cd":"0.75s", display:"flex", alignItems:"center", justifyContent:"center", gap:18, margin:"8px 0 4px" }}>
            <div style={{ height:1, width:32, background:"rgba(255,255,255,.1)" }}/><span className="font-serif" style={{ fontStyle:"italic", fontSize:"clamp(24px,5vw,40px)", color:"#E2725B", lineHeight:2 }}>&</span><div style={{ height:1, width:32, background:"rgba(255,255,255,.1)" }}/>
          </div>
          <h1 className="font-serif cover-content" style={{ "--cd":"0.9s", fontSize:"clamp(46px,13vw,94px)", fontWeight:500, lineHeight:.88, letterSpacing:"-.025em", color:"rgba(255,255,255,.94)", margin:0 }}>{C.groom.first}</h1>
        </div>
      </div>

      {/* ─── Seam tengah ─── */}
      <div className="cover-seam" style={{ position:"absolute", top:"50%", left:0, right:0, height:1, background:"linear-gradient(to right,transparent 0%,rgba(201,169,110,.5) 20%,rgba(226,114,91,.6) 50%,rgba(201,169,110,.5) 80%,transparent 100%)", transform:"translateY(-.5px)", zIndex:10000, pointerEvents:"none", opacity: opening ? 0 : undefined, transition:"opacity .3s ease" }}/>

      {/* ─── Panel Bawah ─── */}
      <div className="cover-panel" style={{ ...panelBase, bottom:0, height:"50%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", transform: opening ? "translateY(100%)" : "translateY(0)", borderTop:"1px solid rgba(201,169,110,.22)" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}><Truntum id="ctr-bot" op={0.07} light/></div>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse 100% 130% at 50% -10%, rgba(28,26,20,0) 20%, rgba(28,26,20,.75) 100%)" }}/>
        {[{bottom:18,left:18,d:"M2 46H46V42H6V2H2Z",cx:11,cy:37},{bottom:18,right:18,d:"M46 46H2V42H42V2H46Z",cx:37,cy:37}].map((c,i)=>(
          <div key={i} style={{ position:"absolute", bottom:c.bottom, left:c.left, right:c.right, width:48, height:48, opacity:.28, pointerEvents:"none" }}>
            <svg viewBox="0 0 48 48" fill="none"><path d={c.d} fill="#C9A96E"/><circle cx={c.cx} cy={c.cy} r="2.2" fill="#C9A96E"/></svg>
          </div>
        ))}
        <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"36px 32px 0", width:"100%", maxWidth:480, display:"flex", flexDirection:"column", alignItems:"center" }}>
          <p className="cover-content" style={{ "--cd":"0.5s", fontFamily:"var(--font-sans)", fontSize:11, letterSpacing:".24em", color:"rgba(255,255,255,.4)", margin:"0 0 26px", textTransform:"uppercase" }}>{C.dateDisplay} · Yogyakarta</p>
          {/* Tombol Wax Seal */}
          <button className="cover-seal-btn cover-content" onClick={handleOpen} style={{ "--cd":"0.65s", position:"relative", display:"inline-flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, width:118, height:118, borderRadius:"50%", border:"none", background:"radial-gradient(circle at 38% 38%,#2e201a 0%,#1C1A14 65%,#141210 100%)", cursor:"pointer", outline:"1.5px solid rgba(226,114,91,.45)", outlineOffset:0 }}>
            <div style={{ position:"absolute", inset:9, borderRadius:"50%", border:"1px solid rgba(201,169,110,.3)", pointerEvents:"none" }}/>
            <div style={{ position:"absolute", inset:18, borderRadius:"50%", border:"1px solid rgba(201,169,110,.12)", pointerEvents:"none" }}/>
            <span style={{ color:"#E2725B", fontSize:22, lineHeight:1, display:"block" }}>✦</span>
            <span style={{ fontFamily:"var(--font-sans)", fontSize:9, letterSpacing:".3em", textTransform:"uppercase", color:"rgba(255,255,255,.82)", fontWeight:500, lineHeight:1.6, textAlign:"center" }}>Buka<br/>Undangan</span>
          </button>
          <p className="cover-content" style={{ "--cd":"0.85s", fontFamily:"var(--font-sans)", fontSize:10, color:"rgba(255,255,255,.18)", margin:"18px 0 0", letterSpacing:".12em" }}>Ketuk untuk membuka</p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   GONG BUTTON — Tombol play/pause musik (fixed bottom-right)
════════════════════════════════════════════════════════════ */
function GongBtn({ isPlaying, onToggle }) {
  return (
    <button onClick={onToggle} title={isPlaying ? "Pause Music" : "Play Gamelan"} style={{ position:"fixed", bottom:24, right:24, zIndex:100, width:54, height:54, borderRadius:"50%", background:"#fff", border:"1px solid rgba(0,0,0,.07)", boxShadow:"0 8px 24px rgba(0,0,0,.10)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div className="gong-outer"/><div className="gong-outer2"/>
      <div style={{ position:"relative", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ position:"absolute", inset:0,  borderRadius:"50%", border:`2px solid ${isPlaying?"#E2725B":"#D1D5DB"}`, transition:"border-color .3s" }}/>
        <div style={{ position:"absolute", inset:5,  borderRadius:"50%", border:`1.5px solid ${isPlaying?"rgba(226,114,91,.55)":"#E5E7EB"}`, transition:"border-color .3s" }}/>
        <div style={{ position:"absolute", inset:10, borderRadius:"50%", border:`1px solid ${isPlaying?"rgba(226,114,91,.3)":"#F3F4F6"}`, transition:"border-color .3s" }}/>
        <div className={isPlaying?"gong-ripple":""} style={{ width:10, height:10, borderRadius:"50%", background:isPlaying?"#E2725B":"#D1D5DB", transition:"background .3s" }}/>
      </div>
      {isPlaying && <span style={{ position:"absolute", top:3, right:3, width:9, height:9, borderRadius:"50%", background:"#E2725B", border:"1.5px solid #fff" }}/>}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════
   NAV — Navigasi pill floating
════════════════════════════════════════════════════════════ */
function Nav({ active, onAdmin }) {
  const items = [
    { k:"hero",   l:"Beranda"  },
    { k:"couple", l:"Mempelai" },
    { k:"events", l:"Acara"    },
    { k:"rsvp",   l:"RSVP"    },
  ];
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  return (
    <nav style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", zIndex:99 }}>
      <div className="nav-pill">
        {items.map(({ k, l }) => (
          <button key={k} onClick={()=>go(k)} style={{ fontFamily:"var(--font-sans)", fontSize:12, fontWeight:active===k?600:400, padding:"6px 14px", borderRadius:999, border:"none", cursor:"pointer", background:active===k?"var(--color-accent)":"transparent", color:active===k?"#fff":"#6B7280", transition:"all .25s" }}>{l}</button>
        ))}
        <button onClick={onAdmin} title="Admin Panel" style={{ fontFamily:"var(--font-sans)", fontSize:11, padding:"6px 10px", borderRadius:999, border:"1px solid #E5E7EB", cursor:"pointer", background:"transparent", color:"#9CA3AF" }}>⚙</button>
      </div>
    </nav>
  );
}

/* ════════════════════════════════════════════════════════════
   HERO — Section pertama
════════════════════════════════════════════════════════════ */
function Hero({ isPlaying, onToggle }) {
  const [px, setPx] = useState(0);
  const [py, setPy] = useState(0);
  useEffect(() => {
    const h = (e) => { setPx((e.clientX/window.innerWidth-.5)*30); setPy((e.clientY/window.innerHeight-.5)*30); };
    window.addEventListener("mousemove", h, { passive:true });
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return (
    <section id="hero" style={{ position:"relative", minHeight:"100svh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", overflow:"hidden", background:"var(--color-bg)" }}>
      <div className="parallax-bg" style={{ position:"absolute", inset:"-12%", width:"124%", height:"124%", transform:`translate(${px}px,${py}px)`, pointerEvents:"none" }}><Truntum id="hero-tr" op={0.052}/></div>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse 80% 60% at 50% 50%,transparent 40%,rgba(249,250,251,.65) 100%)" }}/>
      {[{top:28,left:28},{top:28,right:28},{bottom:28,left:28},{bottom:28,right:28}].map((p,i)=>(
        <div key={i} className="corner" style={p}><svg viewBox="0 0 52 52" fill="none"><path d="M2 2H50V6H6V50H2Z" fill="#E2725B"/><circle cx="12" cy="12" r="2.5" fill="#E2725B"/></svg></div>
      ))}
      <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"0 24px", maxWidth:700, width:"100%" }}>
        <div className="anim-fade-up d-200" style={{ marginBottom:24 }}>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:10, letterSpacing:".38em", textTransform:"uppercase", color:"#9CA3AF", marginBottom:10 }}>Undangan Pernikahan</p>
          <div className="ornament-divider"><span style={{ color:"var(--color-accent)", fontSize:18 }}>✦</span></div>
        </div>
        <div className="anim-fade-up d-400"><h1 className="font-serif" style={{ fontSize:"clamp(64px,14vw,128px)", fontWeight:500, lineHeight:.9, letterSpacing:"-.02em", color:"var(--color-text)", margin:0 }}>{C.bride.first}</h1></div>
        <div className="anim-fade-up d-600" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:20, margin:"10px 0 4px" }}>
          <div style={{ height:1, width:64, background:"#E5E7EB" }}/><span className="font-serif" style={{ fontSize:"clamp(28px,5vw,44px)", fontStyle:"italic", color:"var(--color-accent)", lineHeight:2 }}>&</span><div style={{ height:1, width:64, background:"#E5E7EB" }}/>
        </div>
        <div className="anim-fade-up d-600"><h1 className="font-serif" style={{ fontSize:"clamp(64px,14vw,128px)", fontWeight:500, lineHeight:.9, letterSpacing:"-.02em", color:"var(--color-text)", margin:0 }}>{C.groom.first}</h1></div>
        <div className="anim-fade-up d-800" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, margin:"28px 0" }}>
          <div style={{ height:1, width:56, background:"rgba(226,114,91,.25)" }}/>
          {[.5,1,.5].map((op,i)=><span key={i} style={{ width:6, height:6, borderRadius:"50%", background:"var(--color-accent)", opacity:op, display:"inline-block" }}/>)}
          <div style={{ height:1, width:56, background:"rgba(226,114,91,.25)" }}/>
        </div>
        <div className="anim-fade-up d-1000" style={{ display:"inline-block" }}>
          <div style={{ border:"1.5px solid rgba(0,0,0,.07)", borderRadius:20, padding:"20px 36px", background:"rgba(255,255,255,.68)", backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)" }}>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:10, letterSpacing:".32em", textTransform:"uppercase", color:"#9CA3AF", marginBottom:8 }}>Save the Date</p>
            <p className="font-serif" style={{ fontSize:"clamp(20px,3.5vw,28px)", fontWeight:500, color:"var(--color-text)", margin:0 }}>{C.dateDisplay}</p>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:12, color:"#9CA3AF", marginTop:6 }}>Yogyakarta</p>
          </div>
        </div>
        <div className="anim-fade-up d-1200" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, marginTop:48 }}>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:9, letterSpacing:".3em", textTransform:"uppercase", color:"#C4C9D1" }}>Scroll</p>
          <div className="anim-float" style={{ width:1, height:44, background:"linear-gradient(to bottom,#C4C9D1,transparent)" }}/>
        </div>
      </div>
      <GongBtn isPlaying={isPlaying} onToggle={onToggle}/>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   COUPLE — Kartu profil mempelai
════════════════════════════════════════════════════════════ */
function PersonCard({ p, role }) {
  const [imgErr, setImgErr] = useState(false);
  const hasPhoto = p.photo && !imgErr;
  return (
    <div className="sr card-lift" style={{ background:"#fff", borderRadius:28, border:"1.5px solid rgba(0,0,0,.05)", overflow:"hidden" }}>
      <div className="photo-wrap">
        {hasPhoto ? (
          <img src={p.photo} alt={p.first} onError={()=>setImgErr(true)}/>
        ) : (
          <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
            <svg viewBox="0 0 80 80" style={{ width:60, opacity:.12 }} fill="#1F2937"><ellipse cx="40" cy="28" rx="18" ry="20"/><path d="M5 80 Q4 52 40 46 Q76 52 75 80 Z"/></svg>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:11, color:"#bbb", textAlign:"center", padding:"0 20px" }}>Belum ada foto</p>
          </div>
        )}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:70, background:"linear-gradient(to bottom,transparent,rgba(180,180,180,.45))", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:16, left:16 }}>
          <span style={{ fontFamily:"var(--font-sans)", fontSize:9, letterSpacing:".28em", textTransform:"uppercase", color:"var(--color-accent)", background:"rgba(255,255,255,.92)", backdropFilter:"blur(8px)", padding:"6px 14px", borderRadius:999, border:"1px solid rgba(226,114,91,.2)" }}>{role}</span>
        </div>
      </div>
      <div style={{ padding:"28px 28px 32px" }}>
        <h3 className="font-serif" style={{ fontSize:30, fontWeight:500, color:"var(--color-text)", margin:"0 0 4px", lineHeight:1.1 }}>{p.first}</h3>
        <p className="font-serif" style={{ fontStyle:"italic", fontSize:13, color:"#9CA3AF", margin:"0 0 16px" }}>{p.full}</p>
        <span style={{ display:"block", width:32, height:2, background:"var(--color-accent)", marginBottom:18 }}/>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:10, letterSpacing:".2em", textTransform:"uppercase", color:"#9CA3AF", margin:"0 0 4px" }}>Putra/Putri dari</p>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:14, fontWeight:500, color:"var(--color-text)", lineHeight:1.55, margin:"0 0 12px" }}>{p.father}<br/>{p.mother}</p>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:13, color:"#6B7280", lineHeight:1.7, margin:0 }}>{p.bio}</p>
      </div>
    </div>
  );
}

function Couple() {
  return (
    <section id="couple" style={{ padding:"96px 24px", background:"var(--color-bg)", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(to right,transparent,rgba(226,114,91,.2),transparent)" }}/>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div className="sr" style={{ textAlign:"center", marginBottom:64 }}>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:10, letterSpacing:".38em", textTransform:"uppercase", color:"var(--color-accent)", marginBottom:10 }}>Mempelai</p>
          <h2 className="font-serif" style={{ fontSize:"clamp(32px,5vw,48px)", fontWeight:500, color:"var(--color-text)", margin:"0 0 16px" }}>Dua Jiwa, Satu Ikatan</h2>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
            <div style={{ height:1, width:36, background:"#E5E7EB" }}/><div style={{ width:7, height:7, borderRadius:"50%", background:"var(--color-accent)" }}/><div style={{ height:1, width:36, background:"#E5E7EB" }}/>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:28 }}>
          <PersonCard p={C.bride} role="Mempelai Wanita"/>
          <PersonCard p={C.groom} role="Mempelai Pria"/>
        </div>
        <div className="sr d3" style={{ textAlign:"center", marginTop:56 }}>
          <div style={{ display:"inline-block", border:"1px solid rgba(0,0,0,.06)", borderRadius:18, padding:"22px 36px", background:"rgba(255,255,255,.7)" }}>
            <p className="font-serif" style={{ fontStyle:"italic", fontSize:15, color:"#6B7280", lineHeight:1.8, margin:0 }}>"Dan Dia yang menyatukan hati mereka…"</p>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:11, color:"var(--color-accent)", marginTop:8, letterSpacing:".05em" }}>— QS. Al-Anfal: 63</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   EVENTS — Jadwal & hitung mundur acara
════════════════════════════════════════════════════════════ */
function useCd(iso) {
  const [cd, setCd] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(iso) - new Date());
      setCd({ d:Math.floor(diff/86400000), h:Math.floor(diff/3600000)%24, m:Math.floor(diff/60000)%60, s:Math.floor(diff/1000)%60 });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [iso]);
  return cd;
}

function CdBox({ value, label }) {
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current !== value) { setFlash(true); prev.current = value; const t = setTimeout(()=>setFlash(false),350); return ()=>clearTimeout(t); }
  }, [value]);
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ background:"#F9FAFB", border:"1px solid #F3F4F6", borderRadius:18, padding:"14px 6px", marginBottom:7 }}>
        <span className={flash?"cd-flash":""} style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(22px,4vw,34px)", fontWeight:500, color:"var(--color-text)", display:"block", lineHeight:1 }}>{String(value).padStart(2,"0")}</span>
      </div>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:9, letterSpacing:".25em", textTransform:"uppercase", color:"#9CA3AF", margin:0 }}>{label}</p>
    </div>
  );
}

function EventCard({ ev }) {
  const cd   = useCd(ev.iso);
  const over = new Date(ev.iso) < new Date();
  return (
    <div className="sr card-lift" style={{ background:"#fff", borderRadius:28, border:"1.5px solid rgba(0,0,0,.05)", padding:"32px 28px", display:"flex", flexDirection:"column" }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:22 }}>
        <div style={{ width:52, height:52, borderRadius:16, background:"var(--color-accent-soft)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{ev.emoji}</div>
        <div style={{ paddingTop:4 }}>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:9, letterSpacing:".28em", textTransform:"uppercase", color:"var(--color-accent)", margin:"0 0 4px" }}>{ev.sub}</p>
          <h3 className="font-serif" style={{ fontSize:26, fontWeight:500, color:"var(--color-text)", margin:0 }}>{ev.title}</h3>
        </div>
      </div>
      {[{icon:"📅",l:"Tanggal",v:ev.date},{icon:"⏰",l:"Waktu",v:ev.time},{icon:"📍",l:"Lokasi",v:ev.venue,s:ev.address}].map(({ icon,l,v,s })=>(
        <div key={l} style={{ display:"flex", alignItems:"flex-start", gap:13, marginBottom:14 }}>
          <div style={{ width:38, height:38, borderRadius:12, background:"#F9FAFB", border:"1px solid #F3F4F6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{icon}</div>
          <div>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:10, letterSpacing:".2em", textTransform:"uppercase", color:"#9CA3AF", margin:"0 0 2px" }}>{l}</p>
            <p className="font-serif" style={{ fontSize:15, fontWeight:500, color:"var(--color-text)", margin:0 }}>{v}</p>
            {s && <p style={{ fontFamily:"var(--font-sans)", fontSize:12, color:"#9CA3AF", margin:"2px 0 0" }}>{s}</p>}
          </div>
        </div>
      ))}
      {!over ? (
        <div style={{ margin:"14px 0", padding:"14px 16px", background:"#F9FAFB", borderRadius:16, border:"1px solid #F3F4F6" }}>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:9, letterSpacing:".28em", textTransform:"uppercase", color:"#9CA3AF", textAlign:"center", marginBottom:10 }}>Hitung Mundur</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
            <CdBox value={cd.d} label="Hari"/><CdBox value={cd.h} label="Jam"/><CdBox value={cd.m} label="Menit"/><CdBox value={cd.s} label="Detik"/>
          </div>
        </div>
      ) : (
        <div style={{ margin:"14px 0", padding:"12px 16px", background:"rgba(34,197,94,.07)", borderRadius:14, textAlign:"center" }}>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:13, color:"#16a34a", fontWeight:600, margin:0 }}>🎉 Acara telah berlangsung</p>
        </div>
      )}
      <a href={ev.mapUrl} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:6, marginTop:8, padding:"4px 0", textDecoration:"none", fontFamily:"var(--font-sans)", fontSize:13, fontWeight:600, color:"var(--color-accent)", transition:"gap .2s" }} onMouseEnter={e=>e.currentTarget.style.gap="12px"} onMouseLeave={e=>e.currentTarget.style.gap="6px"}>
        Lihat di Google Maps <span>→</span>
      </a>
    </div>
  );
}

function Events() {
  return (
    <section id="events" style={{ padding:"96px 24px", background:"#F4F5F6", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(to right,transparent,rgba(226,114,91,.2),transparent)" }}/>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div className="sr" style={{ textAlign:"center", marginBottom:64 }}>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:10, letterSpacing:".38em", textTransform:"uppercase", color:"var(--color-accent)", marginBottom:10 }}>Rangkaian Acara</p>
          <h2 className="font-serif" style={{ fontSize:"clamp(32px,5vw,48px)", fontWeight:500, color:"var(--color-text)", margin:"0 0 16px" }}>Detail Acara</h2>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
            <div style={{ height:1, width:36, background:"#D1D5DB" }}/><div style={{ width:7, height:7, borderRadius:"50%", background:"var(--color-accent)" }}/><div style={{ height:1, width:36, background:"#D1D5DB" }}/>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:24 }}>
          {C.events.map((ev,i)=><EventCard key={i} ev={ev}/>)}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   TICKET — Tiket konfirmasi kehadiran
════════════════════════════════════════════════════════════ */
function Ticket({ data, onReset }) {
  const [exporting, setExporting] = useState(false);
  const handleSavePDF = async () => { setExporting(true); await exportTicketAsPDF(); setExporting(false); };
  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(34,197,94,.1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", fontSize:26 }}>✓</div>
        <h3 className="font-serif" style={{ fontSize:26, fontWeight:500, color:"var(--color-text)", margin:"0 0 8px" }}>Konfirmasi Diterima!</h3>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:13, color:"#6B7280", lineHeight:1.7 }}>
          {data.attending==="yes" ? "Tiket undangan Anda sudah siap. Tunjukkan kepada panitia." : "Terima kasih atas konfirmasi Anda. Semoga bisa bertemu di lain waktu."}
        </p>
      </div>
      {data.attending === "yes" && (
        <div id="ticket-print-area" className="ticket-wrap" style={{ padding:"26px 22px", marginBottom:20, position:"relative", background:"#fff" }}>
          <div style={{ position:"absolute", left:-12, top:"50%", transform:"translateY(-50%)" }} className="ticket-hole"/>
          <div style={{ position:"absolute", right:-12, top:"50%", transform:"translateY(-50%)" }} className="ticket-hole"/>
          <div style={{ textAlign:"center", borderBottom:"1px dashed rgba(226,114,91,.3)", paddingBottom:18, marginBottom:18 }}>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:9, letterSpacing:".35em", textTransform:"uppercase", color:"var(--color-accent)", margin:"0 0 6px" }}>Bukti Undangan Pernikahan</p>
            <h4 className="font-serif" style={{ fontSize:22, fontWeight:500, color:"var(--color-text)", margin:0 }}>{C.bride.first} & {C.groom.first}</h4>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:12, color:"#9CA3AF", margin:"4px 0 0" }}>{C.dateDisplay}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 18px", marginBottom:18 }}>
            {[{l:"Nama Tamu",v:data.name},{l:"Jumlah Tamu",v:`${data.count} Orang`},{l:"Akad Nikah",v:C.events[0].time},{l:"Resepsi",v:C.events[1].time}].map(({ l,v })=>(
              <div key={l}>
                <p style={{ fontFamily:"var(--font-sans)", fontSize:10, letterSpacing:".18em", textTransform:"uppercase", color:"#9CA3AF", margin:"0 0 3px" }}>{l}</p>
                <p style={{ fontFamily:"var(--font-sans)", fontSize:14, fontWeight:600, color:"var(--color-text)", margin:0 }}>{v}</p>
              </div>
            ))}
          </div>
          <div style={{ borderTop:"1px dashed rgba(226,114,91,.3)", paddingTop:16, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <div>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:10, letterSpacing:".18em", textTransform:"uppercase", color:"#9CA3AF", margin:"0 0 4px" }}>ID Tiket</p>
              <p style={{ fontFamily:"monospace", fontSize:20, fontWeight:700, color:"var(--color-accent)", letterSpacing:".15em", margin:0 }}>{data.ticketId}</p>
            </div>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:10, color:"#9CA3AF", lineHeight:1.65, textAlign:"right", margin:0 }}>Tunjukkan tiket ini<br/>kepada panitia</p>
          </div>
          {data.message && (
            <div style={{ marginTop:14, padding:"11px 14px", background:"rgba(226,114,91,.05)", borderRadius:11 }}>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:9, letterSpacing:".18em", textTransform:"uppercase", color:"var(--color-accent)", margin:"0 0 3px" }}>Ucapan Anda</p>
              <p className="font-serif" style={{ fontStyle:"italic", fontSize:13, color:"#6B7280", lineHeight:1.65, margin:0 }}>"{data.message}"</p>
            </div>
          )}
        </div>
      )}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        {data.attending==="yes" && (
          <button onClick={handleSavePDF} disabled={exporting} style={{ flex:1, padding:"13px", borderRadius:14, border:"none", fontFamily:"var(--font-sans)", fontSize:13, fontWeight:600, background:exporting?"#f0a898":"var(--color-accent)", color:"#fff", cursor:exporting?"not-allowed":"pointer", boxShadow:"0 4px 14px rgba(226,114,91,.28)", transition:"background .2s" }}>
            {exporting ? "Memproses…" : "🖨 Simpan Tiket (PDF)"}
          </button>
        )}
        <button onClick={onReset} style={{ flex:1, padding:"13px", borderRadius:14, border:"1.5px solid #E5E7EB", background:"transparent", fontFamily:"var(--font-sans)", fontSize:13, fontWeight:500, color:"#6B7280", cursor:"pointer" }}>Kirim Pesan Lain</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   RSVP — Form konfirmasi kehadiran (async, data ke server)
════════════════════════════════════════════════════════════ */
function RSVP() {
  const [f,       setF      ] = useState({ name:"", attending:"yes", count:1, message:"" });
  const [status,  setStatus ] = useState("idle");  // idle | submitting | done | error
  const [result,  setResult ] = useState(null);
  const [errMsg,  setErrMsg ] = useState("");
  const up = (k,v) => setF(x=>({ ...x, [k]:v }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const data = { ...f, ticketId:genId(), at:new Date().toLocaleString("id-ID") };
      await submitRSVP(data);   // ← kirim ke Netlify Function → simpan di server
      setResult(data);
      setStatus("done");
    } catch (err) {
      setErrMsg(err.message || "Terjadi kesalahan. Silakan coba lagi.");
      setStatus("error");
    }
  };

  const reset = () => { setStatus("idle"); setErrMsg(""); setResult(null); setF({ name:"", attending:"yes", count:1, message:"" }); };

  return (
    <section id="rsvp" style={{ padding:"96px 24px", background:"var(--color-bg)", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(to right,transparent,rgba(226,114,91,.2),transparent)" }}/>
      <div style={{ maxWidth:560, margin:"0 auto" }}>
        <div className="sr" style={{ textAlign:"center", marginBottom:52 }}>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:10, letterSpacing:".38em", textTransform:"uppercase", color:"var(--color-accent)", marginBottom:10 }}>Konfirmasi Kehadiran</p>
          <h2 className="font-serif" style={{ fontSize:"clamp(36px,6vw,52px)", fontWeight:500, color:"var(--color-text)", margin:"0 0 16px" }}>RSVP</h2>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
            <div style={{ height:1, width:36, background:"#E5E7EB" }}/><div style={{ width:7, height:7, borderRadius:"50%", background:"var(--color-accent)" }}/><div style={{ height:1, width:36, background:"#E5E7EB" }}/>
          </div>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:13.5, color:"#6B7280", marginTop:18, lineHeight:1.7 }}>Konfirmasi sebelum <strong style={{ color:"var(--color-text)" }}>{C.rsvpDeadline}</strong></p>
        </div>
        <div className="sr d1" style={{ background:"#fff", borderRadius:28, border:"1.5px solid rgba(0,0,0,.05)", padding:"36px 32px", boxShadow:"0 4px 32px rgba(0,0,0,.04)" }}>
          {status === "done" ? (
            <Ticket data={result} onReset={reset}/>
          ) : (
            <form onSubmit={submit}>
              {/* Nama */}
              <div style={{ marginBottom:22 }}>
                <label style={{ display:"block", fontFamily:"var(--font-sans)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"#9CA3AF", marginBottom:8 }}>Nama Lengkap</label>
                <input type="text" required className="form-field" placeholder="Tulis nama Anda" value={f.name} onChange={e=>up("name",e.target.value)} disabled={status==="submitting"}/>
              </div>
              {/* Kehadiran */}
              <div style={{ marginBottom:22 }}>
                <label style={{ display:"block", fontFamily:"var(--font-sans)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"#9CA3AF", marginBottom:10 }}>Kehadiran</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {[{v:"yes",l:"✓  Hadir"},{v:"no",l:"✕  Tidak Hadir"}].map(({ v,l })=>(
                    <button key={v} type="button" disabled={status==="submitting"} onClick={()=>up("attending",v)} style={{ fontFamily:"var(--font-sans)", fontSize:13, fontWeight:500, padding:"13px", borderRadius:14, cursor:"pointer", border:`1.5px solid ${f.attending===v?"var(--color-accent)":"#E5E7EB"}`, background:f.attending===v?"var(--color-accent-soft)":"#FAFAFA", color:f.attending===v?"var(--color-accent)":"#6B7280", transition:"all .2s" }}>{l}</button>
                  ))}
                </div>
              </div>
              {/* Jumlah tamu */}
              {f.attending === "yes" && (
                <div style={{ marginBottom:22 }}>
                  <label style={{ display:"block", fontFamily:"var(--font-sans)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"#9CA3AF", marginBottom:10 }}>Jumlah Tamu</label>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {[1,2,3,4,5].map(n=>(
                      <button key={n} type="button" disabled={status==="submitting"} onClick={()=>up("count",n)} style={{ width:42, height:42, borderRadius:12, cursor:"pointer", fontFamily:"var(--font-sans)", fontSize:14, fontWeight:500, border:`1.5px solid ${f.count===n?"var(--color-accent)":"#E5E7EB"}`, background:f.count===n?"var(--color-accent)":"#FAFAFA", color:f.count===n?"#fff":"#6B7280", transition:"all .2s" }}>{n}</button>
                    ))}
                    <span style={{ fontFamily:"var(--font-sans)", fontSize:13, color:"#9CA3AF", marginLeft:6 }}>orang</span>
                  </div>
                </div>
              )}
              {/* Ucapan */}
              <div style={{ marginBottom:28 }}>
                <label style={{ display:"block", fontFamily:"var(--font-sans)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"#9CA3AF", marginBottom:8 }}>Ucapan & Doa</label>
                <textarea className="form-field" rows={4} style={{ resize:"none" }} placeholder="Tulis ucapan dan doa…" value={f.message} onChange={e=>up("message",e.target.value)} disabled={status==="submitting"}/>
              </div>
              {/* Error message */}
              {status === "error" && (
                <div style={{ marginBottom:16, padding:"12px 16px", background:"rgba(239,68,68,.07)", borderRadius:12, border:"1px solid rgba(239,68,68,.15)" }}>
                  <p style={{ fontFamily:"var(--font-sans)", fontSize:13, color:"#dc2626", margin:0 }}>⚠ {errMsg}</p>
                </div>
              )}
              {/* Submit button */}
              <button type="submit" disabled={status==="submitting"} style={{ width:"100%", padding:"16px", borderRadius:16, border:"none", cursor:status==="submitting"?"not-allowed":"pointer", fontFamily:"var(--font-sans)", fontSize:14, fontWeight:600, letterSpacing:".06em", background:status==="submitting"?"#f0a898":"var(--color-accent)", color:"#fff", boxShadow:"0 6px 20px rgba(226,114,91,.3)", transition:"all .2s" }}>
                {status === "submitting" ? "Mengirim…" : "Kirim Konfirmasi →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   ADMIN — Panel admin (data dari server, multi-device)
════════════════════════════════════════════════════════════ */
function Admin({ onClose }) {
  const [pass,       setPass      ] = useState("");
  const [authState,  setAuthState ] = useState("idle"); // idle | loading | done | error
  const [data,       setData      ] = useState([]);
  const [errMsg,     setErrMsg    ] = useState("");
  const [tab,        setTab       ] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const doFetch = async (password) => {
    try {
      const rsvps = await fetchAllRSVPs(password); // ← ambil dari server
      setData(rsvps);
      return true;
    } catch (err) {
      setErrMsg(err.message);
      return false;
    }
  };

  const login = async () => {
    setAuthState("loading");
    const ok = await doFetch(pass);
    setAuthState(ok ? "done" : "error");
  };

  const refresh = async () => {
    setRefreshing(true);
    await doFetch(pass);
    setRefreshing(false);
  };

  const filtered = tab === "all" ? data : data.filter(r=>r.attending===tab);
  const totalH   = data.filter(r=>r.attending==="yes").length;
  const totalT   = data.filter(r=>r.attending==="no").length;
  const totalO   = data.filter(r=>r.attending==="yes").reduce((s,r)=>s+Number(r.count||1),0);

  return (
    <div className="admin-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="admin-box">
        {/* Header */}
        <div style={{ padding:"22px 26px 18px", borderBottom:"1px solid #F3F4F6", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <h3 className="font-serif" style={{ fontSize:22, fontWeight:500, color:"var(--color-text)", margin:"0 0 2px" }}>Admin Panel</h3>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:12, color:"#9CA3AF", margin:0 }}>Data konfirmasi kehadiran tamu — tersimpan di server</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {authState === "done" && (
              <button onClick={refresh} disabled={refreshing} style={{ padding:"7px 14px", borderRadius:10, border:"1px solid #E5E7EB", background:"#fff", fontFamily:"var(--font-sans)", fontSize:12, color:"#6B7280", cursor:refreshing?"not-allowed":"pointer", transition:"all .2s" }}>
                {refreshing ? "Memuat..." : "↻ Refresh"}
              </button>
            )}
            <button onClick={onClose} style={{ width:34, height:34, borderRadius:"50%", border:"1px solid #E5E7EB", background:"#fff", cursor:"pointer", fontSize:16, color:"#9CA3AF", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:"22px 26px" }}>

          {/* ── Login form ── */}
          {(authState === "idle" || authState === "error") && (
            <div style={{ maxWidth:300, margin:"36px auto", textAlign:"center" }}>
              <div style={{ fontSize:38, marginBottom:14 }}>🔐</div>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:14, color:"#6B7280", marginBottom:18 }}>Masukkan password admin untuk melihat data RSVP.</p>
              <input type="password" className="form-field" placeholder="Password admin" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} style={{ marginBottom:10 }}/>
              {authState === "error" && <p style={{ fontFamily:"var(--font-sans)", fontSize:12, color:"#ef4444", marginBottom:10 }}>⚠ {errMsg}</p>}
              <button onClick={login} style={{ width:"100%", padding:"13px", borderRadius:14, border:"none", background:"var(--color-accent)", color:"#fff", fontFamily:"var(--font-sans)", fontSize:13, fontWeight:600, cursor:"pointer" }}>Masuk</button>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:11, color:"#C4C9D1", marginTop:14 }}>Atur <code>ADMIN_PASSWORD</code> di Netlify &gt; Environment Variables</p>
            </div>
          )}

          {/* ── Loading ── */}
          {authState === "loading" && (
            <div style={{ textAlign:"center", padding:"64px 20px" }}>
              <div className="spinner"/>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:14, color:"#9CA3AF" }}>Memuat data dari server…</p>
            </div>
          )}

          {/* ── Data tamu ── */}
          {authState === "done" && (
            <>
              {/* Stat cards */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:18 }}>
                {[{l:"Total Hadir",v:totalH,c:"#16a34a",bg:"rgba(34,197,94,.08)"},{l:"Tidak Hadir",v:totalT,c:"#dc2626",bg:"rgba(239,68,68,.08)"},{l:"Total Tamu",v:totalO,c:"var(--color-accent)",bg:"var(--color-accent-soft)"}].map(({ l,v,c,bg })=>(
                  <div key={l} style={{ background:bg, borderRadius:16, padding:"16px 12px", textAlign:"center" }}>
                    <p className="font-serif" style={{ fontSize:28, fontWeight:500, color:c, margin:"0 0 4px" }}>{v}</p>
                    <p style={{ fontFamily:"var(--font-sans)", fontSize:10, letterSpacing:".14em", textTransform:"uppercase", color:"#6B7280", margin:0 }}>{l}</p>
                  </div>
                ))}
              </div>

              {/* Tab filter */}
              <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
                {[{k:"all",l:`Semua (${data.length})`},{k:"yes",l:`Hadir (${totalH})`},{k:"no",l:`Tidak Hadir (${totalT})`}].map(({ k,l })=>(
                  <button key={k} onClick={()=>setTab(k)} style={{ padding:"6px 14px", borderRadius:999, fontFamily:"var(--font-sans)", fontSize:12, fontWeight:tab===k?600:400, border:`1.5px solid ${tab===k?"var(--color-accent)":"#E5E7EB"}`, background:tab===k?"var(--color-accent-soft)":"transparent", color:tab===k?"var(--color-accent)":"#6B7280", cursor:"pointer", transition:"all .2s" }}>{l}</button>
                ))}
                {data.length > 0 && (
                  <button onClick={()=>exportExcel(data)} style={{ marginLeft:"auto", padding:"6px 14px", borderRadius:999, fontFamily:"var(--font-sans)", fontSize:12, border:"1.5px solid #16a34a", background:"rgba(34,197,94,.07)", color:"#16a34a", cursor:"pointer", fontWeight:500 }}>⬇ Export Excel</button>
                )}
              </div>

              {/* Tabel */}
              {filtered.length === 0 ? (
                <div style={{ textAlign:"center", padding:"48px 20px", color:"#C4C9D1" }}>
                  <p style={{ fontSize:32, marginBottom:10 }}>📋</p>
                  <p style={{ fontFamily:"var(--font-sans)", fontSize:14 }}>Belum ada data RSVP.</p>
                </div>
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table className="atbl">
                    <thead>
                      <tr><th>#</th><th>Nama</th><th>Status</th><th>Tamu</th><th>ID Tiket</th><th>Pesan</th><th>Waktu</th></tr>
                    </thead>
                    <tbody>
                      {filtered.map((r,i)=>(
                        <tr key={r.ticketId||i}>
                          <td style={{ color:"#9CA3AF" }}>{i+1}</td>
                          <td style={{ fontWeight:600 }}>{r.name}</td>
                          <td><span className={r.attending==="yes"?"badge-y":"badge-n"}>{r.attending==="yes"?"Hadir":"Tidak Hadir"}</span></td>
                          <td style={{ textAlign:"center" }}>{r.attending==="yes"?r.count:"-"}</td>
                          <td style={{ fontFamily:"monospace", fontSize:12, letterSpacing:".08em", color:"var(--color-accent)", fontWeight:700 }}>{r.ticketId||"-"}</td>
                          <td style={{ maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"#6B7280", fontStyle:"italic" }}>{r.message||"-"}</td>
                          <td style={{ fontSize:11, color:"#9CA3AF", whiteSpace:"nowrap" }}>{r.at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   FOOTER
════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ background:"#1F2937", padding:"64px 24px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}><Truntum id="footer-tr" op={0.03}/></div>
      <div style={{ position:"relative", maxWidth:480, margin:"0 auto", textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginBottom:24 }}>
          <div style={{ height:1, width:40, background:"rgba(255,255,255,.15)" }}/><span style={{ color:"var(--color-accent)", fontSize:18 }}>✦</span><div style={{ height:1, width:40, background:"rgba(255,255,255,.15)" }}/>
        </div>
        <h3 className="font-serif" style={{ fontSize:36, fontWeight:500, color:"#fff", margin:"0 0 6px" }}>{C.bride.first} & {C.groom.first}</h3>
        <p className="font-serif" style={{ fontStyle:"italic", fontSize:14, color:"rgba(255,255,255,.35)", margin:"0 0 32px" }}>{C.dateDisplay}</p>
        <p className="font-serif" style={{ fontStyle:"italic", fontSize:14, color:"rgba(255,255,255,.25)", lineHeight:1.85, margin:"0 0 8px" }}>"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."</p>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:11, color:"rgba(226,114,91,.6)", letterSpacing:".1em" }}>— QS. Ar-Rum: 21</p>
        <div style={{ marginTop:48, paddingTop:24, borderTop:"1px solid rgba(255,255,255,.07)" }}>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:11, color:"rgba(255,255,255,.2)" }}>Dibuat dengan ♥ untuk {C.bride.first} & {C.groom.first}</p>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════
   APP — Root component
════════════════════════════════════════════════════════════ */
function App() {
  const [playing,     setPlaying    ] = useState(false);
  const [active,      setActive     ] = useState("hero");
  const [showAdmin,   setShowAdmin  ] = useState(false);
  const [coverOpened, setCoverOpened] = useState(false);

  /* Dipanggil Cover setelah animasi buka selesai */
  const handleCoverOpen = () => {
    setCoverOpened(true);
    setPlaying(true);
  };

  /* Toggle musik dari GongBtn */
  const handleToggle = () => {
    if (playing) { stopGamelan(); setPlaying(false); }
    else         { startGamelan(); setPlaying(true); }
  };

  /* Scroll-reveal observer */
  useEffect(() => {
    const io = new IntersectionObserver(e=>e.forEach(x=>{ if(x.isIntersecting) x.target.classList.add("in"); }), { threshold:.12 });
    document.querySelectorAll(".sr").forEach(el=>io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Active nav tracker */
  useEffect(() => {
    const ids = ["hero","couple","events","rsvp"];
    const io  = new IntersectionObserver(e=>e.forEach(x=>{ if(x.isIntersecting) setActive(x.target.id); }), { threshold:.4 });
    ids.forEach(id=>{ const el=document.getElementById(id); if(el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  /* Cleanup saat unmount */
  useEffect(() => () => stopGamelan(), []);

  return (
    <>
      {!coverOpened && <Cover onOpen={handleCoverOpen}/>}
      <Nav active={active} onAdmin={()=>setShowAdmin(true)}/>
      <Hero isPlaying={playing} onToggle={handleToggle}/>
      <Couple/>
      <Events/>
      <RSVP/>
      <Footer/>
      {showAdmin && <Admin onClose={()=>setShowAdmin(false)}/>}
    </>
  );
}

/* ── Render ── */
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
