gsap.registerPlugin(ScrollTrigger);

// --- Cinematic Particle Generation ---
function createParticles(containerClass, particleClass, count) {
  const container = document.querySelector(containerClass);
  if (!container) return;
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add(particleClass);
    
    // Random horizontal position
    particle.style.left = Math.random() * 100 + '%';
    
    if(particleClass === 'fire-particle') {
       // Mix of embers (big, slow) and sparks (tiny, fast)
       const isSpark = Math.random() > 0.6;
       const size = isSpark ? (Math.random() * 4 + 2) : (Math.random() * 14 + 6);
       particle.style.width = size + 'px';
       particle.style.height = size + 'px';
       
       // Rich color palette: deep red → orange → yellow → white-hot
       const colors = [
         'var(--accent-orange)',
         'var(--accent-yellow)', 
         '#ff4500',
         '#ff8c00',
         '#ffcc33'
       ];
       particle.style.background = colors[Math.floor(Math.random() * colors.length)];
       particle.style.animationDuration = isSpark ? (Math.random() * 1.5 + 1) + 's' : (Math.random() * 3 + 2.5) + 's';
       particle.style.animationDelay = (Math.random() * 4) + 's';
       
       // Sparks get extra brightness
       if(isSpark) {
         particle.style.filter = 'blur(1px)';
         particle.style.boxShadow = '0 0 6px rgba(255,200,0,1)';
       }
    } else if(particleClass === 'water-drop') {
       // Mix of bubbles (big, slow) and droplets (tiny, fast)
       const isBubble = Math.random() > 0.5;
       const size = isBubble ? (Math.random() * 10 + 6) : (Math.random() * 4 + 2);
       particle.style.width = size + 'px';
       particle.style.height = size + 'px';
       
       const waterColors = ['var(--water-light)', 'var(--water-blue)', '#90e0ef', '#48cae4'];
       particle.style.background = waterColors[Math.floor(Math.random() * waterColors.length)];
       particle.style.animationDuration = isBubble ? (Math.random() * 3 + 3) + 's' : (Math.random() * 2 + 2) + 's';
       particle.style.animationDelay = (Math.random() * 4) + 's';
       
       if(isBubble) {
         particle.style.filter = 'blur(1px)';
         particle.style.boxShadow = '0 0 10px rgba(0,180,216,0.8), inset 0 0 3px rgba(255,255,255,0.3)';
       }
    } else {
       if (particleClass === 'water-ripple') {
         particle.style.top = `${20 + Math.random() * 60}%`;
       }
       particle.style.animationDuration = (Math.random() * 2 + 3) + 's';
       particle.style.animationDelay = (Math.random() * 2) + 's';
       const scale = 0.5 + Math.random() * 1;
       particle.style.transform = `scale(${scale})`;
    }
    
    container.appendChild(particle);
  }
}

// Generate cinematic particles
createParticles('.fire-effect', 'fire-particle', 50);
createParticles('.water-effect', 'water-drop', 35);
createParticles('.water-effect', 'water-ripple', 5);

// --- Initial State Setup ---
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Setup GSAP Defaults
gsap.set(".gas-panel, .water-panel, .footer-panel", { autoAlpha: 0 });
gsap.set(".gas-wrapper", { scale: 0.3, autoAlpha: 0, y: "15vh", rotationY: -45 });
gsap.set(".water-wrapper", { scale: 0.3, autoAlpha: 0, y: "15vh", rotationZ: -15 });
gsap.set(".fire-effect, .water-effect", { autoAlpha: 0 });
// Initial state for review cards to ensure GSAP can animate them in
gsap.set(".review-card", { opacity: 0, y: 50 });

let isMobile = window.innerWidth < 768;
window.addEventListener('resize', () => { isMobile = window.innerWidth < 768; });

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scroll-track",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.2, // Smooth interpolation
  }
});

const gasDesktopX = "-20vw";
const gasTextDesktopX = "20vw";
const waterDesktopX = "20vw";
const waterTextDesktopX = "-20vw";

// --- Scene 1: Intro -> Gas Cylinder ---
tl.to(".hero-panel", { autoAlpha: 0, y: "-10vh", duration: 1 })
  
  // Fade out cinematic hero background
  .to(".hero-bg-container", { autoAlpha: 0, duration: 1.5 }, "<")
  
  // Fire Effect & Heat Distortion Fade In
  .to(".fire-effect", { autoAlpha: 1, duration: 2 }, "<")
  
  // Gas Cylinder enters (Scale + Parallax RotateY + Y displacement)
  .to(".gas-wrapper", { 
    scale: isMobile ? 0.9 : 1.1, 
    autoAlpha: 1, 
    y: 0, 
    rotationY: 0, // Rotates into full view
    duration: 2 
  }, "<0.5")
  
  // Move Gas to side and rotate slightly for depth
  .to(".gas-wrapper", { 
    x: () => isMobile ? 0 : gasDesktopX, 
    y: () => isMobile ? "-15vh" : 0,
    rotationY: 15, // 3D depth rotation
    rotationZ: 5,
    duration: 2 
  })
  .to(".gas-panel", { 
    autoAlpha: 1, 
    x: () => isMobile ? 0 : gasTextDesktopX,
    y: () => isMobile ? "0" : 0,
    duration: 2 
  }, "<")
  
  // Hold Scene 1
  .to({}, { duration: 1.5 })

// --- Scene 2: Gas Cylinder -> Water Gallon (Morphing) ---
  // Hide Gas & Fire
  .to(".gas-wrapper", { autoAlpha: 0, y: "-20vh", scale: 0.5, rotationY: 45, duration: 2 })
  .to(".gas-panel", { autoAlpha: 0, y: "-10vh", duration: 2 }, "<")
  .to(".fire-effect", { autoAlpha: 0, duration: 1.5 }, "<")
  
  // Logo changes color
  .to(".logo span", { color: "#00b4d8", duration: 1 }, "<")
  
  // Water Effect Fade In (Morph feel)
  .to(".water-effect", { autoAlpha: 1, duration: 2 }, "-=1")
  
  // Water enters
  .to(".water-wrapper", { 
    scale: isMobile ? 0.9 : 1.1, 
    autoAlpha: 1, 
    y: 0, 
    rotationZ: 0, // Straightens out
    duration: 2 
  }, "-=1")
  
  // Move Water to side with tilt parallax
  .to(".water-wrapper", { 
    x: () => isMobile ? 0 : waterDesktopX, 
    y: () => isMobile ? "-15vh" : 0,
    rotationZ: -8, // Slight tilt like pouring
    rotationY: -10,
    duration: 2 
  })
  .to(".water-panel", { 
    autoAlpha: 1, 
    x: () => isMobile ? 0 : waterTextDesktopX,
    y: () => isMobile ? "0" : 0,
    duration: 2 
  }, "<")

  // Hold Scene 2
  .to({}, { duration: 1.5 })

// --- Scene 3: Water Gallon -> Footer & Social Proof ---
  // Hide Water & Effects
  .to(".water-wrapper", { autoAlpha: 0, y: "-20vh", scale: 0.5, rotationZ: -20, duration: 2 })
  .to(".water-panel", { autoAlpha: 0, y: "-10vh", duration: 2 }, "<")
  .to(".water-effect", { autoAlpha: 0, duration: 1.5 }, "<")
  
  // Show Footer & Marquee
  .to(".final-scene-panel", { autoAlpha: 1, y: 0, duration: 2 })
  
  // Counter Animation trigger inside timeline
  .to({}, {
    duration: 0.1,
    onStart: () => {
      const counter = document.querySelector('.counter-value');
      const target = +counter.getAttribute('data-target');
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2.5,
        ease: "power3.out",
        onUpdate: function() {
          counter.innerText = "+" + Math.floor(this.targets()[0].val);
        }
      });
    }
  }, "<")

  // Stagger in the Review Cards
  .to(".review-card", {
    opacity: 1,
    y: 0,
    stagger: 0.3,
    duration: 1,
    ease: "back.out(1.7)"
  }, "-=1")
  
  // Hold Scene 3 (End)
  .to({}, { duration: 1.5 });

// --- Micro-interactions ---
// Little star shine effect on hover
document.querySelectorAll('.review-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card.querySelector('.stars'), { 
      scale: 1.1, 
      textShadow: "0px 0px 10px rgba(255,179,0,0.8)",
      duration: 0.3, 
      yoyo: true, 
      repeat: 1 
    });
  });
});
