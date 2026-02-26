"use strict";

/* ══════════════════════════════════════════════════════════════
   DATA — loaded from config.js (SITE_CONFIG global)
══════════════════════════════════════════════════════════════ */
const DATA = { ...SITE_CONFIG };

/* ══════════════════════════════════════
   THEME
══════════════════════════════════════ */
function applyTheme(t) {
	document.documentElement.setAttribute("data-theme", t);
	localStorage.setItem("nc_theme", t);
	document.getElementById("themeIcon").textContent =
		t === "dark" ? "light_mode" : "dark_mode";
}
applyTheme(localStorage.getItem("nc_theme") || "dark");
document.getElementById("themeToggle").onclick = () => {
	const cur  = document.documentElement.getAttribute("data-theme");
	const next = cur === "dark" ? "light" : "dark";
	applyTheme(next);
	showToast(next === "light" ? "☀️ Light mode!" : "🌙 Dark mode!");
};

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function showToast(msg, dur = 2000) {
	const stack = document.getElementById("toastStack");
	const t = document.createElement("div");
	t.className   = "toast";
	t.textContent = msg;
	stack.appendChild(t);
	setTimeout(() => {
		t.classList.add("out");
		t.addEventListener("animationend", () => t.remove(), { once: true });
	}, dur);
}

/* ══════════════════════════════════════
   APPLY DATA TO DOM
══════════════════════════════════════ */
function applyProfile() {
	const p = DATA.profile;
	document.getElementById("displayName").innerHTML   = p.name     || "JustNeychii";
	document.getElementById("usernameDisplay").textContent = p.username || "CHEEZEBORGIR";
	document.getElementById("bioText").innerHTML       = (p.bio || "").replace(/\n/g, "<br/>");
	renderTags();
	renderAboutMe();
}

function applyImages() {
	const im = DATA.images;
	if (im.art) document.getElementById("artImg").src  = im.art;
	if (im.p1)  document.getElementById("p1img").src   = im.p1;
	if (im.p2)  document.getElementById("p2img").src   = im.p2;
	if (im.p3)  document.getElementById("p3img").src   = im.p3;
	if (im.p4)  document.getElementById("p4img").src   = im.p4;
}

function renderTags() {
	const list = document.getElementById("tagsList");
	list.innerHTML = "";
	DATA.tags.forEach(tag => {
		const el       = document.createElement("span");
		el.className   = "tag";
		el.textContent = tag;
		list.appendChild(el);
	});
}

function renderAboutMe() {
	const listEl = document.getElementById("aboutMeList");
	if (!listEl || !Array.isArray(DATA.aboutMe)) return;
	listEl.innerHTML = DATA.aboutMe.map(line => `<li>${line}</li>`).join("");
}

function renderLikeChips() {
	const wrap = document.getElementById("likesChips");
	wrap.innerHTML = "";
	DATA.ld.forEach(item => {
		const el       = document.createElement("div");
		el.className   = `like-chip ${item.type}`;
		el.innerHTML   = `${item.label} <span class="chip-badge">${item.type.toUpperCase()}</span>`;
		wrap.appendChild(el);
	});
}

function applySchedule() {
	const s = DATA.schedule;
	document.getElementById("schedDay").textContent  = s.day  || "Weekends";
	document.getElementById("schedTime").textContent = s.time || "19:00 – 02:00";
	updateTimeline(s.time || "19:00 ~ 02:00");
}

function updateTimeline(timeStr) {
	const m = timeStr.match(/(\d+):(\d+)\s*[~\-–]\s*(\d+):(\d+)/);
	if (!m) return;
	const sh = parseInt(m[1]) + parseInt(m[2]) / 60;
	const eh = parseInt(m[3]) + parseInt(m[4]) / 60;
	const b1 = document.getElementById("tlBlock1");
	const b2 = document.getElementById("tlBlock2");
	if (eh < sh) {
		b1.style.left  = "0%";
		b1.style.width = ((eh / 24) * 100).toFixed(1) + "%";
		b2.style.left  = ((sh / 24) * 100).toFixed(1) + "%";
		b2.style.width = (((24 - sh) / 24) * 100).toFixed(1) + "%";
	} else {
		b1.style.left  = ((sh / 24) * 100).toFixed(1) + "%";
		b1.style.width = (((eh - sh) / 24) * 100).toFixed(1) + "%";
		b2.style.left  = "0%";
		b2.style.width = "0%";
	}
}

function applyChips() {
	const c = DATA.chips;
	const genderOpts = ["👤 Femboy", "👤 Female", "👤 Male", "👤 Non-binary"];
	const ageOpts    = ["🔞 18+", "🔞 13+", "🔞 All Ages"];
	const deviceOpts = ["🖥️ Desktop", "📱 Mobile", "🥽 VR", "🎮 Quest"];
	setChipText("chip-gender", genderOpts[c.gender || 0]);
	setChipText("chip-age",    ageOpts[c.age    || 0]);
	setChipText("chip-device", deviceOpts[c.device || 0]);
	const micChip = document.getElementById("chip-mic");
	if (c.mic === "off") {
		micChip.querySelector("span:first-of-type").textContent = "🔇 ";
		micChip.querySelector("span:last-of-type").textContent  = "Mic OFF";
		micChip.style.borderColor = "rgba(248,113,113,0.4)";
	} else {
		micChip.querySelector("span:first-of-type").textContent = "🎙️ ";
		micChip.querySelector("span:last-of-type").textContent  = "Mic ON";
		micChip.style.borderColor = "";
	}
}
function setChipText(id, full) {
	const chip  = document.getElementById(id);
	const parts = full.split(" ");
	chip.querySelector(".chip-icon").textContent = parts[0];
	chip.querySelector("span:not(.chip-icon):not(.chip-tooltip)").textContent =
		parts.slice(1).join(" ");
}

function applyStatus() {
	document.querySelectorAll("#statusGrid .status-item").forEach(el => {
		el.classList.toggle("active", el.dataset.status === DATA.status);
	});
}

/* ══════════════════════════════════════
   RANK BADGE
══════════════════════════════════════ */
const RANKS = [
	{ label: "Visitor",      cls: "badge-visitor", dot: "#b0b0b0" },
	{ label: "New User",     cls: "badge-newuser", dot: "#4ade80" },
	{ label: "User",         cls: "badge-user",    dot: "#60a5fa" },
	{ label: "Known User",   cls: "badge-known",   dot: "#a78bfa" },
	{ label: "Trusted User", cls: "badge-trusted", dot: "#fb923c" }
];
function applyRank(idx) {
	const r     = RANKS[idx] || RANKS[0];
	const badge = document.getElementById("rankBadge");
	const dot   = badge.querySelector(".badge-dot");
	const text  = document.getElementById("rankBadgeText");
	badge.className      = `badge ${r.cls}`;
	dot.style.background = r.dot;
	dot.style.boxShadow  = `0 0 5px ${r.dot}`;
	text.textContent     = r.label;
}

/* ══════════════════════════════════════
   AUDIO + PLAYER
══════════════════════════════════════ */
const audio   = document.getElementById("bgm");
const toggle  = document.getElementById("musicToggle");
const nextBtn = document.getElementById("nextTrack");
const progBar = document.getElementById("progressBar");
const tTitle  = document.getElementById("trackTitle");
const tArtist = document.getElementById("trackArtist");

let playlist     = DATA.playlist;
let currentIndex = 0;
let audioCtx, analyser, aSource, gainNode;
let audioInited = false;

function resetMarquee() {
	const titleEl = document.getElementById("trackTitle");
	titleEl.querySelector(".title-dup")?.remove();
	titleEl.classList.remove("is-scrolling");
	titleEl.style.removeProperty("--moff");
	titleEl.style.removeProperty("--mdur");
	const ts = titleEl.querySelector(".title-text");
	if (ts) ts.style.animation = "";
}
function setupMarquee(text) {
	if (window.innerWidth > 600) return;
	const titleEl = document.getElementById("trackTitle");
	const span    = titleEl.querySelector(".title-text");
	if (!span) return;
	requestAnimationFrame(() => {
		if (span.scrollWidth <= titleEl.clientWidth) return;
		const dup       = document.createElement("span");
		dup.className   = "title-dup";
		dup.textContent = text;
		titleEl.appendChild(dup);
		const gap   = parseFloat(getComputedStyle(dup).paddingLeft) || 40;
		const shift = span.offsetWidth + gap;
		const dur   = Math.max(8, shift / 28);
		titleEl.style.setProperty("--moff", `-${shift}px`);
		titleEl.style.setProperty("--mdur", `${dur}s`);
		titleEl.classList.add("is-scrolling");
	});
}

function setTrackInfo(tr) {
	const titleEl = document.getElementById("trackTitle");
	const span    = titleEl.querySelector(".title-text");
	if (span) span.textContent = tr.title;
	tArtist.textContent = tr.artist || "";
	titleEl.onclick = () => tr.link && window.open(tr.link, "_blank");
}
function playTrackByIndex(idx) {
	currentIndex = ((idx % playlist.length) + playlist.length) % playlist.length;
	const tr = playlist[currentIndex];

	tTitle.style.opacity    = "0";
	tTitle.style.transform  = "translateY(5px)";
	tArtist.style.opacity   = "0";
	tArtist.style.transform = "translateY(5px)";

	setTimeout(() => {
		resetMarquee();
		setTrackInfo(tr);
		audio.src = tr.src;
		audio.load();
		audio.play().catch(() => {});

		tTitle.style.transition  = "none";
		tArtist.style.transition = "none";
		tTitle.style.transform   = "translateY(-5px)";
		tArtist.style.transform  = "translateY(-5px)";

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				tTitle.style.transition  = "";
				tArtist.style.transition = "";
				tTitle.style.opacity     = "1";
				tTitle.style.transform   = "translateY(0)";
				tArtist.style.opacity    = "1";
				tArtist.style.transform  = "translateY(0)";
				setTimeout(() => setupMarquee(tr.title), 320);
			});
		});
	}, 260);
}
function fadeGain(to, dur, cb) {
	if (!audioCtx) { cb?.(); return; }
	const now = audioCtx.currentTime;
	gainNode.gain.cancelScheduledValues(now);
	gainNode.gain.setValueAtTime(gainNode.gain.value, now);
	gainNode.gain.linearRampToValueAtTime(to, now + dur);
	if (cb) setTimeout(cb, dur * 1000);
}
function initVis() {
	if (audioInited) return;
	audioInited = true;
	audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
	analyser  = audioCtx.createAnalyser();
	analyser.fftSize = 128;
	gainNode  = audioCtx.createGain();
	gainNode.gain.value = 0;
	aSource   = audioCtx.createMediaElementSource(audio);
	aSource.connect(gainNode);
	gainNode.connect(analyser);
	analyser.connect(audioCtx.destination);
	freqData  = new Uint8Array(analyser.frequencyBinCount);
	drawViz();
}

audio.addEventListener("ended", () => playTrackByIndex(currentIndex + 1));
audio.addEventListener("play",  () => {
	nextBtn.classList.add("unlocked");
	toggle.textContent = "pause";
	document.body.classList.add("music-playing");
	initVis();
	if (audioCtx?.state === "suspended") audioCtx.resume();
	fadeGain(0.3, 0.6);
});
audio.addEventListener("pause", () => {
	progBar.style.width = "0";
	toggle.textContent  = "play_arrow";
	document.body.classList.remove("music-playing");
});
audio.addEventListener("timeupdate", () => {
	if (audio.duration)
		progBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
});
toggle.onclick = () => {
	if (audioCtx?.state === "suspended") audioCtx.resume();
	if (audio.paused) {
		audio.play().catch(() => {});
		document.body.classList.remove("needs-interaction");
	} else {
		fadeGain(0, 0.35, () => audio.pause());
	}
};
nextBtn.onclick = () => {
	if (audioCtx?.state === "suspended") audioCtx.resume();
	fadeGain(0, 0.35, () => playTrackByIndex(currentIndex + 1));
};
document.getElementById("progressWrap").onclick = e => {
	const r = e.currentTarget.getBoundingClientRect();
	if (audio.duration)
		audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
};

const tryUnlockAudio = () => {
	document.body.classList.remove("needs-interaction");
	audio.play().catch(() => {});
};
["click", "touchstart"].forEach(ev =>
	document.addEventListener(ev, tryUnlockAudio, { once: true, passive: true })
);

/* ══════════════════════════════════════
   VISUALIZER
══════════════════════════════════════ */
const canvas = document.getElementById("visualizer");
const vCtx   = canvas.getContext("2d");
let freqData, smoothPulse = 0;

function resizeCanvas() {
	canvas.width  = canvas.offsetWidth  * devicePixelRatio;
	canvas.height = canvas.offsetHeight * devicePixelRatio;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function drawViz() {
	requestAnimationFrame(drawViz);
	if (!analyser) return;
	analyser.getByteFrequencyData(freqData);
	vCtx.clearRect(0, 0, canvas.width, canvas.height);
	vCtx.globalCompositeOperation = "lighter";
	const W = canvas.width, H = canvas.height, L = freqData.length;
	const bw  = W / L;
	const avg = freqData.reduce((s, v) => s + v, 0) / L;
	smoothPulse += (avg / 255 - smoothPulse) * 0.08;
	vCtx.shadowBlur  = 8 + smoothPulse * 40;
	vCtx.shadowColor = `rgba(168,85,247,${0.6 + smoothPulse * 0.4})`;
	for (let i = 0; i < L; i++) {
		const h = (freqData[i] / 255) * H * 0.9;
		const g = vCtx.createLinearGradient(0, H - h, 0, H);
		g.addColorStop(0, "rgba(220,160,255,0.9)");
		g.addColorStop(1, "rgba(100,60,200,0.5)");
		vCtx.fillStyle = g;
		vCtx.fillRect(i * bw, H - h, bw * 0.75, h);
	}
	vCtx.globalCompositeOperation = "source-over";
}

/* ══════════════════════════════════════
   GALLERY
══════════════════════════════════════ */
const galleryConfig = {
	basePath: "/Assets/Images",
	sets: {
		default: { thumb: "t_slide",     full: "slide",     count: DATA.gallery.sfw  },
		nsfw:    { thumb: "t_NsfwSlide", full: "NsfwSlide", count: DATA.gallery.nsfw }
	}
};

const track = document.getElementById("galleryTrack");
let currentSet = "default";
let slides = [], slideIndex = 1, isAnimating = false, autoTimer;
const TRANS_MS  = 600;
const fullCache = new Map();

function buildGalleryImages(set) {
	const cfg = galleryConfig.sets[set];
	return Array.from({ length: cfg.count }, (_, i) => ({
		thumb: `${galleryConfig.basePath}/${cfg.thumb}${i + 1}.png`,
		full:  `${galleryConfig.basePath}/${cfg.full}${i + 1}.png`
	}));
}

function renderGallery(set) {
	track.classList.add("no-transition");
	track.innerHTML = "";
	const imgs = buildGalleryImages(set);
	if (!imgs.length) {
		track.innerHTML = '<div style="padding:30px;color:var(--muted2);text-align:center;flex:1">No images in this set</div>';
		track.classList.remove("no-transition");
		slides = [];
		return;
	}
	imgs.forEach(src => {
		const item  = document.createElement("div");
		item.className = "gallery-item";
		const frame = document.createElement("div");
		frame.className = "image-frame";
		const loader = document.createElement("div");
		loader.className = "img-loader";
		const img   = document.createElement("img");
		img.className    = "gallery-img";
		img.src          = src.thumb;
		img.dataset.full = src.full;
		img.alt          = "";
		img.onload  = () => { img.classList.add("loaded"); frame.classList.add("img-loaded"); };
		img.onerror = () => { frame.classList.add("img-loaded"); img.style.opacity = "0"; };
		img.onclick = () => openFullscreen(img.dataset.full);
		frame.append(loader, img);
		item.append(frame);
		track.append(item);
	});
	slides = Array.from(track.children);
	if (slides.length > 0) {
		const fc = slides[0].cloneNode(true);
		const lc = slides[slides.length - 1].cloneNode(true);
		fc.classList.add("clone");
		lc.classList.add("clone");
		[fc, lc].forEach(c => {
			const ci = c.querySelector("img");
			if (ci) ci.onclick = () => openFullscreen(ci.dataset.full);
			c.querySelector(".image-frame")?.classList.add("img-loaded");
			ci?.classList.add("loaded");
		});
		track.append(fc);
		track.insertBefore(lc, slides[0]);
	}
	slideIndex = 1;
	updateSlide(false);
	requestAnimationFrame(() => track.classList.remove("no-transition"));
	startAuto();
}

function slideWidth() {
	if (!slides[0]) return 0;
	return slides[0].getBoundingClientRect().width + 14;
}
function centerOff() {
	if (!slides[0]) return 0;
	const vp = track.parentElement;
	const sw = slides[0].getBoundingClientRect().width;
	return Math.min((vp.clientWidth - sw) / 2, 60);
}
function updateSlide(animate = true) {
	const w = slideWidth();
	if (!w) return;
	if (animate) {
		isAnimating = true;
		setTimeout(() => (isAnimating = false), TRANS_MS + 50);
	}
	track.style.transition = animate
		? `transform ${TRANS_MS / 1000}s cubic-bezier(0.22,1,0.36,1)`
		: "none";
	track.style.transform = `translateX(-${slideIndex * w - centerOff()}px)`;
}
track.addEventListener("transitionend", () => {
	const tot = slides.length;
	if (slideIndex === 0)       slideIndex = tot;
	if (slideIndex === tot + 1) slideIndex = 1;
	updateSlide(false);
	isAnimating = false;
});
function nextSlide() { if (!isAnimating) { slideIndex++; updateSlide(); } }
function prevSlide() { if (!isAnimating) { slideIndex--; updateSlide(); } }
function startAuto() { clearInterval(autoTimer); autoTimer = setInterval(nextSlide, 9000); }
function stopAuto()  { clearInterval(autoTimer); }

document.getElementById("nextSlide").onclick = () => { stopAuto(); nextSlide(); startAuto(); };
document.getElementById("prevSlide").onclick = () => { stopAuto(); prevSlide(); startAuto(); };
window.addEventListener("resize", () => updateSlide(false));

let tStartX = 0;
document.querySelector(".gallery-viewport").addEventListener("touchstart", e => {
	tStartX = e.touches[0].clientX;
}, { passive: true });
document.querySelector(".gallery-viewport").addEventListener("touchend", e => {
	const dx = e.changedTouches[0].clientX - tStartX;
	if (Math.abs(dx) > 40) { stopAuto(); dx < 0 ? nextSlide() : prevSlide(); startAuto(); }
});

function openFullscreen(src) {
	if (!src) return;
	const img  = document.getElementById("galleryFullImg");
	const wrap = document.getElementById("galleryFullWrap");
	img.classList.remove("loaded");
	img.src = "";
	wrap.classList.remove("img-loaded");
	openOverlay("galleryFull");
	const show = () => { img.src = src; img.classList.add("loaded"); wrap.classList.add("img-loaded"); };
	let cached = fullCache.get(src);
	if (!cached) { cached = new Image(); cached.src = src; fullCache.set(src, cached); }
	if (cached.complete && cached.naturalWidth > 0) show();
	else { cached.onload = show; cached.onerror = () => wrap.classList.add("img-loaded"); }
}
function closeFullscreen() { closeOverlay("galleryFull"); }

document.getElementById("galleryBadge").addEventListener("click", () => {
	currentSet = currentSet === "default" ? "nsfw" : "default";
	const badge = document.getElementById("galleryBadge");
	if (currentSet === "nsfw") {
		badge.textContent = "Lewdie~";
		badge.classList.add("nsfw");
		showToast("🔞 NSFW Gallery (18+ only)");
	} else {
		badge.textContent = "New!";
		badge.classList.remove("nsfw");
		showToast("🖼 SFW Gallery");
	}
	renderGallery(currentSet);
});

/* Polaroid click → fullscreen */
document.querySelectorAll(".polaroid").forEach((p, i) => {
	p.addEventListener("click", e => {
		e.stopPropagation();
		const imgEl = document.getElementById(`p${i + 1}img`);
		openFullscreen(imgEl.src);
	});
});

/* ══════════════════════════════════════
   OVERLAYS
══════════════════════════════════════ */
function openOverlay(id) {
	const el = document.getElementById(id);
	el.style.display = "flex";
	requestAnimationFrame(() => el.classList.add("show"));
	document.body.classList.add("modal-open");
}
function closeOverlay(id) {
	const el   = document.getElementById(id);
	const card = el.querySelector(".modal-card,.gallery-full-img-wrap");
	if (card) {
		card.classList.add("closing");
		setTimeout(() => card.classList.remove("closing"), 280);
	}
	el.classList.remove("show");
	setTimeout(() => { el.style.display = "none"; document.body.classList.remove("modal-open"); }, 250);
}

document.getElementById("openSocials").onclick = () => openOverlay("socialOverlay");
document.querySelectorAll(".overlay-bg").forEach(bg => {
	bg.addEventListener("click", () => {
		const ov = bg.closest(".overlay");
		if (ov) closeOverlay(ov.id);
	});
});

let pendingLink = "";
function openMatureWarning(url) { pendingLink = url; openOverlay("matureOverlay"); }
document.getElementById("matureContinue").onclick = () => {
	if (pendingLink) window.open(pendingLink, "_blank");
	closeOverlay("matureOverlay");
};
document.getElementById("matureCancel").onclick = () => closeOverlay("matureOverlay");
document.addEventListener("keydown", e => {
	if (e.key === "Escape")
		["socialOverlay", "matureOverlay", "galleryFull"].forEach(id => {
			const el = document.getElementById(id);
			if (el?.classList.contains("show")) closeOverlay(id);
		});
});

/* ══════════════════════════════════════
   ROTATING STATUS
══════════════════════════════════════ */
let statuses  = DATA.statuses;
let curStatus = "";
const statusEl = document.getElementById("statuses");
function swapStatus() {
	statusEl.classList.add("swapOut");
	setTimeout(() => {
		const pool = statuses.filter(s => s !== curStatus);
		curStatus  = pool.length ? pool[Math.floor(Math.random() * pool.length)] : statuses[0];
		statusEl.textContent = `💭 ${curStatus}`;
		statusEl.classList.remove("swapOut");
	}, 400);
}
setInterval(swapStatus, 10000);

/* ══════════════════════════════════════
   MASCOT  easter eggs
══════════════════════════════════════ */
const mascot      = document.getElementById("mascot");
const mascotQuips = ["meow~", "nya!", "pls stop clicking me TwT", "🐾", "uwu~", "*purring*", "you found me!"];
let mascotClickN  = 0, mascotTimer;
mascot.addEventListener("click", () => {
	mascotClickN++;
	clearTimeout(mascotTimer);
	mascotTimer = setTimeout(() => (mascotClickN = 0), 1000);
	mascot.classList.add("jiggle");
	mascot.addEventListener("animationend", () => mascot.classList.remove("jiggle"), { once: true });
	showToast(mascotQuips[mascotClickN % mascotQuips.length], 1400);
	if (mascotClickN >= 10) {
		mascotClickN  = 0;
		mascot.src    = "./Assets/Images/mascot2.png";
		showToast("💢 Fuck You!", 3000);
		setTimeout(() => (mascot.src = "./Assets/Images/mascot1.png"), 4000);
	}
});

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let konamiIdx = 0;
document.addEventListener("keydown", e => {
	if (e.key === KONAMI[konamiIdx]) konamiIdx++; else konamiIdx = 0;
	if (konamiIdx === KONAMI.length) { konamiIdx = 0; rainCats(); }
});
function rainCats() {
	showToast("🎉 Konami Code! Nyaa~!", 2500);
	const emojis = ["🐱", "😺", "🐾", "💜", "✨", "🌸"];
	for (let i = 0; i < 28; i++) {
		setTimeout(() => {
			const el       = document.createElement("div");
			el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
			el.style.cssText = `position:fixed;font-size:${18+Math.random()*20}px;left:${Math.random()*100}vw;top:-40px;z-index:9999;pointer-events:none;animation:catFall ${1.5+Math.random()*2.5}s linear forwards;`;
			document.body.appendChild(el);
			el.addEventListener("animationend", () => el.remove());
		}, i * 90);
	}
}
const _ks = document.createElement("style");
_ks.textContent = "@keyframes catFall{from{transform:translateY(0) rotate(0deg);opacity:1}to{transform:translateY(105vh) rotate(720deg);opacity:0}}";
document.head.appendChild(_ks);

/* ══════════════════════════════════════
   PAGE INIT
══════════════════════════════════════ */
const loaderEl   = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");
const pageEl     = document.getElementById("page");
let dotCount = 0;
const dotTimer = setInterval(() => {
	loaderText.textContent = "Loading" + ".".repeat(++dotCount % 4);
}, 500);

function initPage() {
	// Sync live variables
	statuses = DATA.statuses;
	playlist = DATA.playlist;
	galleryConfig.sets.default.count = DATA.gallery.sfw;
	galleryConfig.sets.nsfw.count    = DATA.gallery.nsfw;

	// Apply to DOM
	applyProfile();
	applyImages();
	applyChips();
	applySchedule();
	applyStatus();
	applyRank(DATA.rank ?? 4);
	renderLikeChips();

	// Start rotating status
	curStatus = statuses[Math.floor(Math.random() * statuses.length)];
	statusEl.textContent = `💭 ${curStatus}`;

	// Init music player
	setTrackInfo(playlist[0]);
	setTimeout(() => setupMarquee(playlist[0].title), 600);
	audio.src = playlist[0].src;
	audio.play()
		.then(() => (toggle.textContent = "pause"))
		.catch(() => {
			toggle.textContent = "play_arrow";
			document.body.classList.add("needs-interaction");
		});

	// Gallery
	renderGallery("default");
}

window.addEventListener("load", () => {
	initPage();
	clearInterval(dotTimer);
	setTimeout(() => {
		loaderEl.classList.add("hide");
		setTimeout(() => (loaderEl.style.display = "none"), 500);
		pageEl.classList.add("loaded");
		mascot.classList.add("loaded");
	}, 200);
});
