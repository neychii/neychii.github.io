/*****************************
 *        AUDIO CONTROLS      *
 *****************************/

// Elements
const audio = document.getElementById("bgm");
const toggle = document.getElementById("musicToggle");
const nextBtn = document.getElementById("nextTrack");
const progressBar = document.querySelector(".progress-bar");
const marquee = document.querySelector(".marquee-track");
const marqueeTitle = document.querySelector(".marquee-title");
const marqueeArtist = document.querySelector(".marquee-artist");

// Playlist
const playlist = [
	{
		title: "Despite Everything, It Is Still Me",
		artist: "LuvBytes404",
		src: "./Assets/Audios/audio.mp3",
		link: "https://soundcloud.com/luvbytes404/despite-everything-it-is-still-me?si=0632d52355124315b787f9158c777200&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
	},
	{
		title: "Kill me with a lie",
		artist: "angelize",
		src: "./Assets/Audios/audio4.mp3",
		link: "https://open.spotify.com/track/6H2egbHEnfpGQgWGTA4icy?si=mSilVM6CQfOInmWcZAmYKQ"
	},
	{
		title: "Limerence",
		artist: "angelize",
		src: "./Assets/Audios/audio3.mp3",
		link: "https://open.spotify.com/track/5TEOhfxU5KP5lZApP1psga?si=bULcr0lkTm-9Tamzi_ZJxg"
	},
	{
		title: "Seasons",
		artist: "Alohaii",
		src: "./Assets/Audios/audio2.mp3",
		link: "https://soundcloud.com/lonealphamusic/seasons?si=75ebcd669fc847b3961be97a95d31b59&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
	},
	{
		title: "Hobbies",
		artist: "Aleyna Moon",
		src: "./Assets/Audios/audio5.mp3",
		link: "https://open.spotify.com/track/7evB1jJ0cK4ZYUeVGUDhQf?si=0c2afe6a127b4927"
	}
];

let isIntro = true;
let currentIndex = 0;
let audioUnlocked = false;
let audioCtx,
	analyser,
	source,
	gainNode,
	initialized = false;

/* --- AUTOPLAY --- */
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

tryAutoplay();

/* --- TRACK PLAYBACK --- */
function playTrackByIndex(index) {
	currentIndex = index;
	const track = playlist[currentIndex];

	setTimeout(() => {
		marqueeTitle.textContent = track.title;
		marqueeArtist.textContent = track.artist;

		audio.src = track.src;
		audio.load();
		audio.play().catch(() => {});

		marquee.onclick = () => window.open(track.link);
	}, 350);
}

function playNextTrack() {
	marqueeTitle.classList.add("fade-out");
	marqueeArtist.classList.add("fade-out");

	const nextIndex = (currentIndex + 1) % playlist.length;
	playTrackByIndex(nextIndex);

	setTimeout(() => {
		marqueeTitle.classList.remove("fade-out");
		marqueeArtist.classList.remove("fade-out");
	}, 350);
}

/* --- AUDIO EVENTS --- */
audio.addEventListener("ended", playNextTrack);

audio.addEventListener("play", () => {
	nextBtn.classList.add("unlocked");
	toggle.textContent = "pause";
	document.body.classList.add("music-playing");

	initVisualizer();
	if (audioCtx.state === "suspended") audioCtx.resume();

	const now = audioCtx.currentTime;
	gainNode.gain.cancelScheduledValues(now);
	gainNode.gain.setValueAtTime(0, now);
	gainNode.gain.linearRampToValueAtTime(0.3, now + 0.6);
});

audio.addEventListener("pause", () => {
	progressBar.style.width = 0;
	document.body.classList.remove("music-playing");
});

/* --- TOGGLE BUTTON --- */
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

/* --- NEXT BUTTON --- */
nextBtn.onclick = () => {
	const now = audioCtx.currentTime;
	gainNode.gain.cancelScheduledValues(now);
	gainNode.gain.setValueAtTime(gainNode.gain.value, now);
	gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
	setTimeout(playNextTrack, 400);
};

/* --- AUDIO UNLOCK --- */
const unlockAudio = () => {
	if (audio.paused) playTrackByIndex(currentIndex);
	document.body.classList.remove("needs-interaction");
	document.removeEventListener("click", unlockAudio);
	document.removeEventListener("touchstart", unlockAudio);
};

document.addEventListener("click", unlockAudio);
document.addEventListener("touchstart", unlockAudio);

/* --- PROGRESS BAR --- */
audio.addEventListener("timeupdate", () => {
	if (!audio.duration) return;
	const percent = (audio.currentTime / audio.duration) * 100;
	progressBar.style.width = `${percent}%`;
});

/*****************************
 *       VISUALIZER          *
 *****************************/

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
let smoothPulse = 0;

function resizeCanvas() {
	canvas.width = canvas.offsetWidth * devicePixelRatio;
	canvas.height = canvas.offsetHeight * devicePixelRatio;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function initVisualizer() {
	if (initialized) return;
	initialized = true;

	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	analyser = audioCtx.createAnalyser();
	analyser.fftSize = 128;

	gainNode = audioCtx.createGain();
	gainNode.gain.value = 0;

	source = audioCtx.createMediaElementSource(audio);

	source.connect(gainNode);
	gainNode.connect(analyser);
	analyser.connect(audioCtx.destination);

	draw();
}

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

/*****************************
 *         SOCIAL MODAL       *
 *****************************/

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

/*****************************
 *         EASTER EGGS       *
 *****************************/

const mascot = document.getElementById("mascot");
const originalSrc = "./Assets/Images/mascot1.png";
const alternateSrc = "./Assets/Images/mascot2.png";

let clickCount = 0;
const triggerAmount = 10;
const timeFrame = 1000;
const resetMascot = 2000;
let frameTimer = null;
let mascotTimer = null;

mascot.addEventListener("click", () => {
	clickCount++;
	clearTimeout(frameTimer);
	frameTimer = setTimeout(() => (clickCount = 0), timeFrame);

	if (clickCount >= triggerAmount) {
		mascot.src = alternateSrc;
		mascot.classList.add("active");
		clickCount = 0;
		clearTimeout(frameTimer);

		clearTimeout(mascotTimer);
		mascotTimer = setTimeout(() => {
			mascot.src = originalSrc;
			mascot.classList.remove("active");
		}, resetMascot);
	}
});

const pfp = document.querySelector(".pfp");
const pfpImg = pfp.querySelector("img");

const defaultPfp = "./Assets/Images/avatar.jpg";
const altPfp = "./Assets/Images/avatar_alt.jpg";

let holdTimer = null;
let swapped = false;
let holding = false;

function startHold() {
	if (holding) return;
	holding = true;

	pfp.classList.add("is-holding");

	holdTimer = setTimeout(() => {
		pfpImg.src = swapped ? defaultPfp : altPfp;
		swapped = !swapped;

		pfp.classList.remove("is-holding");
		holding = false;
	}, 10000); // 10s
}

function cancelHold() {
	clearTimeout(holdTimer);
	pfp.classList.remove("is-holding");
	holding = false;
}

/* Desktop */
pfp.addEventListener("mouseenter", startHold);
pfp.addEventListener("mouseleave", cancelHold);

/* Mobile */
pfp.addEventListener("touchstart", startHold, { passive: true });
pfp.addEventListener("touchend", cancelHold);
pfp.addEventListener("touchcancel", cancelHold);

/*****************************
 *        MATURE WARNING      *
 *****************************/

const matureOverlay = document.getElementById("matureOverlay");
const matureCancel = document.getElementById("matureCancel");
const matureContinue = document.getElementById("matureContinue");
let pendingLink = null;

function openMatureWarning(link) {
	pendingLink = link;
	matureOverlay.style.display = "flex";
	document.body.classList.add("modal-open");
	requestAnimationFrame(() => matureOverlay.classList.add("show"));
}

function closeMatureWarning() {
	const modal = matureOverlay.querySelector(".mature-modal");
	modal.classList.add("closing");
	matureOverlay.classList.remove("show");
	document.body.classList.remove("modal-open");
	modal.addEventListener(
		"animationend",
		() => {
			modal.classList.remove("closing");
			matureOverlay.style.display = "none";
		},
		{ once: true }
	);
}

matureCancel.onclick = closeMatureWarning;
matureContinue.onclick = () => {
	if (pendingLink) window.open(pendingLink, "_blank");
	closeMatureWarning();
};

/*****************************
 *         STATUS LINE        *
 *****************************/

const statuses = [
	"It is what it is",
	"Finishing Shinaney Avatar",
	"Initiating Aze-chii Avatar",
	"Listening to Dance, Dance by fall ouy boy"
];
const statusEl = document.getElementById("statuses");
let currentStatus = null;

function getRandomStatus() {
	const pool = statuses.filter(s => s !== currentStatus);
	return pool[Math.floor(Math.random() * pool.length)];
}

function swapStatus() {
	statusEl.classList.add("swapOut");
	setTimeout(() => {
		currentStatus = getRandomStatus();
		statusEl.textContent = `💭: ${currentStatus}`;
		statusEl.classList.remove("swapOut");
	}, 450);
}

currentStatus = getRandomStatus();
statusEl.textContent = `💭: ${currentStatus}`;
setInterval(swapStatus, 10000);

/*****************************
 *         PAGE LOAD          *
 *****************************/

window.addEventListener("load", () => {
	const page = document.getElementById("page");
	if (!page) return console.error("#page not found");
	update(false);
	requestAnimationFrame(() => page.classList.add("page-loaded"));
});

/*****************************
 *          GALLERY           *
 *****************************/

// Gallery Elements
const images = {
	default: [
		{
			thumbnail: "/Assets/Images/t_slide1.png",
			full: "/Assets/Images/slide1.png"
		},
		{
			thumbnail: "/Assets/Images/t_slide2.png",
			full: "/Assets/Images/slide2.png"
		},
		{
			thumbnail: "/Assets/Images/t_slide3.png",
			full: "/Assets/Images/slide3.png"
		},
		{
			thumbnail: "/Assets/Images/t_slide4.png",
			full: "/Assets/Images/slide4.png"
		},
		{
			thumbnail: "/Assets/Images/t_slide5.png",
			full: "/Assets/Images/slide5.png"
		},
		{
			thumbnail: "/Assets/Images/t_slide6.png",
			full: "/Assets/Images/slide6.png"
		},
		{
			thumbnail: "/Assets/Images/t_slide7.png",
			full: "/Assets/Images/slide7.png"
		},
		{
			thumbnail: "/Assets/Images/t_slide8.png",
			full: "/Assets/Images/slide8.png"
		},
		{
			thumbnail: "/Assets/Images/t_slide9.png",
			full: "/Assets/Images/slide9.png"
		},
		{
			thumbnail: "/Assets/Images/t_slide10.png",
			full: "/Assets/Images/slide10.png"
		},
		{
			thumbnail: "/Assets/Images/t_slide11.png",
			full: "/Assets/Images/slide11.png"
		},
		{
			thumbnail: "/Assets/Images/t_slide12.png",
			full: "/Assets/Images/slide12.png"
		},
		{
			thumbnail: "/Assets/Images/t_slide13.png",
			full: "/Assets/Images/slide13.png"
		},
		{
			thumbnail: "/Assets/Images/t_slide14.png",
			full: "/Assets/Images/slide14.png"
		}
	],
	nsfw: [
		{
			thumbnail: "/Assets/Images/t_NsfwSlide1.png",
			full: "/Assets/Images/NsfwSlide1.png"
		},
		{
			thumbnail: "/Assets/Images/t_NsfwSlide2.png",
			full: "/Assets/Images/NsfwSlide2.png"
		},
		{
			thumbnail: "/Assets/Images/t_NsfwSlide3.png",
			full: "/Assets/Images/NsfwSlide3.png"
		},
		{
			thumbnail: "/Assets/Images/t_NsfwSlide4.png",
			full: "/Assets/Images/NsfwSlide4.png"
		},
		{
			thumbnail: "/Assets/Images/t_NsfwSlide5.png",
			full: "/Assets/Images/NsfwSlide5.png"
		},
		{
			thumbnail: "/Assets/Images/t_NsfwSlide6.png",
			full: "/Assets/Images/NsfwSlide6.png"
		},
		{
			thumbnail: "/Assets/Images/t_NsfwSlide7.png",
			full: "/Assets/Images/NsfwSlide7.png"
		},
		{
			thumbnail: "/Assets/Images/t_NsfwSlide8.png",
			full: "/Assets/Images/NsfwSlide8.png"
		},
		{
			thumbnail: "/Assets/Images/t_NsfwSlide9.png",
			full: "/Assets/Images/NsfwSlide9.png"
		},
		{
			thumbnail: "/Assets/Images/t_NsfwSlide10.png",
			full: "/Assets/Images/NsfwSlide10.png"
		}
	]
};

const viewport = document.querySelector(".gallery-viewport");
const track = document.querySelector(".gallery-track");
const nextSlide = document.querySelector(".next");
const prevSlide = document.querySelector(".prev");

// Gallery state
let currentSet = "default";
let slides;
let index = 1;
let isAnimating = false;
let autoTimer;
const INTERVAL = 10000;
const TRANSITION_MS = 600;
let unlockTimer = null;

const fullImageCache = new Map();

function renderGallery(setName) {
	track.classList.add("no-transition");

	const slidesData = images[setName];

	track.innerHTML = "";

	slidesData.forEach(src => {
		const item = document.createElement("div");
		item.className = "gallery-item";

		const frame = document.createElement("div");
		frame.className = "image-frame";

		const img = document.createElement("img");

		img.src = src.thumbnail;
		img.dataset.full = src.full;
		img.classList.remove("loaded");

		// Preload full image
		if (!fullImageCache.has(src.full)) {
			const fullImg = new Image();
			fullImg.src = src.full;
			fullImageCache.set(src.full, fullImg);
		}

		const fullImg = fullImageCache.get(src.full);

		const applyFull = () => {
			img.src = src.full;
			img.classList.add("loaded");
		};

		if (fullImg.complete) {
			applyFull();
		} else {
			fullImg.addEventListener("load", applyFull, { once: true });
		}

		img.alt = "";
		img.classList.add("gallery-img");
		frame.appendChild(img);
		item.appendChild(frame);
		track.appendChild(item);
	});

	// Recalculate slides
	slides = Array.from(track.children);

	// Setup clones for infinite loop
	const firstClone = slides[0].cloneNode(true);
	const lastClone = slides[slides.length - 1].cloneNode(true);
	firstClone.classList.add("clone");
	lastClone.classList.add("clone");
	track.appendChild(firstClone);
	track.insertBefore(lastClone, slides[0]);
	firstClone.querySelector("img")?.classList.add("loaded");
	lastClone.querySelector("img")?.classList.add("loaded");

	// Reset gallery index
	index = 1;
	update(false);

	requestAnimationFrame(() => {
		track.classList.remove("no-transition");
	});

	// Re-attach fullscreen modal events
	attachModalEvents();
}

function attachModalEvents() {
	document.querySelectorAll(".gallery-img").forEach(img => {
		if (img.closest(".clone")) return;

		img.onclick = () => {
			galleryModalImg.src = img.dataset.full;
			galleryModalOverlay.classList.add("show");
		};
	});
}

const galleryTitle = document.getElementById("gallery-text");

galleryTitle.addEventListener("click", () => {
	currentSet = currentSet === "default" ? "nsfw" : "default";
	galleryTitle.textContent =
		currentSet !== "default" ? "Gallery⁽ⁿˢᶠʷ⁾" : "Gallery";
	renderGallery(currentSet);
});

renderGallery(currentSet);

// Helpers
function slideWidth() {
	return slides[0].getBoundingClientRect().width + 24;
}
function centerOffset() {
	const slide = slides[0].getBoundingClientRect().width;
	const raw = (viewport.clientWidth - slide) / 2;
	return Math.min(raw, 80);
}

// Update track
function update(animate = true) {
	if (animate) lock();
	track.style.transition = animate
		? "transform 0.6s ease, opacity 0.2s ease"
		: "none";
	track.style.transform = `translateX(-${index * slideWidth() - centerOffset()}px)`;
}

function lock() {
	isAnimating = true;
	clearTimeout(unlockTimer);
	unlockTimer = setTimeout(() => (isAnimating = false), TRANSITION_MS + 50);
}

// Infinite loop handling
track.addEventListener("transitionend", () => {
	const total = slides.length;
	if (index === 0) index = total;
	if (index === total + 1) index = 1;
	update(false);
	isAnimating = false;
});

// Slide navigation
function next() {
	if (!isAnimating) {
		index++;
		update();
	}
}
function prev() {
	if (!isAnimating) {
		index--;
		update();
	}
}

// Auto scroll
function startAuto() {
	stopAuto();
	autoTimer = setInterval(next, INTERVAL);
}
function stopAuto() {
	clearInterval(autoTimer);
}

// Buttons
nextSlide.onclick = () => {
	stopAuto();
	next();
	startAuto();
};
prevSlide.onclick = () => {
	stopAuto();
	prev();
	startAuto();
};

// Resize
window.addEventListener("resize", update);

// Initialize
update();
startAuto();

/*****************************
 *         Fullscreen        *
 *****************************/

// Get modal elements
const galleryModalOverlay = document.getElementById("galleryModalOverlay");
const galleryModalImg = document.getElementById("galleryModalImg");
const galleryModalClose = document.querySelector(".gallery-modal-close");

// Close modal when clicking close button or overlay
galleryModalClose.addEventListener("click", () => {
	galleryModalOverlay.classList.remove("show");
});

galleryModalOverlay.addEventListener("click", e => {
	if (e.target === galleryModalOverlay) {
		galleryModalOverlay.classList.remove("show");
		galleryModalImg.src = "";
	}
});
