import React, { useRef, useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  Sun, 
  Moon, 
  Sunset, 
  Trophy, 
  HelpCircle 
} from 'lucide-react';
import { catAudio } from '../utils/audio';

type CatColor = 'orange' | 'black' | 'white_van' | 'bengal' | 'siamese';
type Accessory = 'shark_fin' | 'goggles' | 'duck_float' | 'none';
type PoolTheme = 'sunny' | 'sunset' | 'night';

interface FloatingItem {
  id: number;
  x: number;
  y: number;
  type: 'duck' | 'fish' | 'ball';
  collected?: boolean;
  angle: number;
  bobOffset: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export const CatPoolSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Game & Simulator States
  const [catColor, setCatColor] = useState<CatColor>('orange');
  const [accessory, setAccessory] = useState<Accessory>('shark_fin');
  const [theme, setTheme] = useState<PoolTheme>('sunny');
  const [score, setScore] = useState(0);
  const [autoSwim, setAutoSwim] = useState(true);
  const [speedLevel, setSpeedLevel] = useState(2); // 1 = Thong thả, 2 = Bình thường, 3 = Tăng tốc
  const [strokeCount, setStrokeCount] = useState(0);

  // Position & physics state in refs for smooth 60fps render
  const catState = useRef({
    x: 300,
    y: 200,
    targetX: 300,
    targetY: 200,
    angle: 0,
    targetAngle: 0,
    pawPhase: 0,
    speed: 0,
    tailAngle: 0,
    isSwimming: true
  });

  const ripplesRef = useRef<Ripple[]>([]);
  const itemsRef = useRef<FloatingItem[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Initialize pool floating toys & treats
  const initItems = (width: number, height: number) => {
    const newItems: FloatingItem[] = [];
    // 4 fish treats
    for (let i = 0; i < 4; i++) {
      newItems.push({
        id: i,
        x: 80 + Math.random() * (width - 160),
        y: 80 + Math.random() * (height - 160),
        type: 'fish',
        angle: Math.random() * Math.PI * 2,
        bobOffset: Math.random() * Math.PI
      });
    }
    // 3 rubber ducks
    for (let i = 4; i < 7; i++) {
      newItems.push({
        id: i,
        x: 80 + Math.random() * (width - 160),
        y: 80 + Math.random() * (height - 160),
        type: 'duck',
        angle: Math.random() * Math.PI * 2,
        bobOffset: Math.random() * Math.PI
      });
    }
    // 1 beach ball
    newItems.push({
      id: 7,
      x: width / 2,
      y: height / 2,
      type: 'ball',
      angle: 0,
      bobOffset: 0
    });
    itemsRef.current = newItems;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI display
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      if (itemsRef.current.length === 0) {
        initItems(rect.width, rect.height);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    let lastTime = performance.now();
    let autoTimer = 0;

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Water Background based on Theme
      let bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (theme === 'sunny') {
        bgGrad.addColorStop(0, '#0284c7'); // sky-600
        bgGrad.addColorStop(0.5, '#0ea5e9'); // sky-500
        bgGrad.addColorStop(1, '#06b6d4'); // cyan-500
      } else if (theme === 'sunset') {
        bgGrad.addColorStop(0, '#7c2d12'); // orange-900
        bgGrad.addColorStop(0.4, '#c2410c'); // orange-700
        bgGrad.addColorStop(1, '#0e7490'); // cyan-700
      } else {
        // Night
        bgGrad.addColorStop(0, '#0f172a'); // slate-900
        bgGrad.addColorStop(0.5, '#1e293b'); // slate-800
        bgGrad.addColorStop(1, '#0369a1'); // sky-700
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Pool Grid Tiles / Caustic Water Light
      ctx.save();
      ctx.strokeStyle = theme === 'night' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      const tileSize = 40;
      for (let x = 0; x < width; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Water Caustics Waves
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        const waveY = (time * 0.05 + i * 80) % (height + 100) - 50;
        ctx.moveTo(0, waveY);
        for (let x = 0; x < width; x += 30) {
          ctx.lineTo(x, waveY + Math.sin(x * 0.02 + time * 0.003 + i) * 12);
        }
        ctx.stroke();
      }
      ctx.restore();

      // 3. Auto-swim waypoint steering
      if (autoSwim) {
        autoTimer += dt;
        if (autoTimer > 2.5) {
          autoTimer = 0;
          catState.current.targetX = 60 + Math.random() * (width - 120);
          catState.current.targetY = 60 + Math.random() * (height - 120);
        }
      }

      // Cat Movement Physics
      const cat = catState.current;
      const dx = cat.targetX - cat.x;
      const dy = cat.targetY - cat.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const maxSpeed = speedLevel * 80; // px/s
      if (dist > 5) {
        const moveDist = Math.min(dist, maxSpeed * dt);
        cat.x += (dx / dist) * moveDist;
        cat.y += (dy / dist) * moveDist;
        cat.targetAngle = Math.atan2(dy, dx) + Math.PI / 2;
        cat.speed = moveDist / dt;

        // Paw stroke phase
        cat.pawPhase += dt * (speedLevel * 8);
        cat.tailAngle = Math.sin(time * 0.008) * 0.35;

        // Spawn water ripples behind cat
        if (Math.random() < 0.3) {
          ripplesRef.current.push({
            x: cat.x - Math.sin(cat.angle) * 20 + (Math.random() * 10 - 5),
            y: cat.y + Math.cos(cat.angle) * 20 + (Math.random() * 10 - 5),
            radius: 5,
            maxRadius: 28,
            opacity: 0.8
          });
        }
      } else {
        cat.speed = 0;
        cat.pawPhase += dt * 2; // Idle floating leg movement
        cat.tailAngle = Math.sin(time * 0.003) * 0.15;
      }

      // Smooth angle interpolation
      let angleDiff = cat.targetAngle - cat.angle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      cat.angle += angleDiff * 0.1;

      // 4. Update & Draw Ripples
      ripplesRef.current.forEach((r, idx) => {
        r.radius += dt * 30;
        r.opacity = Math.max(0, 1 - r.radius / r.maxRadius);

        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.opacity * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius * 1.3, r.radius * 0.8, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
      ripplesRef.current = ripplesRef.current.filter(r => r.opacity > 0.02);

      // 5. Draw Floating Items (Ducks, Fish, Beach Ball)
      itemsRef.current.forEach(item => {
        const bob = Math.sin(time * 0.004 + item.bobOffset) * 4;
        const ix = item.x;
        const iy = item.y + bob;

        // Check collision with cat
        const cdx = ix - cat.x;
        const cdy = iy - cat.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cdist < 40) {
          if (item.type === 'fish') {
            // Collect fish
            item.x = 60 + Math.random() * (width - 120);
            item.y = 60 + Math.random() * (height - 120);
            setScore(s => s + 10);
            catAudio.playPurr();
            catAudio.playBubble();
          } else if (item.type === 'duck') {
            // Push duck away
            item.x += (cdx / cdist) * 35;
            item.y += (cdy / cdist) * 35;
            // Bound inside pool
            item.x = Math.max(40, Math.min(width - 40, item.x));
            item.y = Math.max(40, Math.min(height - 40, item.y));
            catAudio.playSplash(0.3);
          } else if (item.type === 'ball') {
            // Bounce ball
            item.x += (cdx / cdist) * 45;
            item.y += (cdy / cdist) * 45;
            item.x = Math.max(50, Math.min(width - 50, item.x));
            item.y = Math.max(50, Math.min(height - 50, item.y));
            catAudio.playSplash(0.5);
          }
        }

        ctx.save();
        ctx.translate(ix, iy);

        if (item.type === 'fish') {
          // Cute Little Fish Snack
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.ellipse(0, 0, 12, 7, item.angle, 0, Math.PI * 2);
          ctx.fill();
          // Tail
          ctx.beginPath();
          ctx.moveTo(-10, 0);
          ctx.lineTo(-18, -6);
          ctx.lineTo(-18, 6);
          ctx.closePath();
          ctx.fill();
          // Eye
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(6, -2, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(7, -2, 1, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'duck') {
          // Yellow Rubber Duck
          ctx.fillStyle = '#eab308'; // yellow-500
          // Body
          ctx.beginPath();
          ctx.ellipse(0, 2, 14, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          // Head
          ctx.beginPath();
          ctx.arc(8, -6, 7, 0, Math.PI * 2);
          ctx.fill();
          // Beak
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.ellipse(15, -5, 5, 2.5, 0, 0, Math.PI * 2);
          ctx.fill();
          // Eye
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(10, -8, 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'ball') {
          // Colorful Beach Ball
          const radius = 18;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#cbd5e1';
          ctx.stroke();

          // Stripes
          const colors = ['#ef4444', '#3b82f6', '#eab308', '#10b981'];
          for (let s = 0; s < 4; s++) {
            ctx.fillStyle = colors[s];
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, (s * Math.PI) / 2, ((s + 1) * Math.PI) / 2);
            ctx.closePath();
            ctx.fill();
          }
          // Center cap
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 6. Draw Animated Swimming Cat
      ctx.save();
      ctx.translate(cat.x, cat.y);
      ctx.rotate(cat.angle);

      // Coat Colors Definition
      let coatColor = '#f97316'; // orange tabby default
      let stripeColor = '#c2410c';
      let earInner = '#fbcfe8';
      let bellyColor = '#ffedd5';

      if (catColor === 'black') {
        coatColor = '#1e293b';
        stripeColor = '#0f172a';
        bellyColor = '#334155';
      } else if (catColor === 'white_van') {
        coatColor = '#f8fafc';
        stripeColor = '#ea580c'; // Auburn patches
        bellyColor = '#ffffff';
      } else if (catColor === 'bengal') {
        coatColor = '#d97706';
        stripeColor = '#78350f';
        bellyColor = '#fef3c7';
      } else if (catColor === 'siamese') {
        coatColor = '#f1f5f9';
        stripeColor = '#475569'; // Point markings
        bellyColor = '#ffffff';
      }

      // Underwater Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.beginPath();
      ctx.ellipse(0, 10, 26, 38, 0, 0, Math.PI * 2);
      ctx.fill();

      // Animated Paws (Paddling Left & Right alternating)
      const leftPawOffset = Math.sin(cat.pawPhase) * 12;
      const rightPawOffset = Math.sin(cat.pawPhase + Math.PI) * 12;
      const backPawOffset = Math.cos(cat.pawPhase) * 10;

      // Front Left Paw
      ctx.fillStyle = coatColor;
      ctx.beginPath();
      ctx.ellipse(-18, -12 + leftPawOffset, 7, 10, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f472b6'; // pink pad
      ctx.beginPath();
      ctx.arc(-18, -16 + leftPawOffset, 3, 0, Math.PI * 2);
      ctx.fill();

      // Front Right Paw
      ctx.fillStyle = coatColor;
      ctx.beginPath();
      ctx.ellipse(18, -12 + rightPawOffset, 7, 10, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(18, -16 + rightPawOffset, 3, 0, Math.PI * 2);
      ctx.fill();

      // Hind Paws (Back kicking)
      ctx.fillStyle = coatColor;
      ctx.beginPath();
      ctx.ellipse(-14, 28 + backPawOffset, 6, 9, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(14, 28 - backPawOffset, 6, 9, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Swishing Tail
      ctx.save();
      ctx.translate(0, 30);
      ctx.rotate(cat.tailAngle);
      ctx.strokeStyle = stripeColor;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(8, 14, 2, 24);
      ctx.stroke();
      ctx.restore();

      // Main Cat Body (Torso)
      ctx.fillStyle = coatColor;
      ctx.beginPath();
      ctx.ellipse(0, 8, 20, 26, 0, 0, Math.PI * 2);
      ctx.fill();

      // Belly / Patterns
      ctx.fillStyle = bellyColor;
      ctx.beginPath();
      ctx.ellipse(0, 10, 13, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tabby Stripes or spots
      if (catColor === 'orange' || catColor === 'bengal') {
        ctx.strokeStyle = stripeColor;
        ctx.lineWidth = 2.5;
        // Left stripes
        ctx.beginPath();
        ctx.moveTo(-16, 2);
        ctx.lineTo(-8, 5);
        ctx.moveTo(-17, 12);
        ctx.lineTo(-9, 14);
        ctx.stroke();
        // Right stripes
        ctx.beginPath();
        ctx.moveTo(16, 2);
        ctx.lineTo(8, 5);
        ctx.moveTo(17, 12);
        ctx.lineTo(9, 14);
        ctx.stroke();
      }

      // Accessory: Duck Float Ring
      if (accessory === 'duck_float') {
        ctx.fillStyle = '#eab308';
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#facc15';
        ctx.beginPath();
        ctx.ellipse(0, 8, 24, 20, 0, 0, Math.PI * 2);
        ctx.stroke();
        // Little Duck Head on ring
        ctx.beginPath();
        ctx.arc(0, -14, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.arc(0, -20, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cat Head
      ctx.save();
      ctx.translate(0, -16);

      // Ears
      ctx.fillStyle = coatColor;
      // Left Ear
      ctx.beginPath();
      ctx.moveTo(-16, -6);
      ctx.lineTo(-24, -22);
      ctx.lineTo(-8, -14);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = earInner;
      ctx.beginPath();
      ctx.moveTo(-14, -8);
      ctx.lineTo(-20, -18);
      ctx.lineTo(-9, -13);
      ctx.closePath();
      ctx.fill();

      // Right Ear
      ctx.fillStyle = coatColor;
      ctx.beginPath();
      ctx.moveTo(16, -6);
      ctx.lineTo(24, -22);
      ctx.lineTo(8, -14);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = earInner;
      ctx.beginPath();
      ctx.moveTo(14, -8);
      ctx.lineTo(20, -18);
      ctx.lineTo(9, -13);
      ctx.closePath();
      ctx.fill();

      // Head Base
      ctx.fillStyle = coatColor;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();

      // Snout / Cheeks
      ctx.fillStyle = bellyColor;
      ctx.beginPath();
      ctx.ellipse(-5, 4, 7, 5, 0, 0, Math.PI * 2);
      ctx.ellipse(5, 4, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(-3, 1);
      ctx.lineTo(3, 1);
      ctx.lineTo(0, 4);
      ctx.closePath();
      ctx.fill();

      // Cute Eyes (Blinking or focused)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-7, -4, 3, 0, Math.PI * 2);
      ctx.arc(7, -4, 3, 0, Math.PI * 2);
      ctx.fill();
      // Eye Highlights
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-8, -5, 1.2, 0, Math.PI * 2);
      ctx.arc(6, -5, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Whiskers
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      // Left whiskers
      ctx.beginPath();
      ctx.moveTo(-8, 3);
      ctx.lineTo(-24, 0);
      ctx.moveTo(-8, 5);
      ctx.lineTo(-24, 7);
      ctx.stroke();
      // Right whiskers
      ctx.beginPath();
      ctx.moveTo(8, 3);
      ctx.lineTo(24, 0);
      ctx.moveTo(8, 5);
      ctx.lineTo(24, 7);
      ctx.stroke();

      // Accessory: Diving Goggles
      if (accessory === 'goggles') {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.strokeStyle = '#0891b2';
        ctx.lineWidth = 2;
        // Left lens
        ctx.beginPath();
        ctx.ellipse(-7, -4, 6, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Right lens
        ctx.beginPath();
        ctx.ellipse(7, -4, 6, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Strap
        ctx.strokeStyle = '#0e7490';
        ctx.beginPath();
        ctx.moveTo(-13, -4);
        ctx.lineTo(-18, -4);
        ctx.moveTo(13, -4);
        ctx.lineTo(18, -4);
        ctx.stroke();
      }

      ctx.restore(); // restore head

      // Accessory: Shark Fin Life Vest
      if (accessory === 'shark_fin') {
        // Orange Life Vest harness
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.ellipse(0, 8, 16, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        // Shark Fin on back
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.lineTo(0, 16);
        ctx.lineTo(8, 6);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore(); // restore cat transform

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [catColor, accessory, theme, autoSwim, speedLevel]);

  // Pointer Interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    catState.current.targetX = px;
    catState.current.targetY = py;
    setAutoSwim(false);

    // Splash ripple at touch point
    ripplesRef.current.push({
      x: px,
      y: py,
      radius: 4,
      maxRadius: 36,
      opacity: 0.9
    });

    catAudio.playSplash(0.6);
    setStrokeCount(c => c + 1);
  };

  const handleResetToys = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    initItems(rect.width, rect.height);
    setScore(0);
    catAudio.playBubble();
  };

  return (
    <div id="cat-pool-simulator-section" className="space-y-6">
      
      {/* Title & Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-3xl border border-cyan-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              🏊‍♂️ Hồ Bơi Tương Tác 3D - Điều Khiển Mèo Bơi
            </h2>
            <span className="text-xs bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
              Mô phỏng nước sống động
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Chạm hoặc click chuột vào hồ bơi để dẫn đường cho bé mèo, vớt cá vàng và đùa nghịch với vịt cao su!
          </p>
        </div>

        {/* Score & Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-amber-500/30 shadow-inner">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Điểm cá vàng</p>
              <p className="text-base font-extrabold text-amber-300">{score} điểm</p>
            </div>
          </div>

          <button
            onClick={handleResetToys}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl border border-slate-700 transition-colors"
            title="Đặt lại đồ chơi và điểm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[560px] rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/50 bg-slate-900">
        <canvas
          id="cat-swimming-canvas"
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          className="w-full h-full cursor-crosshair touch-none select-none block"
        />

        {/* Overlay Floating Floating HUD */}
        <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-semibold text-cyan-300 flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Chế độ: {autoSwim ? 'Tự Động Bơi Dạo' : 'Người Dùng Điều Khiển'}</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setAutoSwim(!autoSwim)}
            className="bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/40 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg transition-all"
          >
            {autoSwim ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{autoSwim ? 'Tạm dừng tự bơi' : 'Bật Tự Động Bơi'}</span>
          </button>
        </div>

        {/* Bottom Swimming Tips on Canvas */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none text-[11px] text-white/80 bg-slate-950/40 backdrop-blur-sm px-3 py-1.5 rounded-xl">
          <span>💡 Gợi ý: Click bất kỳ đâu trên mặt hồ để tạo sóng và gọi mèo bơi tới</span>
          <span className="hidden sm:inline">Nhấn Meo Meo để nghe tiếng rừ rừ purr purr</span>
        </div>
      </div>

      {/* Control Panel: Cat Customizer, Accessories, Themes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Cat Coat Breed Selector */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-2.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
            🐱 Chọn màu lông & giống mèo
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'orange', label: 'Mướp Vàng', color: '#f97316' },
              { id: 'white_van', label: 'Turkish Van', color: '#f8fafc' },
              { id: 'bengal', label: 'Mèo Bengal', color: '#d97706' },
              { id: 'black', label: 'Mèo Đen Nathan', color: '#1e293b' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCatColor(item.id as CatColor);
                  catAudio.playPurr();
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                  catColor === item.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accessory Equipment */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-2.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
            🦺 Phụ kiện bơi lội cho bé
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'shark_fin', label: 'Áo Vây Cá Mập' },
              { id: 'goggles', label: 'Kính Lặn Goggles' },
              { id: 'duck_float', label: 'Phao Vịt Vàng' },
              { id: 'none', label: 'Bơi Tự Nhiên' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setAccessory(item.id as Accessory);
                  catAudio.playBubble();
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  accessory === item.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pool Weather & Lighting Theme */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-2.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
            🌅 Khung cảnh & Tốc độ bơi
          </label>
          
          <div className="flex gap-2">
            {[
              { id: 'sunny', label: 'Ban Ngày', icon: Sun },
              { id: 'sunset', label: 'Hoàng Hôn', icon: Sunset },
              { id: 'night', label: 'Ban Đêm', icon: Moon },
            ].map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as PoolTheme)}
                  className={`flex-1 py-2 px-1.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all ${
                    theme === t.id
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-md'
                      : 'bg-slate-900/60 border-slate-700 text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-1 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Tốc độ bơi:</span>
            <div className="flex gap-1">
              {[1, 2, 3].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSpeedLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    speedLevel === lvl ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {lvl === 1 ? 'Chậm' : lvl === 2 ? 'Vừa' : 'Nhanh'}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
