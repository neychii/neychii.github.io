const audio = document.getElementById("bgm");
const toggle = document.getElementById("musicToggle");

function tryAutoplay() {
    audio
        .play()
        .then(() => {
            toggle.textContent = "pause";
        })
        .catch(() => {
            toggle.textContent = "play_arrow";
            document.body.classList.add("needs-interaction");
        });
}

// Try immediately
tryAutoplay();

// Unlock audio on first user interaction
const unlockAudio = () => {
    audio.play();
    document.body.classList.remove("needs-interaction");

    document.removeEventListener("click", unlockAudio);
    document.removeEventListener("touchstart", unlockAudio);
};

document.addEventListener("click", unlockAudio);
document.addEventListener("touchstart", unlockAudio);

audio.addEventListener("play", () => {
    document.body.classList.add("music-playing");

    initVisualizer();

    if (audioCtx.state === "suspended") audioCtx.resume();

    const now = audioCtx.currentTime;

    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.6); // smooth fade-in
});
audio.addEventListener("pause", () => {
    document.body.classList.remove("music-playing");
});

toggle.onclick = () => {
    if (audio.paused) {
        audio.play();
        toggle.textContent = "pause";
    } else {
        const now = audioCtx.currentTime;

        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.4);

        setTimeout(() => audio.pause(), 400);
        toggle.textContent = "play_arrow";
    }
};

const overlay = document.getElementById("socialOverlay");

document.getElementById("openSocials").onclick = () => {
    overlay.style.display = "flex";
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => overlay.classList.add("show"));
};

overlay.onclick = e => {
    if (e.target !== overlay) return;

    const modal = overlay.querySelector(".social-modal");
    modal.classList.add("closing");
    overlay.classList.remove("show");

    document.body.classList.remove("modal-open");

    modal.addEventListener(
        "animationend",
        () => {
            modal.classList.remove("closing");
            overlay.style.display = "none";
        },
        { once: true }
    );
};

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let audioCtx, analyser, source, gainNode;
let initialized = false;

function initVisualizer() {
    if (initialized) return;
    initialized = true;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0; // start silent

    source = audioCtx.createMediaElementSource(audio);

    source.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audioCtx.destination);

    draw();
}

let smoothPulse = 0;

function draw() {
    requestAnimationFrame(draw);

    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(data);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "lighter";

    const visualWidth = canvas.width * 0.9;
    const startX = (canvas.width - visualWidth) / 2;
    const barWidth = visualWidth / bufferLength;
    const centerY = canvas.height * 0.7;

    const avg = data.reduce((sum, v) => sum + v, 0) / bufferLength;

    const targetPulse = avg / 255;
    smoothPulse += (targetPulse - smoothPulse) * 0.08;
    const pulse = smoothPulse;

    data.forEach((value, i) => {
        ctx.shadowBlur = 10 + Math.pow(pulse, 2) * 60;
        ctx.shadowColor = `rgba(180,140,255,${0.6 + pulse * 0.4})`;
        const barHeight = (value / 255) * canvas.height * 0.5;

        const gradient = ctx.createLinearGradient(
            0,
            centerY - barHeight,
            0,
            centerY
        );

        gradient.addColorStop(0, "rgba(255,180,255,1)");
        gradient.addColorStop(0.5, "rgba(180,140,255,0.9)");
        gradient.addColorStop(1, "rgba(120,90,255,0.8)");

        ctx.fillStyle = gradient;
        ctx.fillRect(
            startX + i * barWidth,
            centerY - barHeight,
            barWidth * 0.75,
            barHeight
        );
    });

    ctx.globalCompositeOperation = "source-over";
}

// Init visualizer when audio starts (important for mobile)
audio.addEventListener("play", () => {
    initVisualizer();
    if (audioCtx?.state === "suspended") audioCtx.resume();
});

window.addEventListener("load", () => {
    const page = document.getElementById("page");
    if (!page) {
        console.error("#page not found");
        return;
    }

    requestAnimationFrame(() => {
        page.classList.add("page-loaded");
    });
});

const mascot = document.getElementById("mascot");

// Save original and alternate image URLs
const originalSrc = "./../assets/web/Mascot1.png";
const alternateSrc = "./../assets/web/mascot2.png";

let clickCount = 0;

const triggerAmount = 10;
const timeFrame = 1000;
const resetMascot = 2000;

let frameTimer = null;
let mascotTimer = null;

mascot.addEventListener("click", () => {
    clickCount++;
    if (frameTimer) clearTimeout(frameTimer);
    frameTimer = setTimeout(function () {
        clickCount = 0;
    }, timeFrame);

    if (clickCount >= triggerAmount) {
        mascot.src = alternateSrc;
        mascot.classList.add("active");

        clickCount = 0;
        clearTimeout(frameTimer);

        if (mascotTimer) clearTimeout(mascotTimer);
        mascotTimer = setTimeout(function () {
            mascot.src = originalSrc;
            mascot.classList.remove("active");
        }, resetMascot);
    }
});
