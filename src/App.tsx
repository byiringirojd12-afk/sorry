import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Heart, Sparkles, ChevronDown, Volume2, VolumeX, RotateCcw } from 'lucide-react'

const scenes = [
  { color: '#ffad36', glow: '#ff8b19', phrase: 'I AM SORRY', sub: 'I never wanted to hurt you.' },
  { color: '#bd8cff', glow: '#a45cff', phrase: 'MY LOVE', sub: 'You mean so much to me.' },
  { color: '#55e5a5', glow: '#20d88a', phrase: 'I WILL DO BETTER', sub: 'Your feelings deserve care.' },
  { color: '#ffc04b', glow: '#ff9f22', phrase: 'PLEASE FORGIVE ME', sub: 'When you are ready.' },
]

function HeartParticles({ color, glow, replayKey }: { color:string; glow:string; replayKey:number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let w=0,h=0,raf=0,tick=0
    type Dot={x:number;y:number;tx:number;ty:number;r:number;phase:number;speed:number}
    let dots:Dot[]=[]
    const resize=()=>{
      const rect=canvas.getBoundingClientRect(), dpr=Math.min(devicePixelRatio||1,2)
      w=rect.width;h=rect.height;canvas.width=w*dpr;canvas.height=h*dpr
      ctx.setTransform(dpr,0,0,dpr,0,0)
      dots=[]
      const scale=Math.min(w,h)*.022
      const count=reduced?240:620
      for(let i=0;i<count;i++){
        const a=Math.random()*Math.PI*2
        const fill=Math.sqrt(Math.random())
        const hx=16*Math.pow(Math.sin(a),3)
        const hy=13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a)
        const jitter=(Math.random()-.5)*3
        const tx=w/2+hx*scale*fill+jitter
        const ty=h*.46-hy*scale*fill+jitter
        dots.push({x:Math.random()*w,y:Math.random()*h,tx,ty,r:.55+Math.random()*1.5,phase:Math.random()*6.28,speed:.35+Math.random()*1.2})
      }
    }
    resize();window.addEventListener('resize',resize)
    const draw=()=>{
      tick++;ctx.clearRect(0,0,w,h)
      for(const p of dots){
        const settle=Math.min(1,tick/90)
        const drift=reduced?0:Math.sin(tick*.012*p.speed+p.phase)*2.4
        p.x+=(p.tx-p.x)*(.018*settle);p.y+=(p.ty-p.y)*(.018*settle)
        const alpha=.48+.42*(.5+.5*Math.sin(tick*.025+p.phase))
        ctx.beginPath();ctx.arc(p.x+drift,p.y+Math.cos(tick*.01+p.phase)*1.5,p.r,0,Math.PI*2)
        ctx.fillStyle=color;ctx.globalAlpha=alpha;ctx.shadowColor=glow;ctx.shadowBlur=10;ctx.fill()
      }
      ctx.globalAlpha=1;ctx.shadowBlur=0
      if(!reduced)raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize)}
  },[color,glow,replayKey,reduced])
  return <canvas ref={canvasRef} className="particle-heart" aria-label="Animated particle heart" />
}

function FloatingHearts(){
  const items=useMemo(()=>Array.from({length:34},(_,i)=>({id:i,left:`${(i*29+5)%100}%`,delay:`${-(i%11)*1.7}s`,duration:`${13+(i%8)*2}s`,size:`${8+(i%5)*7}px`,opacity:.12+(i%4)*.035})),[])
  return <div className="floating-hearts" aria-hidden="true">{items.map(x=><span key={x.id} style={{left:x.left,animationDelay:x.delay,animationDuration:x.duration,fontSize:x.size,opacity:x.opacity}}>♡</span>)}</div>
}

function CodeWindow(){
  const lines=[
    <><b>.love_you</b> {'{'}</>,
    <>  position: <i>absolute</i>;</>,
    <>  width: <em>100%</em>;</>,
    <>  color: <strong> #fff0f6</strong>;</>,
    <>  font-family: <strong>'My Love'</strong>;</>,
    <>  heart: <em>always</em>;</>,
    <>  transition: <strong>all .8s ease</strong>;</>,
    <><b>{'}'}</b></>,
    <><span className="code-comment">// I know I made a mistake.</span></>,
    <><span className="code-comment">// I am sorry, and I want to do better.</span></>,
  ]
  return <div className="code-window">
    <div className="code-titlebar"><div className="mac-dots"><i/><i/><i/></div><span>my-heart.css</span><span className="code-lock">♥</span></div>
    <div className="code-body"><div className="line-numbers">{lines.map((_,i)=><span key={i}>{String(i+1).padStart(2,'0')}</span>)}</div><pre>{lines.map((line,i)=><div className="code-line" key={i}>{line}</div>)}</pre></div>
    <div className="code-footer"><span><i/> sincerity: true</span><span>made with care ♡</span></div>
  </div>
}

function App(){
  const [sceneIndex,setSceneIndex]=useState(0)
  const [replayKey,setReplayKey]=useState(0)
  const [musicOn,setMusicOn]=useState(false)
  const [showLetter,setShowLetter]=useState(false)
  const scene=scenes[sceneIndex]
  const reduced=useReducedMotion()
  useEffect(()=>{
    if(reduced)return
    const id=window.setInterval(()=>setSceneIndex(i=>(i+1)%scenes.length),4800)
    return()=>window.clearInterval(id)
  },[reduced])
  const replay=()=>{setSceneIndex(0);setReplayKey(k=>k+1)}
  return <main className="site-shell">
    <FloatingHearts/>
    <header className="pink-banner"><div className="banner-heart-pattern">♡　♥　♡　♡　♥　♡　♥　♡　♡　♥　♡　♥　♡</div><span>A MESSAGE FROM MY HEART</span><div className="banner-heart-pattern">♥　♡　♥　♡　♡　♥　♡　♥　♡　♡　♥　♡</div></header>
    <section className="visual-stage" aria-label="Animated apology scene">
      <div className="stage-topline"><span>FOR SOMEONE SPECIAL</span><span className="tiny-heart">♥</span><span>MADE WITH SINCERITY</span></div>
      <div className="heart-visual">
        <div className="particle-halo" style={{'--scene-glow':scene.glow} as React.CSSProperties}/>
        <HeartParticles color={scene.color} glow={scene.glow} replayKey={replayKey}/>
        <AnimatePresence mode="wait">
          <motion.div className="scene-copy" key={scene.phrase} initial={{opacity:0,y:12,filter:'blur(8px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} exit={{opacity:0,y:-8,filter:'blur(5px)'}} transition={{duration:.8}}>
            <div className="scene-title" style={{color:scene.color,textShadow:`0 0 18px ${scene.glow}`}}>{scene.phrase}</div>
            <div className="scene-subtitle">{scene.sub}</div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="scene-progress">{scenes.map((s,i)=><button key={s.phrase} aria-label={`Show scene ${i+1}`} className={i===sceneIndex?'active':''} onClick={()=>setSceneIndex(i)} />)}</div>
      <div className="scene-controls">
        <button onClick={replay}><RotateCcw size={13}/> Replay animation</button>
        <button onClick={()=>setMusicOn(!musicOn)}><span className={`sound-indicator ${musicOn?'on':''}`}/>{musicOn?'Music enabled':'Music off'}</button>
      </div>
      <p className="music-note">{musicOn?'Music toggle is ready for your chosen audio track. Add your licensed instrumental at public/music/piano.mp3.':'No sound will play unless you choose to enable it.'}</p>
    </section>
    <section className="editor-section">
      <div className="editor-label"><span> A FEW WORDS I OWE YOU </span><Heart size={13}/></div>
      <CodeWindow/>
      <p className="under-editor">I cannot change what happened, but I can take responsibility for it.</p>
    </section>
    <section className="letter-section" id="letter">
      <div className="section-kicker">BEHIND THE ANIMATION</div>
      <h1>My dearest <em>love.</em></h1>
      <p className="section-intro">A sincere apology, without excuses or pressure.</p>
      <motion.article className="letter-card" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.7}}>
        <div className="letter-heading"><Sparkles size={15}/> A LETTER FROM ME <span>♡</span></div>
        <div className="letter-text">
          <p className="salutation">My love,</p>
          <p>There is something I want you to know, and I hope you will listen with an open heart.</p>
          <p>I know I made a mistake, and I know that I hurt your feelings. Honestly, that is something I deeply regret.</p>
          <p>You never deserved to feel hurt by someone who cares about you.</p>
          <p>I won't make excuses for what I did. I take responsibility for my actions, and I understand that an apology cannot immediately erase the pain.</p>
          <p>I just want you to know that you are important to me. Your feelings matter, your happiness matters, and the way I treat you matters.</p>
          <p>I cannot promise to be perfect, but I can promise to learn from my mistakes, communicate better, listen more, and make a genuine effort to become better.</p>
          <p>I don't expect you to forget everything today. I respect your feelings, and I will respect the time you need.</p>
          <p>I am truly sorry, my love.</p>
          <p>And if you give me the opportunity, I hope I can show you through my actions how much you mean to me.</p>
          <p className="signoff">I'm sorry. <span>♥</span></p>
        </div>
      </motion.article>
    </section>
    <section className="promise-section">
      <div className="section-kicker">MORE THAN WORDS</div><h2>A promise to <em>do better.</em></h2>
      <div className="promise-list">
        <div><b>01</b><span><strong>I WILL LISTEN</strong><small>Your feelings deserve to be heard and understood.</small></span></div>
        <div><b>02</b><span><strong>I WILL TAKE RESPONSIBILITY</strong><small>I will acknowledge my mistakes instead of making excuses.</small></span></div>
        <div><b>03</b><span><strong>I WILL SHOW YOU THROUGH MY ACTIONS</strong><small>I want to grow through consistency, care, and respect.</small></span></div>
      </div>
    </section>
    <footer className="closing-section">
      <div className="closing-heart">♥</div><div className="section-kicker">ONE LAST THING</div>
      <h2>I cannot undo <em>yesterday.</em></h2>
      <p>But I can learn from it, grow, and treat your heart with the care it deserves.</p>
      <div className="closing-line">I'm truly sorry, my love. <span>♥</span></div>
      <small>Take all the time you need. Your feelings matter.</small>
      <button className="letter-toggle" onClick={()=>setShowLetter(v=>!v)}>{showLetter?'Close this message':'Read my apology again'} <ChevronDown size={14}/></button>
      <AnimatePresence>{showLetter&&<motion.a href="#letter" className="letter-link" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>Return to my letter ↑</motion.a>}</AnimatePresence>
      <div className="footer-signature">Made with sincerity, just for you.</div>
    </footer>
  </main>
}
export default App
