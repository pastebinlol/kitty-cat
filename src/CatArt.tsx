import React from "react";
import sit from "./assets/sit.png";
import happy from "./assets/happy.png";
import groom from "./assets/groom.png";
import groom2 from "./assets/groom2.png";
import look from "./assets/look.png";
import blink from "./assets/blink.png";
import sleep from "./assets/sleep.png";
import nap from "./assets/nap.png";
import play from "./assets/play.png";
import roll from "./assets/roll.png";
import stretch from "./assets/stretch.png";
import lsit from "./assets/luna-sit.png";
import lhappy from "./assets/luna-happy.png";
import lgroom from "./assets/luna-groom.png";
import lgroom2 from "./assets/luna-groom2.png";
import llook from "./assets/luna-look.png";
import lblink from "./assets/luna-blink.png";
import lsleep from "./assets/luna-sleep.png";
import lnap from "./assets/luna-nap.png";
import lplay from "./assets/luna-play.png";
import lroll from "./assets/luna-roll.png";
import lstretch from "./assets/luna-stretch.png";
import csit from "./assets/cocoa-sit.png";
import chappy from "./assets/cocoa-happy.png";
import cgroom from "./assets/cocoa-groom.png";
import cgroom2 from "./assets/cocoa-groom2.png";
import clook from "./assets/cocoa-look.png";
import cblink from "./assets/cocoa-blink.png";
import csleep from "./assets/cocoa-sleep.png";
import cnap from "./assets/cocoa-nap.png";
import cplay from "./assets/cocoa-play.png";
import croll from "./assets/cocoa-roll.png";
import cstretch from "./assets/cocoa-stretch.png";
import mw0 from "./assets/faithful-walk-00.png";
import mw1 from "./assets/faithful-walk-01.png";
import mw2 from "./assets/faithful-walk-02.png";
import mw3 from "./assets/faithful-walk-03.png";
import mw4 from "./assets/faithful-walk-04.png";
import mw5 from "./assets/faithful-walk-05.png";
import mw6 from "./assets/faithful-walk-06.png";
import mw7 from "./assets/faithful-walk-07.png";
import mw8 from "./assets/faithful-walk-08.png";
import mw9 from "./assets/faithful-walk-09.png";
import mw10 from "./assets/faithful-walk-10.png";
import mw11 from "./assets/faithful-walk-11.png";
import mw12 from "./assets/faithful-walk-00.png";
import mw13 from "./assets/faithful-walk-01.png";
import mw14 from "./assets/faithful-walk-02.png";
import mw15 from "./assets/faithful-walk-03.png";
import lw0 from "./assets/luna-faithful-walk-00.png";
import lw1 from "./assets/luna-faithful-walk-01.png";
import lw2 from "./assets/luna-faithful-walk-02.png";
import lw3 from "./assets/luna-faithful-walk-03.png";
import lw4 from "./assets/luna-faithful-walk-04.png";
import lw5 from "./assets/luna-faithful-walk-05.png";
import lw6 from "./assets/luna-faithful-walk-06.png";
import lw7 from "./assets/luna-faithful-walk-07.png";
import lw8 from "./assets/luna-faithful-walk-08.png";
import lw9 from "./assets/luna-faithful-walk-09.png";
import lw10 from "./assets/luna-faithful-walk-10.png";
import lw11 from "./assets/luna-faithful-walk-11.png";
import lw12 from "./assets/luna-faithful-walk-00.png";
import lw13 from "./assets/luna-faithful-walk-01.png";
import lw14 from "./assets/luna-faithful-walk-02.png";
import lw15 from "./assets/luna-faithful-walk-03.png";
import cw0 from "./assets/cocoa-faithful-walk-00.png";
import cw1 from "./assets/cocoa-faithful-walk-01.png";
import cw2 from "./assets/cocoa-faithful-walk-02.png";
import cw3 from "./assets/cocoa-faithful-walk-03.png";
import cw4 from "./assets/cocoa-faithful-walk-04.png";
import cw5 from "./assets/cocoa-faithful-walk-05.png";
import cw6 from "./assets/cocoa-faithful-walk-06.png";
import cw7 from "./assets/cocoa-faithful-walk-07.png";
import cw8 from "./assets/cocoa-faithful-walk-08.png";
import cw9 from "./assets/cocoa-faithful-walk-09.png";
import cw10 from "./assets/cocoa-faithful-walk-10.png";
import cw11 from "./assets/cocoa-faithful-walk-11.png";
import cw12 from "./assets/cocoa-faithful-walk-00.png";
import cw13 from "./assets/cocoa-faithful-walk-01.png";
import cw14 from "./assets/cocoa-faithful-walk-02.png";
import cw15 from "./assets/cocoa-faithful-walk-03.png";
export type CatName = "mochi" | "luna" | "cocoa";
export type Mood = "lie-down" | "wake-up" | "sit" | "blink" | "look" | "groom" | "sleep" | "walk" | "play" | "pet" | "stretch";
const art = {
 mochi:{sit,blink,look,groom,groom2,sleep,nap,walk:[mw0,mw1,mw2,mw3,mw4,mw5,mw6,mw7,mw8,mw9,mw10,mw11,mw12,mw13,mw14,mw15],play,roll,happy,stretch},
 luna:{sit:lsit,blink:lblink,look:llook,groom:lgroom,groom2:lgroom2,sleep:lsleep,nap:lnap,walk:[lw0,lw1,lw2,lw3,lw4,lw5,lw6,lw7,lw8,lw9,lw10,lw11,lw12,lw13,lw14,lw15],play:lplay,roll:lroll,happy:lhappy,stretch:lstretch},
 cocoa:{sit:csit,blink:cblink,look:clook,groom:cgroom,groom2:cgroom2,sleep:csleep,nap:cnap,walk:[cw0,cw1,cw2,cw3,cw4,cw5,cw6,cw7,cw8,cw9,cw10,cw11,cw12,cw13,cw14,cw15],play:cplay,roll:croll,happy:chappy,stretch:cstretch}
};
export function CatArt({name="mochi",mood="sit",frame=0,facing="right"}:{name?:CatName;mood?:Mood;frame?:number;facing?:"left"|"right"}) {
 const a=art[name] || art.mochi;
 const src=mood==="walk"?a.walk[frame%12]:mood==="groom"?(frame%2?a.groom2:a.groom):mood==="sleep"?a.sleep:mood==="play"?(frame%2?a.roll:a.play):mood==="pet"?a.happy:mood==="blink"?a.blink:mood==="look"?a.look:mood==="stretch"?a.stretch:a.sit;
 const transitioning=mood==="lie-down"||mood==="wake-up";
 return <div className={`cat-art ${mood} facing-${mood==="walk"?facing:"right"}`}>
  {transitioning ? <div className="posture-transition" key={mood}>
    <img className="posture-from" src={mood==="lie-down"?a.sit:a.sleep} draggable={false} alt=""/>
    <img className="posture-to" src={mood==="lie-down"?a.sleep:a.sit} draggable={false} alt={`${name} ${mood}`}/>
   </div> : <img src={src} draggable={false} alt={`${name} ${mood}`}/>}
  {mood==="sleep"&&<span className="zzz">z Z</span>}
  {mood==="pet"&&<span className="hearts">♥ ♥</span>}
 </div>;
}
