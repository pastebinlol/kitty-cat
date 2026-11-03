import React,{useCallback,useEffect,useRef,useState} from "react";
import {getCurrentWindow,PhysicalPosition} from "@tauri-apps/api/window";
import {emit,listen} from "@tauri-apps/api/event";
import {invoke} from "@tauri-apps/api/core";
import {CatArt,CatName,Mood} from "./CatArt";
import ball0 from "./assets/ball-0.png";
import ball1 from "./assets/ball-1.png";
import ball2 from "./assets/ball-2.png";
import ball3 from "./assets/ball-3.png";
import ball4 from "./assets/ball-4.png";
const balls=[ball0,ball1,ball2,ball3,ball4];
type Personality="relaxed"|"curious"|"playful";
type Settings={cat:CatName;personality:Personality;size:number;followBall:boolean;petOnClick:boolean;spots:boolean[];paused:boolean;showBall:boolean;fullscreenClickThrough:boolean};
const defaults:Settings={cat:"mochi",personality:"curious",size:90,followBall:true,petOnClick:true,spots:[true,true,true,true],paused:false,showBall:true,fullscreenClickThrough:false};
const KEY="desktop-cat-settings-v05";
function readSettings():Settings{try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return defaults}}
function useSettings(){const [s,setS]=useState(readSettings);useEffect(()=>{let off:(()=>void)|undefined;let dead=false;listen<Settings>("settings-changed",e=>{if(!dead)setS({...defaults,...e.payload})}).then(f=>{if(dead)f();else off=f});return()=>{dead=true;off?.()}},[]);return [s,setS] as const}
const invokeSafe=(name:string,args?:Record<string,unknown>)=>invoke(name,args).catch(e=>console.error(name,e));
function Pet(){
 const [s]=useSettings();
 const [mood,setMood]=useState<Mood>("sit");
 const [frame,setFrame]=useState(0);
 const [facing,setFacing]=useState<"left"|"right">("right");
 const moodRef=useRef<Mood>("sit"),endRef=useRef(0),chaseRef=useRef(0);
 const transitionTimer=useRef<number|undefined>();
 const ballVisibleRef=useRef(s.showBall);
 useEffect(()=>{ballVisibleRef.current=s.showBall},[s.showBall]);
 const change=useCallback((m:Mood,duration=0)=>{
   window.clearTimeout(transitionTimer.current);
   moodRef.current=m;setMood(m);endRef.current=duration?Date.now()+duration:0;setFrame(0);
 },[]);
 // A real posture transition is a timed pose blend, not an instantaneous image swap.
 const settle=useCallback((to:"sit"|"sleep")=>{
   const current=moodRef.current;
   if(current===to)return;
   if(current==="sleep"&&to==="sit" || to==="sleep"&&current!=="sleep"){
     change(to==="sleep"?"lie-down":"wake-up",1100);
     transitionTimer.current=window.setTimeout(()=>{
       change(to);
       if(to==="sleep")endRef.current=Date.now()+17000+Math.random()*15000;
     },1100);
   }else change(to);
 },[change]);
 useEffect(()=>{invokeSafe("resize_pet",{sizePercent:s.size})},[s.size]);
 useEffect(()=>{void invokeSafe("set_fullscreen_click_through",{enabled:s.fullscreenClickThrough})},[s.fullscreenClickThrough]);
 useEffect(()=>{const id=window.setInterval(()=>setFrame(f=>f+1),mood==="walk"?72:mood==="groom"?430:mood==="play"?390:1100);return()=>clearInterval(id)},[mood]);
 useEffect(()=>{
   // Idle decisions are spaced out; sleeping is common and lasts 17-32 seconds.
   const id=window.setInterval(()=>{
     if(s.paused){if(moodRef.current!=="sleep"&&moodRef.current!=="lie-down")settle("sleep");return}
     if(moodRef.current==="walk"||moodRef.current==="lie-down"||moodRef.current==="wake-up")return;
     if(endRef.current&&Date.now()<endRef.current)return;
     if(moodRef.current==="sleep"){settle("sit");return}
     if(moodRef.current!=="sit"){change("sit");return}
     const roll=Math.random();
     const chance=s.personality==="relaxed"?.72:s.personality==="playful"?.55:.64;
     if(roll>chance)return;
     const opts:[Mood,number][]=[["blink",850],["look",2300],["groom",4800],["stretch",2600]];
     const sleepProbability=s.personality==="relaxed"?.55:s.personality==="playful"?.25:.42;
     if(Math.random()<sleepProbability){settle("sleep");endRef.current=Date.now()+17000+Math.random()*15000;return}
     const [next,duration]=opts[Math.floor(Math.random()*opts.length)];change(next,duration);
   },4200);
   return()=>clearInterval(id);
 },[s.paused,s.personality,change,settle]);
 useEffect(()=>{
   let off:(()=>void)|undefined,dead=false;
   listen<{x:number;y:number}>("ball-released",async e=>{
     if(!s.followBall||s.paused||!ballVisibleRef.current)return;
     const id=++chaseRef.current;
     try{
       const w=getCurrentWindow(),p=await w.outerPosition(),size=await w.outerSize();
       setFacing(e.payload.x<p.x+size.width/2?"left":"right");
     }catch(err){console.warn("Could not determine facing",err)}
     // Wake up before starting to walk.
     if(moodRef.current==="sleep"||moodRef.current==="lie-down"){
       change("wake-up",900);
       await new Promise(resolve=>window.setTimeout(resolve,900));
       if(dead||chaseRef.current!==id)return;
     }
     change("walk");
     try{await invoke("chase_ball",{targetX:e.payload.x,targetY:e.payload.y})}
     catch(err){console.error("chase_ball",err);change("sit");if(ballVisibleRef.current)await invokeSafe("show_ball");return}
     if(!dead&&chaseRef.current===id){
       await invokeSafe("hide_ball");
       change("play",3300);
       window.setTimeout(async()=>{
         if(dead||chaseRef.current!==id)return;
         change("sit");
         if(ballVisibleRef.current)await invokeSafe("show_ball");
       },3300);
     }
   }).then(f=>dead?f():off=f);
   return()=>{dead=true;off?.()};
 },[s.followBall,s.paused,s.showBall,change]);
 const pet=()=>{
   if(!s.petOnClick||s.paused)return;
   if(moodRef.current==="sleep"||moodRef.current==="lie-down"){
     settle("sit");
     window.setTimeout(()=>change("pet",2200),1150);
   }else{change("pet",2200)}
 };
 useEffect(()=>()=>{window.clearTimeout(transitionTimer.current)},[]);
 return <main className="pet-stage"><button className="pet-hit" onClick={pet} aria-label="Pet your cat"><CatArt name={s.cat} mood={mood} frame={frame} facing={facing}/></button></main>;
}
function Ball(){
 const [s]=useSettings();
 useEffect(()=>{void invokeSafe("resize_ball",{sizePercent:s.size})},[s.size]);
 useEffect(()=>{void invokeSafe(s.showBall?"show_ball":"hide_ball")},[s.showBall]);
 const [rolling,setRolling]=useState(false),[frame,setFrame]=useState(0);
 const start=useRef<{x:number;y:number;px:number;py:number;scale:number}|null>(null);
 const pending=useRef<Promise<void>|null>(null);
 const moved=useRef(false),inFlight=useRef(false),lastPos=useRef<{x:number;y:number}|null>(null);
 const emitDrop=useCallback(async()=>{
  if(!start.current)return;
  // Wait for the last queued native position update before announcing the drop.
  for(let i=0;i<25&&inFlight.current;i++)await new Promise(resolve=>setTimeout(resolve,12));
  start.current=null;setRolling(false);
  const w=getCurrentWindow();const p=await w.outerPosition(),size=await w.outerSize();
  await emit("ball-released",{x:p.x+size.width/2,y:p.y+size.height/2});
 },[]);
 useEffect(()=>{if(!rolling)return;const id=window.setInterval(()=>setFrame(f=>(f+1)%balls.length),90);return()=>clearInterval(id)},[rolling]);
 const down=(e:React.PointerEvent<HTMLButtonElement>)=>{
  e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);
  const sx=e.screenX,sy=e.screenY;
  pending.current=(async()=>{
    const w=getCurrentWindow();const p=await w.outerPosition(),scale=await w.scaleFactor();
    start.current={x:p.x,y:p.y,px:sx*scale,py:sy*scale,scale};moved.current=false;setRolling(true);
  })().catch(err=>console.error("Ball drag start",err));
 };
 const move=(e:React.PointerEvent<HTMLButtonElement>)=>{
  const a=start.current;if(!a)return;
  const x=Math.round(a.x+e.screenX*a.scale-a.px),y=Math.round(a.y+e.screenY*a.scale-a.py);
  if(Math.abs(x-a.x)+Math.abs(y-a.y)>4)moved.current=true;
  lastPos.current={x,y};
  if(inFlight.current)return;
  inFlight.current=true;
  const tick=async()=>{while(lastPos.current&&start.current){const p=lastPos.current;lastPos.current=null;try{await getCurrentWindow().setPosition(new PhysicalPosition(p.x,p.y))}catch(err){console.error("Ball move",err);break}}inFlight.current=false};
  void tick();
 };
 const up=()=>{void (async()=>{await pending.current;if(start.current)await emitDrop()})()};
 useEffect(()=>{
   const onUp=()=>{if(start.current)up()};
   window.addEventListener("pointerup",onUp);
   window.addEventListener("blur",onUp);
   return()=>{window.removeEventListener("pointerup",onUp);window.removeEventListener("blur",onUp)};
 },[emitDrop]);
 return <main className="ball-stage"><button className={`ball-hit ${rolling?"rolling":""}`} aria-label="Drag the yarn ball" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}><img src={balls[frame]} draggable={false} alt="Illustrated yarn ball"/></button></main>
}
function Toggle({value,onChange}:{value:boolean;onChange:(v:boolean)=>void}){return <button className={`toggle ${value?"on":""}`} aria-pressed={value} onClick={()=>onChange(!value)}><i/></button>}
function Dashboard(){
 const [s,setS]=useState(readSettings),[tab,setTab]=useState("Cat");
 const patch=(p:Partial<Settings>)=>setS(old=>({...old,...p}));
 useEffect(()=>{localStorage.setItem(KEY,JSON.stringify(s));void emit("settings-changed",s)},[s]);
 const spots=["Top left","Top right","Bottom left","Bottom right"];
 const setSpot=(i:number)=>{void invokeSafe("move_pet_to_spot",{spot:i})};
 const setBallVisible=(visible:boolean)=>{patch({showBall:visible});void invokeSafe(visible?"show_ball":"hide_ball")};
 return <main className="dashboard"><aside className="sidebar"><div className="brand"><span>🐾</span><div><b>Desktop Cat</b><small>Your little desktop companion</small></div></div><p className="side-label">YOUR COMPANION</p>{["Cat","Settings","About"].map(t=><button key={t} className={`nav ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{t==="Cat"?"🐾":t==="Settings"?"⚙":"♡"}　{t==="Cat"?"Choose your cat":t}</button>)}<p className="sidebar-foot">● Companion ready</p></aside><section className="content"><header className="topbar"><div><h1>{tab==="Cat"?"Choose your cat":tab}</h1><p>Meet your tiny desktop companion.</p></div><button className="primary" onClick={()=>invokeSafe("show_pet")}>Show on desktop ↗</button></header>
 {tab==="Cat"&&<><div className="cat-grid">{(["mochi","luna","cocoa"] as CatName[]).map(name=><button key={name} className={`cat-card ${s.cat===name?"chosen":""}`} onClick={()=>patch({cat:name})}><CatArt name={name}/><b>{name==="mochi"?"Mochi":name==="luna"?"Luna":"Cocoa"}</b><small>{name==="luna"?"Female":name==="cocoa"?"Chocolate British Shorthair":"Male"}</small><p>{name==="mochi"?"Calm · Curious · Playful":name==="luna"?"Sweet · Curious · Affectionate":"Gentle · Cozy · Playful"}</p></button>)}</div>
 <section className="panel"><h2>★　Favorite spots</h2><p>Click a spot to move your cat there. Toggle spots for future roaming.</p><div className="spots"><div>{spots.map((name,i)=><div className="setting-row" key={name}><button className="spot-button" onClick={()=>setSpot(i)}>⌖　{name}</button><Toggle value={s.spots[i]} onChange={v=>patch({spots:s.spots.map((b,j)=>i===j?v:b)})}/></div>)}</div><div className="monitor">{spots.map((name,i)=><button key={name} className={`pin pin${i}`} onClick={()=>setSpot(i)} style={{opacity:s.spots[i]?1:.35}}>🐾</button>)}</div></div></section>
 <section className="panel"><h2>✿　Personality</h2>{(["relaxed","curious","playful"] as Personality[]).map(p=><button key={p} className="personality" onClick={()=>patch({personality:p})}><span className={`radio ${s.personality===p?"selected":""}`}/><span><b>{p[0].toUpperCase()+p.slice(1)}</b><small>{p==="relaxed"?"More naps, gentle movement":p==="curious"?"Blinks, grooms and explores":"More play and excited reactions"}</small></span></button>)}</section>
 <div className="two-col"><section className="panel"><h2>⚙　Interactions</h2><div className="setting-row"><span>Fullscreen overlay (click-through)</span><Toggle value={s.fullscreenClickThrough} onChange={v=>patch({fullscreenClickThrough:v})}/></div><p className="fullscreen-note">When enabled, the cat and yarn ball stay visible but do not intercept game clicks. Disable to pet the cat or drag the ball.</p><div className="setting-row"><span>Show yarn ball</span><Toggle value={s.showBall} onChange={setBallVisible}/></div><div className="setting-row"><span>Follow yarn ball</span><Toggle value={s.followBall} onChange={v=>patch({followBall:v})}/></div><div className="setting-row"><span>Pet when clicked</span><Toggle value={s.petOnClick} onChange={v=>patch({petOnClick:v})}/></div><div className="setting-row"><span>Pause movement</span><Toggle value={s.paused} onChange={v=>patch({paused:v})}/></div></section><section className="panel"><h2>♧　Cat size: {s.size}%</h2><input type="range" min="65" max="115" value={s.size} onChange={e=>patch({size:+e.target.value})}/><p>Changes apply to the live pet window.</p></section></div>
 <div className="actions"><button className="secondary" onClick={()=>setBallVisible(!s.showBall)}>{s.showBall?"Hide yarn ball":"Show yarn ball"}</button><button className="secondary" onClick={()=>invokeSafe("hide_pet")}>Hide cat</button><button className="primary" onClick={()=>invokeSafe("show_pet")}>Show cat</button></div></>}
 {tab==="Settings"&&<section className="panel"><h2>Desktop controls</h2><p>Drag the yarn ball to make your cat chase it. Click the cat to pet it.</p><div className="actions"><button className="secondary" onClick={()=>invokeSafe("show_pet")}>Show cat</button><button className="secondary" onClick={()=>setBallVisible(!s.showBall)}>{s.showBall?"Hide ball":"Show ball"}</button><button className="secondary" onClick={()=>invokeSafe("hide_pet")}>Hide cat</button></div></section>}
 {tab==="About"&&<section className="panel"><h2>Desktop Cat v1.7</h2><p>Illustrated Mochi, Luna and Cocoa, natural idle animations, a tiny yarn ball, and desktop interactions.</p></section>}
 </section></main>
}
export default function App(){const label=getCurrentWindow().label;useEffect(()=>{document.documentElement.className=label==="dashboard"?"dashboard-root":"overlay-root";document.body.className=label==="dashboard"?"dashboard-body":"overlay-body"},[label]);return label==="pet"?<Pet/>:label==="ball"?<Ball/>:<Dashboard/>}
