// -----------------------------
    // RANDOM STARS
    // -----------------------------

    const background = document.querySelector(".background");

    for(let i = 0; i < 100; i++){

        const star = document.createElement("div");

        star.classList.add("star");

        const size = Math.random() * 3 + 1;

        star.style.width = size + "px";
        star.style.height = size + "px";

        star.style.left = Math.random() * window.innerWidth + "px";

        star.style.top = Math.random() * window.innerHeight + "px";

        star.style.animationDuration =
        (Math.random()*3+2)+"s";

        background.appendChild(star);

    }
    // ==========================
    // REAL RAIN
    // ==========================

    for (let i = 0; i < 250; i++) {

        const drop = document.createElement("div");

        drop.classList.add("drop");

        drop.style.left = Math.random() * window.innerWidth + "px";

        drop.style.top = Math.random() * window.innerHeight + "px";

        drop.style.height = (Math.random() * 20 + 10) + "px";

        drop.style.animationDuration = (Math.random() * 2 + 3) + "s";
        drop.style.animationDelay = (Math.random() * 2) + "s";

        background.appendChild(drop);

    }
    // ==========================
    // STAGE 2, 3 & 4: MUSIC + ENVELOPE + LETTER
    // ==========================

    const startBtn = document.getElementById("startBtn");
    const glassCard = document.querySelector(".glass-card");
    const envelopeWrapper = document.getElementById("envelopeWrapper");
    const envelopeImg = document.getElementById("envelopeImg");
    const bgMusic = document.getElementById("bgMusic");
    const letterWrapper = document.getElementById("letterWrapper");
    const letterBtn = document.getElementById("letterBtn");
    const cakeWrapper = document.getElementById("cakeWrapper");
    const cakeImg = document.getElementById("cakeImg");
    const cakeText = document.getElementById("cakeText");
    const cheersText = document.getElementById("cheersText");
    const candles = document.querySelectorAll(".candle");

    // Synthetic click sound (no file needed)
    function playClick() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }

    let musicStarted = false;

    function startMusic() {
        if (musicStarted) return;
        musicStarted = true;

        bgMusic.volume = 0;
        bgMusic.play().catch(err => {
            console.log("Music waiting for interaction:", err);
        });
        let vol = 0;
        const fadeIn = setInterval(() => {
            if (vol < 1) {
                vol += 0.02;
                bgMusic.volume = Math.min(vol, 1);
            } else {
                clearInterval(fadeIn);
            }
        }, 150);
    }

    document.addEventListener("click", startMusic, { once: true });
    document.addEventListener("touchstart", startMusic, { once: true });

    startBtn.addEventListener("click", () => {
        playClick();
        glassCard.classList.add("fade-out");

        setTimeout(() => {
            envelopeWrapper.classList.add("show");
        }, 800);
    });

    envelopeImg.addEventListener("click", () => {
        envelopeImg.classList.add("opened");
        envelopeWrapper.classList.add("fade-out");

        setTimeout(() => {
            letterWrapper.classList.add("show");
        }, 1000);
    });

    const giftboxWrapper = document.getElementById("giftboxWrapper");
    const giftboxImg = document.getElementById("giftboxImg");

    letterBtn.addEventListener("click", () => {
        letterWrapper.classList.add("fade-out");

        setTimeout(() => {
            giftboxWrapper.classList.add("show");
        }, 1000);
    });

    giftboxImg.addEventListener("click", () => {
        playClick();
        giftboxImg.classList.add("opened");
        giftboxWrapper.classList.add("fade-out");

        setTimeout(() => {
            startFireworks();
        }, 800);

        setTimeout(() => {
            cakeWrapper.classList.add("show");
        }, 5000);
    });

    cakeImg.addEventListener("click", () => {
        playClick();

        candles.forEach((candle, i) => {
            setTimeout(() => {
                candle.classList.add("blown");
            }, i * 150);
        });

        cakeText.style.opacity = 0;
        cheersText.classList.add("show");

        setTimeout(() => {
            cakeWrapper.classList.add("fade-out");
            startGallery();
        }, 3000);
    });

    // ==========================
    // STAGE 6: REALISTIC FIREWORKS
    // ==========================

    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const colors = ["#f7d621", "#459cff", "#dabfbf", "#0cd627", "#ff008c"];

    class Rocket {
        constructor(x) {
            this.x = x;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height * 0.35 + 80;
            this.speed = Math.random() * 4 + 8;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.trail = [];
            this.done = false;
        }

        update() {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 8) this.trail.shift();

            this.y -= this.speed;

            if (this.y <= this.targetY) {
                this.done = true;
                createFirework(this.x, this.y, this.color);
            }
        }

        draw() {
            this.trail.forEach((point, i) => {
                ctx.save();
                ctx.globalAlpha = i / this.trail.length * 0.6;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            ctx.save();
            ctx.fillStyle = "#fff";
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.alpha = 1;
            this.gravity = 0.04;
            this.friction = 0.98;
            this.size = Math.random() * 2 + 1.5;
            this.flicker = Math.random() * 0.5 + 0.5;
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.012;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(this.alpha, 0) * this.flicker;
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    let particles = [];
    let rockets = [];

    function createFirework(x, y, color) {
        const particleCount = 80;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(x, y, color));
        }
        setTimeout(() => {
            for (let i = 0; i < 20; i++) {
                particles.push(new Particle(x, y, "#ffffff"));
            }
        }, 150);
    }

    function animateFireworks() {
        ctx.fillStyle = "rgba(10, 12, 22, 0.15)";
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        rockets.forEach((r, i) => {
            r.update();
            r.draw();
            if (r.done) rockets.splice(i, 1);
        });

        particles.forEach((p, index) => {
            p.update();
            p.draw();
            if (p.alpha <= 0) particles.splice(index, 1);
        });

        requestAnimationFrame(animateFireworks);
    }

    animateFireworks();

    let fireworksInterval;

    function startFireworks() {
        let count = 0;
        fireworksInterval = setInterval(() => {
            const x = Math.random() * canvas.width * 0.7 + canvas.width * 0.15;
            rockets.push(new Rocket(x));
            count++;
            if (count > 10) {
                clearInterval(fireworksInterval);
            }
        }, 400);
    }

    // ==========================
    // STAGE 8: MEMORY GALLERY (Updated for 3 images)
    // ==========================

    const galleryWrapper = document.getElementById("galleryWrapper");
    const memoryCard = document.getElementById("memoryCard");
    const memoryImg = document.getElementById("memoryImg");
    const memoryCaption = document.getElementById("memoryCaption");

    const memories = [
        { src: "assets/images/memory1.png", caption: "So proud of you and everything you're building. ✨" },
        { src: "assets/images/memory2.png", caption: "Effortlessly you. This is the face I fell for. 😎" },
        { src: "assets/images/memory3.png", caption: "Every angle of you is one I want to remember. 🤎" }
    ];

    memories.forEach((m) => {
        const preloadImg = new Image();
        preloadImg.src = m.src;
    });

    let memoryIndex = 0;
    let memoryTimer;

    function revealMemory(memory){
        clearTimeout(memoryTimer);

        memoryCaption.textContent = memory.caption;
        memoryImg.src = memory.src;

        memoryCard.classList.remove("active");
        void memoryCard.offsetWidth;

        requestAnimationFrame(() => {
            memoryCard.classList.add("active");
        });

        memoryTimer = setTimeout(() => {
            memoryCard.classList.remove("active");

            memoryTimer = setTimeout(() => {
                memoryIndex++;
                showNextMemory();
            }, 2000);

        }, 5000);
    }

    function showNextMemory() {
        if (memoryIndex >= memories.length) {
            galleryWrapper.classList.add("fade-out");
            setTimeout(() => {
                startReasons();
            }, 1200);
            return;
        }
        revealMemory(memories[memoryIndex]);
    }

    function startGallery() {
        galleryWrapper.classList.add("show");
        memoryIndex = 0;
        showNextMemory();
    }

    // ==========================
    // STAGE 9: 100 REASONS
    // ==========================

    const reasonsWrapper = document.getElementById("reasonsWrapper");
    const reasonText = document.getElementById("reasonText");

    const reasons = [
        "I love your smile because it feels like a little piece of sunshine entering my world.",
        "I love the way you make ordinary moments feel like memories worth keeping.",
        "I love your heart, because kindness lives naturally inside you.",
        "I love the way your eyes tell stories even when you say nothing.",
        "I love how you make me feel understood without needing many words.",
        "I love your laugh because it is one of my favorite sounds in the universe.",
        "I love the little things you do that you probably don't even notice.",
        "I love your strength, especially during moments when life feels heavy.",
        "I love the dreams you carry and the passion you put into them.",
        "I love how you make people around you feel special.",
        "I love the comfort I feel when I am with you.",
        "I love your imperfections because they make you beautifully real.",
        "I love every memory we have created together.",
        "I love the way your presence can turn a bad day into a better one.",
        "I love you because my world feels warmer with you in it.",
        "I love the way you look when you are lost in your thoughts.",
        "I love your patience and the calm you bring into my life.",
        "I love how your happiness becomes my happiness.",
        "I love the way you care about the smallest details.",
        "I love the moments where we laugh until we forget time.",
        "I love how you inspire me to become better.",
        "I love the way you believe in the people you love.",
        "I love your courage to keep moving forward.",
        "I love the peace I find when I am beside you.",
        "I love the way you make love feel simple and natural.",
        "I love your voice because it feels familiar and comforting.",
        "I love your energy because it makes every place brighter.",
        "I love your kindness even when nobody is watching.",
        "I love the way you make my heart feel at home.",
        "I love you because you are my favorite person to share life with.",
        "I love your little expressions that make me smile.",
        "I love the way you celebrate happiness with me.",
        "I love your honesty and the trust we share.",
        "I love how you never have to pretend to be someone else.",
        "I love the memories we haven't created yet.",
        "I love the future I imagine with you.",
        "I love the way you make love feel like a safe place.",
        "I love your beautiful mind and the way you see the world.",
        "I love how every conversation with you matters.",
        "I love the way you make silence feel comfortable.",
        "I love your curiosity and your desire to learn.",
        "I love your gentle heart.",
        "I love the way you make people feel valued.",
        "I love your determination.",
        "I love the way you never stop growing.",
        "I love your excitement when something makes you happy.",
        "I love your little habits that make you uniquely you.",
        "I love your warmth and the kindness you carry.",
        "I love the way you make moments unforgettable.",
        "I love your ability to make me smile without trying.",
        "I love the way you bring calm into my chaos.",
        "I love your beautiful soul.",
        "I love the way you care deeply.",
        "I love your dreams, your fears, and everything that makes you human.",
        "I love every version of you.",
        "I love the way you make my heart choose you again and again.",
        "I love your courage to be yourself.",
        "I love the way you make life feel like an adventure.",
        "I love the small conversations that become big memories.",
        "I love the way you make my heart feel lucky.",
        "I love your kindness when nobody expects it.",
        "I love your smile on the happiest days.",
        "I love your strength on the difficult days.",
        "I love your honesty even when it is hard.",
        "I love your beautiful way of loving.",
        "I love your passion and dedication.",
        "I love the way you make me feel appreciated.",
        "I love your presence more than words can explain.",
        "I love the way you make my life more meaningful.",
        "I love the way you understand my heart.",
        "I love the moments where we simply exist together.",
        "I love how every day with you feels different.",
        "I love the memories written in our story.",
        "I love the person you are today.",
        "I love the person you are becoming.",
        "I love your smile that I could never get tired of seeing.",
        "I love your heart that I could never stop admiring.",
        "I love your dreams that I will always support.",
        "I love your happiness that I always want to protect.",
        "I love your laughter that I want to hear forever.",
        "I love your hand that I want to hold through every season.",
        "I love your soul that makes you impossible to replace.",
        "I love the way you make my world complete.",
        "I love every chapter we have written together.",
        "I love every chapter we still have left.",
        "I love you for yesterday.",
        "I love you for today.",
        "I love you for every tomorrow waiting for us.",
        "I love you for all the reasons I can explain.",
        "And I love you for all the reasons my heart knows but words cannot describe.",
        "You are not just a part of my story. You are my favorite chapter.",
        "You are the person my heart chooses every single day.",
        "You are my happiness, my comfort, and my home.",
        "After 100 reasons, there is still one simple truth: I love you.",
        "Forever will never feel long enough with you."
    ];

    let reasonGroup = 0;
    const groupSize = 15;

    function startReasons(){
        galleryWrapper.classList.add("fade-out");
        setTimeout(()=>{
            reasonsWrapper.classList.add("show");
            showReasonGroup();
        },1200);
    }

    function showReasonGroup(){
        const start = reasonGroup * groupSize;
        const end = start + groupSize;

        if(start >= reasons.length){
            reasonsWrapper.classList.remove("show");
            setTimeout(()=>{
                startUniverseStage();
            },4000);
            return;
        }

        let page = "";
        for(let i=start; i<end && i<reasons.length; i++){
            page += `${i+1}. ${reasons[i]}`;
        }

        reasonText.style.opacity = 0;
        setTimeout(()=>{
            reasonText.innerHTML = page;
            reasonText.style.opacity = 1;
        },1200);

        reasonGroup++;

        setTimeout(()=>{
            showReasonGroup();
        },30000);
    }

    // ==========================
    // STAGE 10: OUR LITTLE UNIVERSE
    // ==========================

    const universeWrapper = document.getElementById("universeWrapper");
    const universeQuote = document.getElementById("universeQuote");
    const constellationSvg = document.getElementById("constellationSvg");
    const universeBtn = document.getElementById("universeBtn");

    universeBtn.addEventListener("click", () => {
        playClick();
        startFinalStage();
    });

    function startUniverseStage() {
        reasonsWrapper.classList.remove("show");
        universeWrapper.classList.add("show");

        const photoNodes = [];
        const minDistance = 220;
        const padding = 120;

        memories.forEach(() => {
            let x, y, tries = 0, validPosition = false;
            while (!validPosition && tries < 40) {
                x = padding + Math.random() * (window.innerWidth - padding * 2);
                y = padding + Math.random() * (window.innerHeight - padding * 2);
                validPosition = photoNodes.every(p => Math.hypot(x - p.x, y - p.y) > minDistance);
                tries++;
            }
            photoNodes.push({ x, y });
        });

        const bgStarPositions = [];
        for (let i = 0; i < 50; i++) {
            const star = document.createElement("div");
            star.classList.add("extra-star");
            const size = Math.random() * 3 + 1.5;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            star.style.width = size + "px";
            star.style.height = size + "px";
            star.style.left = x + "px";
            star.style.top = y + "px";
            star.style.animationDuration = (Math.random() * 3 + 2) + "s";
            background.appendChild(star);
            bgStarPositions.push({ x, y });
        }

        setTimeout(() => {
            for (let i = 0; i < photoNodes.length - 1; i++) {
                const a = photoNodes[i];
                const b = photoNodes[i + 1];

                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", a.x);
                line.setAttribute("y1", a.y);
                line.setAttribute("x2", b.x);
                line.setAttribute("y2", b.y);
                line.classList.add("constellation-line");

                constellationSvg.appendChild(line);

                setTimeout(() => {
                    line.classList.add("show");
                }, i * 200);
            }
        }, 800);

        setTimeout(() => {
            memories.forEach((memory, i) => {
                const photo = document.createElement("img");
                photo.src = memory.src;
                photo.classList.add("sky-photo");

                const size = 90;
                const node = photoNodes[i];

                photo.style.width = size + "px";
                photo.style.height = size + "px";
                photo.style.left = (node.x - size / 2) + "px";
                photo.style.top = (node.y - size / 2) + "px";

                universeWrapper.appendChild(photo);

                setTimeout(() => {
                    photo.classList.add("show");
                }, 1600 + i * 300);
            });
        }, 0);

        setTimeout(() => {
            universeQuote.classList.add("show");
            setTimeout(() => {
                universeBtn.classList.add("show");
            }, 1500);
        }, 3800);
    }

    // ==========================
    // STAGE 12: FINAL SURPRISE
    // ==========================

    const finalWrapper = document.getElementById("finalWrapper");
    const finalMessage = document.getElementById("finalMessage");

    function startFinalStage() {
        universeWrapper.classList.add("fade-out");
        background.classList.add("final-glow");

        document.querySelectorAll(".drop").forEach(drop => {
            drop.classList.add("soft-rain");
        });

        setTimeout(() => {
            finalWrapper.classList.add("show");
            setTimeout(() => {
                finalMessage.classList.add("show");
            }, 500);
        }, 2500);

        setTimeout(() => {
            finalMessage.classList.remove("show");
        }, 20000);
    }