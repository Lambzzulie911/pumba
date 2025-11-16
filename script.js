/* ========== GLOBAL SETUP ========== */
const birthdaySong = document.getElementById("birthdaySong");
const secretBtn = document.getElementById("secretBtn");
const secretMsg = document.getElementById("secretMsg");

/* ---------- background canvas (sparkles / stars) ---------- */
const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");
bgCanvas.width = innerWidth;
bgCanvas.height = innerHeight;

let sparkles = [];
for (let i = 0; i < 120; i++) {
  sparkles.push({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    r: Math.random() * 1.6 + 0.6,
    vy: Math.random() * 0.2 + 0.05,
    glow: Math.random() * 0.9 + 0.2
  });
}
function drawSparkles() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  for (let s of sparkles) {
    bgCtx.beginPath();
    bgCtx.fillStyle = 'rgba(255,255,255,${s.glow})';
    bgCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    bgCtx.fill();
    s.y += s.vy;
    if (s.y > bgCanvas.height) s.y = -10;
  }
  requestAnimationFrame(drawSparkles);
}
drawSparkles();

/* ---------- fireworks canvas ---------- */
const fw = document.getElementById("fireworks");
const fctx = fw.getContext("2d");
fw.width = innerWidth;
fw.height = innerHeight;

let particles = [];
function random(min, max){ return Math.random()*(max-min)+min; }

class Particle {
  constructor(x,y,color){
    this.x = x; this.y = y;
    this.vx = random(-4,4);
    this.vy = random(-4,4);
    this.color = color;
    this.alpha = 1;
    this.size = Math.random()*2.2 + 1.2;
  }
  update(){
    this.x += this.vx; this.y += this.vy;
    this.vy += 0.03; // gravity
    this.alpha -= 0.01;
  }
  draw(){
    fctx.globalAlpha = this.alpha;
    fctx.beginPath();
    fctx.fillStyle = this.color;
    fctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    fctx.fill();
  }
}

function createFirework(x,y){
  const colors = ["#00bfff","#66d9ff","#ffffff","#a3d4ff","#87cefa"];
  for(let i=0;i<40;i++){
    particles.push(new Particle(x,y, colors[Math.floor(Math.random()*colors.length)]));
  }
}

function fwLoop(){
  fctx.clearRect(0,0,fw.width,fw.height);
  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.update();
    p.draw();
    if(p.alpha <= 0) particles.splice(i,1);
  }
  requestAnimationFrame(fwLoop);
}
fwLoop();

/* ---------- floating hearts ---------- */
const heartsContainer = document.getElementById("hearts");
function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart";
  const left = Math.random()*100;
  h.style.left = left + "vw";
  h.style.bottom = "-40px";
  h.style.width = 18 + Math.random()*18 + "px";
  h.style.height = parseFloat(h.style.width) + "px";
  h.style.animationDuration = 5 + Math.random()*5 + "s";
  heartsContainer.appendChild(h);
  setTimeout(()=> h.remove(), 10000);
}
setInterval(spawnHeart, 900);

/* ---------- slideshow (fade) ---------- */
let slideIndex = 0;
function showSlides() {
  const slides = document.querySelectorAll(".slides");
  if (slides.length === 0) return;
  slides.forEach(s => s.classList.remove("active"));
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add("active");
  setTimeout(showSlides, 3000);
}
showSlides();

/* ---------- window resize handling ---------- */
window.addEventListener("resize", () => {
  bgCanvas.width = innerWidth; bgCanvas.height = innerHeight;
  fw.width = innerWidth; fw.height = innerHeight;
});

/* ---------- secret message + audio + fireworks ---------- */
const messageText = `Thank you for always being there for me — for the advice, the laughs,
the support, and the way you show up every single time I need you.
I’m really grateful for you.

I hope this year brings you everything you deserve: happiness, growth,
success, and moments that make you feel appreciated.

Enjoy your day, you deserve it! 🎂✨
Love you lots.`;

// typewriter that respects line breaks and types line-by-line
function typeWriterWithBreaks(text, container, charDelay = 35, lineDelay = 300){
  container.innerHTML = "";
  const lines = text.split("\n");
  let li = 0;

  function typeLine(){
    if (li >= lines.length) return;
    const line = lines[li];
    const p = document.createElement("p");
    container.appendChild(p);
    let ci = 0;
    function typeChar(){
      if (ci < line.length){
        // escape HTML special chars
        p.innerHTML += line.charAt(ci) === "<" ? "&lt;" : (line.charAt(ci) === ">" ? "&gt;" : line.charAt(ci));
        ci++;
        setTimeout(typeChar, charDelay);
      } else {
        li++;
        setTimeout(typeLine, lineDelay);
      }
    }
    typeChar();
  }
  typeLine();
}

secretBtn.addEventListener("click", () => {
  secretBtn.style.display = "none";
  secretMsg.classList.remove("hidden");

  // start typewriter
  typeWriterWithBreaks(messageText, secretMsg, 36, 360);

  // play audio (user interaction allows playback)
  birthdaySong.loop = true;
  birthdaySong.volume = 1.0;
  birthdaySong.play().catch(()=>console.log("Audio blocked until user interacts"));

  // start periodic fireworks
  const fwInterval = setInterval(()=>{
    createFirework(random(80, fw.width-80), random(40, fw.height/2));
  }, 900);

  // stop fireworks after some time (optional) — keep if you want infinite
  setTimeout(()=>{ /* clearInterval(fwInterval); */ }, 60000);
});

/* ---------- click anywhere to spawn a firework (nice touch) ---------- */
document.addEventListener("click", (e)=>{
  // don't spawn if clicking the secret button (it already spawns)
  if (e.target === secretBtn) return;
  createFirework(e.clientX, e.clientY);
});

/* ---------- small initialization - ensure canvases sized ---------- */
(function initSizes(){
  bgCanvas.width = innerWidth; bgCanvas.height = innerHeight;
  fw.width = innerWidth; fw.height = innerHeight;
})();