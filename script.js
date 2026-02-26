"use strict";

/* ══════════════════════════════════════
   DATA & DEFAULTS
══════════════════════════════════════ */
const DEFAULT_PW = "neychii";

const DEFAULT_PLAYLIST = [
	{
		title: "Despite Everything, It Is Still Me",
		artist: "LuvBytes404",
		src: "./Assets/Audios/audio.mp3",
		link: "https://soundcloud.com/luvbytes404/despite-everything-it-is-still-me"
	},
	{
		title: "Limerence",
		artist: "angelize, ft. Lilycat",
		src: "./Assets/Audios/audio3.mp3",
		link: "https://open.spotify.com/track/5TEOhfxU5KP5lZApP1psga"
	},
	{
		title: "Kill me with a lie",
		artist: "angelize",
		src: "./Assets/Audios/audio4.mp3",
		link: "https://open.spotify.com/track/6H2egbHEnfpGQgWGTA4icy"
	},
	{
		title: "under the sky",
		artist: "coco., ft. Lil Chili",
		src: "./Assets/Audios/audio6.mp3",
		link: "https://open.spotify.com/track/1SY9IArHB4QtiX37o4mOg7"
	},
	{
		title: "Seasons",
		artist: "Alohaii, ft. Shiki Myokino",
		src: "./Assets/Audios/audio2.mp3",
		link: "https://soundcloud.com/lonealphamusic/seasons"
	},
	{
		title: "Tell Me",
		artist: "coco., ft. Lil Chili",
		src: "./Assets/Audios/audio7.mp3",
		link: "https://open.spotify.com/track/14ar0JOH3XfT9AJWRlganR"
	},
	{
		title: "3edw",
		artist: "angelize",
		src: "./Assets/Audios/audio8.mp3",
		link: "https://open.spotify.com/track/2QPSTJZuLHo3dQSjOVioUf"
	},
	{
		title: "Looking For Me",
		artist: "Itoguruma, ft. Lil Chili",
		src: "./Assets/Audios/audio9.mp3",
		link: "https://open.spotify.com/track/575k01Ql5iqK5aR9kIv0Kw"
	},
	{
		title: "Hobbies",
		artist: "Aleyna Moon",
		src: "./Assets/Audios/audio5.mp3",
		link: "https://open.spotify.com/track/7evB1jJ0cK4ZYUeVGUDhQf"
	}
];
const DEFAULT_STATUSES = [
	"It is what it is",
	"Remind me to tweak my Shinaners",
	"Omw for avatar with azuki base :D",
	"Enjoys the songs :3",
	"When creativity peaked is also when my executive dysfunction shows itself",
	"Always stuck on setup. when will i be great?",
	"I am inspired... Unfortunately my bed and gravity wins...",
	"20% Building, 80% Procrastination TwT",
	"I SWEAR I WAS PRODUCTIVE! (At least mentally) XD",
	"Im not built different, im just assembled incorrectly",
	"doing side quest instead of main quest...",
	"Depression and anxiety is deep within my bones"
];
const DEFAULT_LD = [
	{ label: "Headpats", type: "like" },
	{ label: "Music", type: "like" },
	{ label: "Kebabs", type: "like" },
	{ label: "Cuddle/Hug", type: "ask" },
	{ label: "Kisses", type: "ask" },
	{ label: "Grab Me Up", type: "ng" }
];
const DEFAULT_TAGS = [
	"VRChat",
	"EN",
	"Photographer",
	"Music Addict",
	"Femboy",
	"Cat Girl"
];

function loadD(key, def) {
	try {
		const v = localStorage.getItem(key);
		return v ? JSON.parse(v) : def;
	} catch (e) {
		return def;
	}
}
function saveD(key, val) {
	try {
		localStorage.setItem(key, JSON.stringify(val));
	} catch (e) {}
}

let DATA = {
	playlist: loadD("nc_playlist", DEFAULT_PLAYLIST),
	statuses: loadD("nc_statuses", DEFAULT_STATUSES),
	profile: loadD("nc_profile", {
		name: "JustNeychii",
		username: "CHEEZEBORGIR",
		bio: "Unserious silly goober that meows randomly and my food goes blub blub blub 🐟 ( ironically i hate seafood XD )<br/><br/>Puple Cat | 19 | MDNI!!",
		tags: DEFAULT_TAGS.join(", ")
	}),
	images: loadD("nc_images", {
		art: "",
		p1: "",
		p2: "",
		p3: "",
		p4: ""
	}),
	ld: loadD("nc_ld", DEFAULT_LD),
	tags: loadD("nc_tags", DEFAULT_TAGS),
	gallery: loadD("nc_gallery", { sfw: 23, nsfw: 8 }),
	schedule: loadD("nc_schedule", {
		day: "Weekends",
		time: "19:00 ~ 02:00"
	}),
	password: localStorage.getItem("nc_password") || DEFAULT_PW,
	chips: loadD("nc_chips", {
		gender: 0,
		age: 0,
		mic: "on",
		device: 0
	}),
	theme: localStorage.getItem("nc_theme") || "dark",
	status: localStorage.getItem("nc_status") || "online",
	rank: parseInt(localStorage.getItem("nc_rank") || "4"),
	aboutMe: loadD("nc_about_me", null)
};

/* ══════════════════════════════════════
   THEME
══════════════════════════════════════ */
function applyTheme(t) {
	document.documentElement.setAttribute("data-theme", t);
	DATA.theme = t;
	localStorage.setItem("nc_theme", t);
	document.getElementById("themeIcon").textContent =
		t === "dark" ? "light_mode" : "dark_mode";
}
applyTheme(DATA.theme);
document.getElementById("themeToggle").onclick = () => {
	const cur = document.documentElement.getAttribute("data-theme");
	applyTheme(cur === "dark" ? "light" : "dark");
	showToast(DATA.theme === "light" ? "☀️ Light mode!" : "🌙 Dark mode!");
};

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function showToast(msg, dur = 2000) {
	const stack = document.getElementById("toastStack");
	const t = document.createElement("div");
	t.className = "toast";
	t.textContent = msg;
	stack.appendChild(t);
	setTimeout(() => {
		t.classList.add("out");
		t.addEventListener("animationend", () => t.remove(), {
			once: true
		});
	}, dur);
}

/* ══════════════════════════════════════
   APPLY DATA TO DOM
══════════════════════════════════════ */
function applyProfile() {
	const p = DATA.profile;
	document.getElementById("displayName").innerHTML = p.name || "JustNeychii";
	document.getElementById("usernameDisplay").textContent =
		p.username || "CHEEZEBORGIR";
	document.getElementById("bioText").innerHTML = (p.bio || "").replace(
		/\n/g,
		"<br/>"
	);
	renderTags();
	// Restore saved About Me content if available
	if (DATA.aboutMe) {
		const listEl = document.getElementById("aboutMeList");
		if (listEl) listEl.innerHTML = DATA.aboutMe;
	}
}

function applyImages() {
	const im = DATA.images;
	if (im.art) document.getElementById("artImg").src = im.art;
	if (im.p1) document.getElementById("p1img").src = im.p1;
	if (im.p2) document.getElementById("p2img").src = im.p2;
	if (im.p3) document.getElementById("p3img").src = im.p3;
	if (im.p4) document.getElementById("p4img").src = im.p4;
}

function renderTags() {
	const list = document.getElementById("tagsList");
	list.innerHTML = "";
	DATA.tags.forEach((tag, i) => {
		const el = document.createElement("span");
		el.className = "tag";
		el.textContent = tag;
		el.addEventListener("click", () => {
			if (!isAdmin) return;
			if (confirm(`Remove tag "${tag}"?`)) {
				DATA.tags.splice(i, 1);
				saveD("nc_tags", DATA.tags);
				renderTags();
				showToast("Tag removed");
			}
		});
		list.appendChild(el);
	});
}

function renderLikeChips() {
	const wrap = document.getElementById("likesChips");
	wrap.innerHTML = "";
	DATA.ld.forEach((item, i) => {
		const el = document.createElement("div");
		el.className = `like-chip ${item.type}`;
		el.innerHTML = `${item.label} <span class="chip-badge">${item.type.toUpperCase()}</span>`;
		el.title = isAdmin ? "Click to cycle LIKE→ASK→NG" : "";
		el.addEventListener("click", () => {
			if (!isAdmin) return;
			const cycle = { like: "ask", ask: "ng", ng: "like" };
			DATA.ld[i].type = cycle[DATA.ld[i].type];
			saveD("nc_ld", DATA.ld);
			renderLikeChips();
			showToast("Cycled: " + DATA.ld[i].type.toUpperCase());
		});
		wrap.appendChild(el);
	});
}

function applySchedule() {
	const s = DATA.schedule;
	document.getElementById("schedDay").textContent = s.day || "Weekends";
	document.getElementById("schedTime").textContent =
		s.time || "19:00 – 02:00";
	updateTimeline(s.time || "19:00 ~ 02:00");
}

function updateTimeline(timeStr) {
	const m = timeStr.match(/(\d+):(\d+)\s*[~\-–]\s*(\d+):(\d+)/);
	if (!m) return;
	let sh = parseInt(m[1]) + parseInt(m[2]) / 60;
	let eh = parseInt(m[3]) + parseInt(m[4]) / 60;
	const b1 = document.getElementById("tlBlock1");
	const b2 = document.getElementById("tlBlock2");
	if (eh < sh) {
		// overnight: 0→eh and sh→24
		b1.style.left = "0%";
		b1.style.width = ((eh / 24) * 100).toFixed(1) + "%";
		b2.style.left = ((sh / 24) * 100).toFixed(1) + "%";
		b2.style.width = (((24 - sh) / 24) * 100).toFixed(1) + "%";
	} else {
		b1.style.left = ((sh / 24) * 100).toFixed(1) + "%";
		b1.style.width = (((eh - sh) / 24) * 100).toFixed(1) + "%";
		b2.style.left = "0%";
		b2.style.width = "0%";
	}
}

function applyChips() {
	const c = DATA.chips;
	const genderOpts = ["👤 Femboy", "👤 Female", "👤 Male", "👤 Non-binary"];
	const ageOpts = ["🔞 18+", "🔞 13+", "🔞 All Ages"];
	const deviceOpts = ["🖥️ Desktop", "📱 Mobile", "🥽 VR", "🎮 Quest"];
	setChipText("chip-gender", genderOpts[c.gender || 0]);
	setChipText("chip-age", ageOpts[c.age || 0]);
	setChipText("chip-device", deviceOpts[c.device || 0]);
	const micChip = document.getElementById("chip-mic");
	if (c.mic === "off") {
		micChip.querySelector("span:first-of-type").textContent = "🔇 ";
		micChip.querySelector("span:last-of-type").textContent = "Mic OFF";
		micChip.style.borderColor = "rgba(248,113,113,0.4)";
	} else {
		micChip.querySelector("span:first-of-type").textContent = "🎙️ ";
		micChip.querySelector("span:last-of-type").textContent = "Mic ON";
		micChip.style.borderColor = "";
	}
}
function setChipText(id, full) {
	const chip = document.getElementById(id);
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
   RANK BADGE — VRChat ranks (admin-only click to cycle)
══════════════════════════════════════ */
const RANKS = [
	{ label: "Visitor", cls: "badge-visitor", dot: "#b0b0b0" },
	{ label: "New User", cls: "badge-newuser", dot: "#4ade80" },
	{ label: "User", cls: "badge-user", dot: "#60a5fa" },
	{ label: "Known User", cls: "badge-known", dot: "#a78bfa" },
	{ label: "Trusted User", cls: "badge-trusted", dot: "#fb923c" }
];
function applyRank(idx) {
	const r = RANKS[idx];
	const badge = document.getElementById("rankBadge");
	const dot = badge.querySelector(".badge-dot");
	const text = document.getElementById("rankBadgeText");
	badge.className = `badge ${r.cls}`;
	dot.style.background = r.dot;
	dot.style.boxShadow = `0 0 5px ${r.dot}`;
	text.textContent = r.label;
}
applyRank(DATA.rank);
document.getElementById("rankBadge").addEventListener("click", () => {
	if (!isAdmin) return;
	DATA.rank = (DATA.rank + 1) % RANKS.length;
	localStorage.setItem("nc_rank", DATA.rank);
	applyRank(DATA.rank);
	showToast("Rank: " + RANKS[DATA.rank].label);
});

/* ══════════════════════════════════════
   STATUS GRID (admin-only clickable)
══════════════════════════════════════ */
document.querySelectorAll("#statusGrid .status-item").forEach(el => {
	el.addEventListener("click", () => {
		if (!isAdmin) return;
		DATA.status = el.dataset.status;
		localStorage.setItem("nc_status", DATA.status);
		applyStatus();
		showToast("Status updated!");
	});
});

/* ══════════════════════════════════════
   CHIPS — click to cycle (admin only)
══════════════════════════════════════ */
document.getElementById("chip-gender").addEventListener("click", () => {
	if (!isAdmin) return;
	const opts = ["👤 Femboy", "👤 Female", "👤 Male", "👤 Non-binary"];
	DATA.chips.gender = (DATA.chips.gender + 1) % opts.length;
	setChipText("chip-gender", opts[DATA.chips.gender]);
	saveD("nc_chips", DATA.chips);
	showToast(opts[DATA.chips.gender]);
});
document.getElementById("chip-age").addEventListener("click", () => {
	if (!isAdmin) return;
	const opts = ["🔞 18+", "🔞 13+", "🔞 All Ages"];
	DATA.chips.age = (DATA.chips.age + 1) % opts.length;
	setChipText("chip-age", opts[DATA.chips.age]);
	saveD("nc_chips", DATA.chips);
	showToast(opts[DATA.chips.age]);
});
document.getElementById("chip-device").addEventListener("click", () => {
	if (!isAdmin) return;
	const opts = ["🖥️ Desktop", "📱 Mobile", "🥽 VR", "🎮 Quest"];
	DATA.chips.device = (DATA.chips.device + 1) % opts.length;
	setChipText("chip-device", opts[DATA.chips.device]);
	saveD("nc_chips", DATA.chips);
	showToast(opts[DATA.chips.device]);
});
document.getElementById("chip-mic").addEventListener("click", () => {
	if (!isAdmin) return;
	DATA.chips.mic = DATA.chips.mic === "on" ? "off" : "on";
	applyChips();
	saveD("nc_chips", DATA.chips);
	showToast("Mic " + DATA.chips.mic.toUpperCase());
});

/* ══════════════════════════════════════
   SCHEDULE CLICK (admin only)
══════════════════════════════════════ */
document.getElementById("schedDay").addEventListener("click", () => {
	if (!isAdmin) return;
	openEditModal("Edit Schedule Day", DATA.schedule.day, val => {
		if (!val.trim()) return;
		DATA.schedule.day = val.trim();
		saveD("nc_schedule", DATA.schedule);
		applySchedule();
		showToast("Schedule day updated!");
	});
});
document.getElementById("schedTime").addEventListener("click", () => {
	if (!isAdmin) return;
	openEditModal("Edit Time Range", DATA.schedule.time, val => {
		if (!val.trim()) return;
		DATA.schedule.time = val.trim();
		saveD("nc_schedule", DATA.schedule);
		applySchedule();
		showToast("Schedule time updated!");
	});
});

/* ══════════════════════════════════════
   DISPLAY NAME / USERNAME / BIO — contenteditable in admin
══════════════════════════════════════ */
["displayName", "usernameDisplay", "bioText"].forEach(id => {
	const el = document.getElementById(id);
	el.addEventListener("blur", () => {
		if (!isAdmin) return;
		if (id === "displayName") {
			DATA.profile.name = el.textContent;
			saveD("nc_profile", DATA.profile);
		}
		if (id === "usernameDisplay") {
			DATA.profile.username = el.textContent;
			saveD("nc_profile", DATA.profile);
		}
		if (id === "bioText") {
			DATA.profile.bio = el.innerHTML;
			saveD("nc_profile", DATA.profile);
		}
		showToast("Saved!");
	});
});

/* ── About Me — save list changes on blur ── */
document.getElementById("aboutMe").addEventListener("blur", () => {
	if (!isAdmin) return;
	const listEl = document.getElementById("aboutMeList");
	if (listEl) {
		DATA.aboutMe = listEl.innerHTML;
		saveD("nc_about_me", DATA.aboutMe);
		showToast("About Me saved!");
	}
});

/* Click on main art image to edit URL in admin mode */
document.getElementById("artImg").addEventListener("click", e => {
	if (!isAdmin) return;
	e.stopPropagation();
	openEditModal(
		"Edit Main Art Image URL",
		DATA.images.art || "./Assets/Images/avatar.jpg",
		val => {
			if (!val.trim()) return;
			DATA.images.art = val.trim();
			document.getElementById("artImg").src = val.trim();
			saveD("nc_images", DATA.images);
			showToast("Main art updated!");
		}
	);
});

/* ══════════════════════════════════════
   ADD TAG (admin only)
══════════════════════════════════════ */
function openAddTag() {
	if (!isAdmin) return;
	openEditModal("Add New Tag", "", val => {
		if (!val.trim()) return;
		DATA.tags.push(val.trim());
		saveD("nc_tags", DATA.tags);
		renderTags();
		showToast("Tag added!");
	});
}

/* ══════════════════════════════════════
   GALLERY BADGE CLICK = toggle set
══════════════════════════════════════ */
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

/* ══════════════════════════════════════
   AUDIO + PLAYER
══════════════════════════════════════ */
const audio = document.getElementById("bgm");
const toggle = document.getElementById("musicToggle");
const nextBtn = document.getElementById("nextTrack");
const progBar = document.getElementById("progressBar");
const tTitle = document.getElementById("trackTitle");
const tArtist = document.getElementById("trackArtist");

let playlist = DATA.playlist;
let currentIndex = 0;
let audioCtx, analyser, aSource, gainNode;
let audioInited = false;

/* ── Marquee helpers ── */
function resetMarquee() {
	const titleEl = document.getElementById("trackTitle");
	titleEl.querySelector(".title-dup")?.remove();
	titleEl.classList.remove("is-scrolling");
	titleEl.style.removeProperty("--moff");
	titleEl.style.removeProperty("--mdur");
	// Reset any animation on the title-text span
	const ts = titleEl.querySelector(".title-text");
	if (ts) ts.style.animation = "";
}
function setupMarquee(text) {
	if (window.innerWidth > 600) return;
	const titleEl = document.getElementById("trackTitle");
	const span = titleEl.querySelector(".title-text");
	if (!span) return;
	requestAnimationFrame(() => {
		if (span.scrollWidth <= titleEl.clientWidth) return;
		// Add duplicate span for seamless loop
		const dup = document.createElement("span");
		dup.className = "title-dup";
		dup.textContent = text;
		titleEl.appendChild(dup);
		// The shift = width of original span + padding-left of dup (2.5rem ≈ 40px)
		const gap = parseFloat(getComputedStyle(dup).paddingLeft) || 40;
		const shift = span.offsetWidth + gap;
		const dur = Math.max(8, shift / 28); // ~28px/s
		titleEl.style.setProperty("--moff", `-${shift}px`);
		titleEl.style.setProperty("--mdur", `${dur}s`);
		titleEl.classList.add("is-scrolling");
	});
}

function setTrackInfo(tr) {
	const titleEl = document.getElementById("trackTitle");
	const span = titleEl.querySelector(".title-text");
	if (span) span.textContent = tr.title;
	tArtist.textContent = tr.artist || "";
	titleEl.onclick = () => tr.link && window.open(tr.link, "_blank");
}
function playTrackByIndex(idx) {
	currentIndex =
		((idx % playlist.length) + playlist.length) % playlist.length;
	const tr = playlist[currentIndex];

	// ── Animate OUT (slide down + fade) ──
	tTitle.style.opacity = "0";
	tTitle.style.transform = "translateY(5px)";
	tArtist.style.opacity = "0";
	tArtist.style.transform = "translateY(5px)";

	setTimeout(() => {
		// Reset marquee state before updating content
		resetMarquee();
		setTrackInfo(tr);
		audio.src = tr.src;
		audio.load();
		audio.play().catch(() => {});

		// Snap to entry position (slide in from above) — no transition
		tTitle.style.transition = "none";
		tArtist.style.transition = "none";
		tTitle.style.transform = "translateY(-5px)";
		tArtist.style.transform = "translateY(-5px)";

		// Re-enable transitions & animate IN
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				tTitle.style.transition = "";
				tArtist.style.transition = "";
				tTitle.style.opacity = "1";
				tTitle.style.transform = "translateY(0)";
				tArtist.style.opacity = "1";
				tArtist.style.transform = "translateY(0)";
				// Setup marquee after entrance animation settles
				setTimeout(() => setupMarquee(tr.title), 320);
			});
		});
	}, 260);
}
function fadeGain(to, dur, cb) {
	if (!audioCtx) {
		cb?.();
		return;
	}
	const now = audioCtx.currentTime;
	gainNode.gain.cancelScheduledValues(now);
	gainNode.gain.setValueAtTime(gainNode.gain.value, now);
	gainNode.gain.linearRampToValueAtTime(to, now + dur);
	if (cb) setTimeout(cb, dur * 1000);
}
function initVis() {
	if (audioInited) return;
	audioInited = true;
	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	analyser = audioCtx.createAnalyser();
	analyser.fftSize = 128;
	gainNode = audioCtx.createGain();
	gainNode.gain.value = 0;
	aSource = audioCtx.createMediaElementSource(audio);
	aSource.connect(gainNode);
	gainNode.connect(analyser);
	analyser.connect(audioCtx.destination);
	freqData = new Uint8Array(analyser.frequencyBinCount);
	drawViz();
}

setTrackInfo(playlist[0]);
// Setup marquee for first track
setTimeout(() => setupMarquee(playlist[0].title), 600);
audio.src = playlist[0].src;
audio
	.play()
	.then(() => (toggle.textContent = "pause"))
	.catch(() => {
		toggle.textContent = "play_arrow";
		document.body.classList.add("needs-interaction");
	});
audio.addEventListener("ended", () => playTrackByIndex(currentIndex + 1));
audio.addEventListener("play", () => {
	nextBtn.classList.add("unlocked");
	toggle.textContent = "pause";
	document.body.classList.add("music-playing");
	initVis();
	if (audioCtx?.state === "suspended") audioCtx.resume();
	fadeGain(0.3, 0.6);
});
audio.addEventListener("pause", () => {
	progBar.style.width = "0";
	toggle.textContent = "play_arrow";
	document.body.classList.remove("music-playing");
});
audio.addEventListener("timeupdate", () => {
	if (audio.duration)
		progBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
});
toggle.onclick = () => {
	// Resume audio context if suspended (required after user gesture)
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

// One-time unlock on any user interaction
const unlockEvents = ["click", "touchstart"];

const tryUnlockAudio = () => {
	document.body.classList.remove("needs-interaction");
	audio.play().catch(() => {});
};

unlockEvents.forEach(e =>
	document.addEventListener(e, tryUnlockAudio, {
		once: true,
		passive: true
	})
);
/* ══════════════════════════════════════
   VISUALIZER
══════════════════════════════════════ */
const canvas = document.getElementById("visualizer");
const vCtx = canvas.getContext("2d");
let freqData,
	smoothPulse = 0;

function resizeCanvas() {
	canvas.width = canvas.offsetWidth * devicePixelRatio;
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
	const W = canvas.width,
		H = canvas.height,
		L = freqData.length;
	const bw = W / L;
	const avg = freqData.reduce((s, v) => s + v, 0) / L;
	smoothPulse += (avg / 255 - smoothPulse) * 0.08;
	vCtx.shadowBlur = 8 + smoothPulse * 40;
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
		default: {
			thumb: "t_slide",
			full: "slide",
			count: DATA.gallery.sfw
		},
		nsfw: {
			thumb: "t_NsfwSlide",
			full: "NsfwSlide",
			count: DATA.gallery.nsfw
		}
	}
};

const track = document.getElementById("galleryTrack");
let currentSet = "default";
let slides = [],
	slideIndex = 1,
	isAnimating = false,
	autoTimer;
const TRANS_MS = 600;
const fullCache = new Map();

function buildGalleryImages(set) {
	const cfg = galleryConfig.sets[set];
	return Array.from({ length: cfg.count }, (_, i) => ({
		thumb: `${galleryConfig.basePath}/${cfg.thumb}${i + 1}.png`,
		full: `${galleryConfig.basePath}/${cfg.full}${i + 1}.png`
	}));
}

function renderGallery(set) {
	track.classList.add("no-transition");
	track.innerHTML = "";
	const imgs = buildGalleryImages(set);
	if (!imgs.length) {
		track.innerHTML =
			'<div style="padding:30px;color:var(--muted2);text-align:center;flex:1">No images in this set</div>';
		track.classList.remove("no-transition");
		slides = [];
		return;
	}
	imgs.forEach(src => {
		const item = document.createElement("div");
		item.className = "gallery-item";
		const frame = document.createElement("div");
		frame.className = "image-frame";
		const loader = document.createElement("div");
		loader.className = "img-loader";
		const img = document.createElement("img");
		img.className = "gallery-img";
		img.classList.remove("loaded");
		frame.classList.remove("img-loaded");
		img.src = src.thumb;
		img.dataset.full = src.full;
		img.alt = "";
		img.onload = () => {
			img.classList.add("loaded");
			frame.classList.add("img-loaded");
		};
		img.onerror = () => {
			frame.classList.add("img-loaded");
			img.style.opacity = "0";
		}; // hide broken
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
		// Re-attach onclick for clones (cloneNode doesn't preserve event listeners)
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
	requestAnimationFrame(() => {
		track.classList.remove("no-transition");
	});
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
	if (slideIndex === 0) slideIndex = tot;
	if (slideIndex === tot + 1) slideIndex = 1;
	updateSlide(false);
	isAnimating = false;
});
function nextSlide() {
	if (!isAnimating) {
		slideIndex++;
		updateSlide();
	}
}
function prevSlide() {
	if (!isAnimating) {
		slideIndex--;
		updateSlide();
	}
}
function startAuto() {
	clearInterval(autoTimer);
	autoTimer = setInterval(nextSlide, 9000);
}
function stopAuto() {
	clearInterval(autoTimer);
}
document.getElementById("nextSlide").onclick = () => {
	stopAuto();
	nextSlide();
	startAuto();
};
document.getElementById("prevSlide").onclick = () => {
	stopAuto();
	prevSlide();
	startAuto();
};
window.addEventListener("resize", () => updateSlide(false));

// Touch swipe
let tStartX = 0;
document.querySelector(".gallery-viewport").addEventListener(
	"touchstart",
	e => {
		tStartX = e.touches[0].clientX;
	},
	{ passive: true }
);
document.querySelector(".gallery-viewport").addEventListener("touchend", e => {
	const dx = e.changedTouches[0].clientX - tStartX;
	if (Math.abs(dx) > 40) {
		stopAuto();
		dx < 0 ? nextSlide() : prevSlide();
		startAuto();
	}
});

renderGallery("default");

// Fullscreen
function openFullscreen(src) {
	if (!src) return;
	const img = document.getElementById("galleryFullImg");
	const wrap = document.getElementById("galleryFullWrap");
	img.classList.remove("loaded");
	img.src = "";
	wrap.classList.remove("img-loaded");
	openOverlay("galleryFull");
	const show = () => {
		img.src = src;
		img.classList.add("loaded");
		wrap.classList.add("img-loaded");
	};
	let cached = fullCache.get(src);
	if (!cached) {
		cached = new Image();
		cached.src = src;
		fullCache.set(src, cached);
	}
	if (cached.complete && cached.naturalWidth > 0) {
		show();
	} else {
		cached.onload = show;
		cached.onerror = () => {
			wrap.classList.add("img-loaded");
		};
	}
}
function closeFullscreen() {
	closeOverlay("galleryFull");
}

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
	const el = document.getElementById(id);
	const card = el.querySelector(
		".modal-card,.admin-panel,.gallery-full-img-wrap,.edit-modal-card"
	);
	if (card) {
		card.classList.add("closing");
		setTimeout(() => card.classList.remove("closing"), 280);
	}
	el.classList.remove("show");
	setTimeout(() => {
		el.style.display = "none";
		document.body.classList.remove("modal-open");
	}, 250);
}
document.getElementById("openSocials").onclick = () =>
	openOverlay("socialOverlay");
document.querySelectorAll(".overlay-bg").forEach(bg => {
	if (!bg.onclick)
		bg.addEventListener("click", e => {
			const ov = bg.closest(".overlay");
			if (ov && ov.id !== "adminOverlay" && ov.id !== "editModal")
				closeOverlay(ov.id);
		});
});
let pendingLink = "";
function openMatureWarning(url) {
	pendingLink = url;
	openOverlay("matureOverlay");
}
document.getElementById("matureContinue").onclick = () => {
	if (pendingLink) window.open(pendingLink, "_blank");
	closeOverlay("matureOverlay");
};
document.getElementById("matureCancel").onclick = () =>
	closeOverlay("matureOverlay");
document.addEventListener("keydown", e => {
	if (e.key === "Escape") {
		[
			"socialOverlay",
			"matureOverlay",
			"galleryFull",
			"adminOverlay",
			"editModal"
		].forEach(id => {
			const el = document.getElementById(id);
			if (el?.classList.contains("show")) closeOverlay(id);
		});
	}
});

/* Polaroid click — admin edits URL, visitor opens fullscreen */
const polaroidLabelMap = {
	0: "Top-Left",
	1: "Top-Right",
	2: "Bottom-Left",
	3: "Bottom-Right"
};
document.querySelectorAll(".polaroid").forEach((p, i) => {
	p.addEventListener("click", e => {
		e.stopPropagation();
		const key = `p${i + 1}`;
		const imgEl = document.getElementById(`p${i + 1}img`);
		if (isAdmin) {
			openEditModal(
				`Edit Polaroid ${polaroidLabelMap[i]} URL`,
				DATA.images[key] || "./Assets/Images/avatar.jpg",
				val => {
					if (!val.trim()) return;
					DATA.images[key] = val.trim();
					imgEl.src = val.trim();
					saveD("nc_images", DATA.images);
					showToast(`Polaroid ${polaroidLabelMap[i]} updated!`);
				}
			);
		} else {
			openFullscreen(imgEl.src);
		}
	});
});

/* ══════════════════════════════════════
   ROTATING STATUS
══════════════════════════════════════ */
let statuses = DATA.statuses;
let curStatus = "";
const statusEl = document.getElementById("statuses");
function swapStatus() {
	statusEl.classList.add("swapOut");
	setTimeout(() => {
		const pool = statuses.filter(s => s !== curStatus);
		curStatus = pool.length
			? pool[Math.floor(Math.random() * pool.length)]
			: statuses[0];
		statusEl.textContent = `💭 ${curStatus}`;
		statusEl.classList.remove("swapOut");
	}, 400);
}
curStatus = statuses[Math.floor(Math.random() * statuses.length)];
statusEl.textContent = `💭 ${curStatus}`;
setInterval(swapStatus, 10000);

/* ══════════════════════════════════════
   FOOTER — HOLD 5 SECONDS → ADMIN
══════════════════════════════════════ */
const footer = document.getElementById("footer");
const holdRing = document.getElementById("footer-hold-ring");
const holdFill = document.getElementById("footer-hold-fill");
let holdTimer = null,
	holdStart = 0,
	holdRAF = null;

function startHold(e) {
	if (e.target.closest(".tag,.like-chip,.status-item,.chip")) return; // don't trigger on interactive elements
	holdStart = Date.now();
	holdRing.classList.add("active");
	holdFill.style.transition = "none";
	holdFill.style.width = "0%";

	function tick() {
		const elapsed = Date.now() - holdStart;
		const pct = Math.min((elapsed / 5000) * 100, 100);
		holdFill.style.width = pct + "%";
		if (pct < 100) {
			holdRAF = requestAnimationFrame(tick);
		} else {
			holdRing.classList.remove("active");
			holdFill.style.width = "0%";
			openAdmin();
		}
	}
	holdRAF = requestAnimationFrame(tick);
}
function cancelHold() {
	cancelAnimationFrame(holdRAF);
	holdRing.classList.remove("active");
	holdFill.style.width = "0%";
}
footer.addEventListener("mousedown", startHold);
footer.addEventListener("touchstart", startHold, { passive: true });
footer.addEventListener("mouseup", cancelHold);
footer.addEventListener("mouseleave", cancelHold);
footer.addEventListener("touchend", cancelHold);
footer.addEventListener("touchcancel", cancelHold);

/* ══════════════════════════════════════
   ADMIN
══════════════════════════════════════ */
let isAdmin = false;

function openAdmin() {
	document.getElementById("adminLogin").style.display = "block";
	document.getElementById("adminDash").style.display = "none";
	document.getElementById("adminPassInput").value = "";
	document.getElementById("adminLoginError").classList.remove("show");
	openOverlay("adminOverlay");
}
function openAdminDash() {
	// Already logged in — open straight to dashboard
	document.getElementById("adminLogin").style.display = "none";
	document.getElementById("adminDash").style.display = "block";
	loadAdminFields();
	openOverlay("adminOverlay");
}
function closeAdmin() {
	closeOverlay("adminOverlay");
}

function logoutAdmin() {
	isAdmin = false;
	document.body.classList.remove("admin-active");
	document.getElementById("adminBadge").classList.remove("visible");
	document.getElementById("logoutBtn").classList.remove("visible");
	// Disable contenteditable
	["displayName", "usernameDisplay", "bioText"].forEach(id => {
		document.getElementById(id).contentEditable = "false";
	});
	document.getElementById("aboutMe").contentEditable = "false";
	closeOverlay("adminOverlay");
	showToast("🔒 Admin mode OFF");
}

document.getElementById("adminBadge").addEventListener("click", () => {
	if (isAdmin) openAdminDash();
});
document.getElementById("logoutBtn").addEventListener("click", logoutAdmin);

function doLogin() {
	const pw = document.getElementById("adminPassInput").value;
	if (pw === DATA.password) {
		document.getElementById("adminLogin").style.display = "none";
		document.getElementById("adminDash").style.display = "block";
		isAdmin = true;
		document.body.classList.add("admin-active");
		document.getElementById("adminBadge").classList.add("visible");
		document.getElementById("logoutBtn").classList.add("visible");
		loadAdminFields();
		// Enable contenteditable
		["displayName", "usernameDisplay", "bioText"].forEach(
			id => (document.getElementById(id).contentEditable = "true")
		);
		// Enable About Me editing
		document.getElementById("aboutMe").contentEditable = "true";
		showToast("🔓 Admin mode ON!");
	} else {
		const err = document.getElementById("adminLoginError");
		err.textContent = "✗ Wrong password!";
		err.classList.add("show");
	}
}
document.getElementById("adminPassInput").addEventListener("keydown", e => {
	if (e.key === "Enter") doLogin();
});

function switchTab(name) {
	document
		.querySelectorAll(".admin-tab")
		.forEach(t => t.classList.remove("active"));
	document
		.querySelectorAll(".admin-section")
		.forEach(s => s.classList.remove("active"));
	const tabs = [
		"profile",
		"images",
		"music",
		"statuses",
		"gallery",
		"likesdislikes",
		"schedule",
		"password"
	];
	document
		.querySelectorAll(".admin-tab")
		[tabs.indexOf(name)]?.classList.add("active");
	document.getElementById("tab-" + name)?.classList.add("active");
}

function loadAdminFields() {
	const p = DATA.profile,
		im = DATA.images,
		s = DATA.schedule;
	document.getElementById("editName").value = p.name || "";
	document.getElementById("editUsername").value = p.username || "";
	document.getElementById("editBio").value = (p.bio || "").replace(
		/<br\/>/g,
		"\n"
	);
	document.getElementById("editTags").value = DATA.tags.join(", ");
	document.getElementById("editArt").value = im.art || "";
	document.getElementById("editP1").value = im.p1 || "";
	document.getElementById("editP2").value = im.p2 || "";
	document.getElementById("editP3").value = im.p3 || "";
	document.getElementById("editP4").value = im.p4 || "";
	document.getElementById("editSfwCount").value = DATA.gallery.sfw;
	document.getElementById("editNsfwCount").value = DATA.gallery.nsfw;
	document.getElementById("editSchedDay").value = s.day || "Weekends";
	document.getElementById("editSchedTime").value = s.time || "19:00 ~ 02:00";
	renderAdminTracks();
	renderAdminStatuses();
	renderAdminLD();
}

function showSuccess() {
	const s = document.getElementById("adminSuccess");
	s.textContent = "✓ Changes saved!";
	s.classList.add("show");
	setTimeout(() => s.classList.remove("show"), 2200);
}
function saveProfile() {
	DATA.profile = {
		name: document.getElementById("editName").value,
		username: document.getElementById("editUsername").value,
		bio: document.getElementById("editBio").value.replace(/\n/g, "<br/>")
	};
	DATA.tags = document
		.getElementById("editTags")
		.value.split(",")
		.map(t => t.trim())
		.filter(Boolean);
	saveD("nc_profile", DATA.profile);
	saveD("nc_tags", DATA.tags);
	applyProfile();
	showSuccess();
}
function saveImages() {
	DATA.images = {
		art: document.getElementById("editArt").value,
		p1: document.getElementById("editP1").value,
		p2: document.getElementById("editP2").value,
		p3: document.getElementById("editP3").value,
		p4: document.getElementById("editP4").value
	};
	saveD("nc_images", DATA.images);
	applyImages();
	showSuccess();
}
function saveSchedule() {
	DATA.schedule = {
		day: document.getElementById("editSchedDay").value,
		time: document.getElementById("editSchedTime").value
	};
	saveD("nc_schedule", DATA.schedule);
	applySchedule();
	showSuccess();
}
function saveGalleryCounts() {
	DATA.gallery.sfw =
		parseInt(document.getElementById("editSfwCount").value) || 23;
	DATA.gallery.nsfw =
		parseInt(document.getElementById("editNsfwCount").value) || 8;
	saveD("nc_gallery", DATA.gallery);
	renderGallery(currentSet);
	showSuccess();
}

function renderAdminTracks() {
	const list = document.getElementById("adminTrackList");
	list.innerHTML = "";
	DATA.playlist.forEach((tr, i) => {
		const item = document.createElement("div");
		item.className = "track-item";
		item.innerHTML = `<div class="track-item-info"><div class="track-item-title">${tr.title}</div><div class="track-item-artist">${tr.artist}</div></div><button class="track-remove" onclick="removeTrack(${i})" title="Remove">✕</button>`;
		list.append(item);
	});
}
function removeTrack(i) {
	DATA.playlist.splice(i, 1);
	if (!DATA.playlist.length) DATA.playlist = [...DEFAULT_PLAYLIST];
	saveD("nc_playlist", DATA.playlist);
	playlist = DATA.playlist;
	if (currentIndex >= playlist.length) currentIndex = 0;
	renderAdminTracks();
	showSuccess();
}
function addTrack() {
	const title = document.getElementById("newTrackTitle").value.trim();
	const artist = document.getElementById("newTrackArtist").value.trim();
	const src = document.getElementById("newTrackSrc").value.trim();
	const link = document.getElementById("newTrackLink").value.trim();
	if (!title || !src) {
		showToast("Title and URL required!");
		return;
	}
	DATA.playlist.push({ title, artist, src, link });
	saveD("nc_playlist", DATA.playlist);
	playlist = DATA.playlist;
	["newTrackTitle", "newTrackArtist", "newTrackSrc", "newTrackLink"].forEach(
		id => (document.getElementById(id).value = "")
	);
	renderAdminTracks();
	showSuccess();
}

function renderAdminStatuses() {
	const list = document.getElementById("adminStatusList");
	list.innerHTML = "";
	DATA.statuses.forEach((s, i) => {
		const row = document.createElement("div");
		row.className = "status-item-row";
		row.innerHTML = `<span class="status-item-text">${s}</span><button class="track-remove" onclick="removeStatus(${i})">✕</button>`;
		list.append(row);
	});
}
function removeStatus(i) {
	DATA.statuses.splice(i, 1);
	if (!DATA.statuses.length) DATA.statuses = [...DEFAULT_STATUSES];
	saveD("nc_statuses", DATA.statuses);
	statuses = DATA.statuses;
	renderAdminStatuses();
	showSuccess();
}
function addStatus() {
	const val = document.getElementById("newStatusInput").value.trim();
	if (!val) return;
	DATA.statuses.push(val);
	saveD("nc_statuses", DATA.statuses);
	statuses = DATA.statuses;
	document.getElementById("newStatusInput").value = "";
	renderAdminStatuses();
	showSuccess();
}

function renderAdminLD() {
	const list = document.getElementById("ldAdminList");
	list.innerHTML = "";
	DATA.ld.forEach((item, i) => {
		const row = document.createElement("div");
		row.className = "status-item-row";
		row.innerHTML = `<span class="status-item-text">${item.label} <em style="opacity:.6">(${item.type.toUpperCase()})</em></span><button class="track-remove" onclick="removeLdItem(${i})">✕</button>`;
		list.append(row);
	});
}
function removeLdItem(i) {
	DATA.ld.splice(i, 1);
	saveD("nc_ld", DATA.ld);
	renderLikeChips();
	renderAdminLD();
	showSuccess();
}
function addLdItem() {
	const label = document.getElementById("newLdLabel").value.trim();
	const type = document.getElementById("newLdType").value;
	if (!label) {
		showToast("Label required!");
		return;
	}
	DATA.ld.push({ label, type });
	saveD("nc_ld", DATA.ld);
	document.getElementById("newLdLabel").value = "";
	renderLikeChips();
	renderAdminLD();
	showSuccess();
}

function changePassword() {
	const cur = document.getElementById("currentPwd").value;
	const nw = document.getElementById("newPwd").value;
	const cf = document.getElementById("confirmPwd").value;
	const err = document.getElementById("adminSuccess");
	if (cur !== DATA.password) {
		err.textContent = "✗ Current password wrong!";
		err.classList.add("show");
		setTimeout(() => err.classList.remove("show"), 2500);
		return;
	}
	if (nw !== cf || !nw) {
		err.textContent = "✗ Passwords do not match!";
		err.classList.add("show");
		setTimeout(() => err.classList.remove("show"), 2500);
		return;
	}
	DATA.password = nw;
	localStorage.setItem("nc_password", nw);
	["currentPwd", "newPwd", "confirmPwd"].forEach(
		id => (document.getElementById(id).value = "")
	);
	showSuccess();
}

/* ══════════════════════════════════════
   MINI EDIT MODAL
══════════════════════════════════════ */
let editModalCb = null;
function openEditModal(title, defVal, cb) {
	document.getElementById("editModalTitle").textContent = title;
	document.getElementById("editModalInput").value = defVal;
	editModalCb = cb;
	openOverlay("editModal");
	setTimeout(() => document.getElementById("editModalInput").select(), 100);
}
function closeEditModal() {
	closeOverlay("editModal");
	editModalCb = null;
}
function confirmEditModal() {
	const val = document.getElementById("editModalInput").value;
	if (editModalCb) editModalCb(val);
	closeEditModal();
}
document.getElementById("editModalInput").addEventListener("keydown", e => {
	if (e.key === "Enter") confirmEditModal();
	if (e.key === "Escape") closeEditModal();
});

/* ══════════════════════════════════════
   MASCOT  (from index.html easter eggs)
══════════════════════════════════════ */
const mascot = document.getElementById("mascot");
const mascotQuips = [
	"meow~",
	"nya!",
	"pls stop clicking me TwT",
	"🐾",
	"uwu~",
	"*purring*",
	"you found me!"
];
let mascotClickN = 0,
	mascotTimer;
mascot.addEventListener("click", () => {
	mascotClickN++;
	clearTimeout(mascotTimer);
	mascotTimer = setTimeout(() => (mascotClickN = 0), 1000);
	mascot.classList.add("jiggle");
	mascot.addEventListener(
		"animationend",
		() => mascot.classList.remove("jiggle"),
		{ once: true }
	);
	showToast(mascotQuips[mascotClickN % mascotQuips.length], 1400);
	if (mascotClickN >= 10) {
		mascotClickN = 0;
		mascot.src = "./Assets/Images/mascot2.png";
		showToast("💢 Fuck You!", 3000);
		setTimeout(() => (mascot.src = "./Assets/Images/mascot1.png"), 4000);
	}
});

/* Konami code easter egg */
const KONAMI = [
	"ArrowUp",
	"ArrowUp",
	"ArrowDown",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"ArrowLeft",
	"ArrowRight",
	"b",
	"a"
];
let konamiIdx = 0;
document.addEventListener("keydown", e => {
	if (e.key === KONAMI[konamiIdx]) {
		konamiIdx++;
	} else konamiIdx = 0;
	if (konamiIdx === KONAMI.length) {
		konamiIdx = 0;
		rainCats();
	}
});
function rainCats() {
	showToast("🎉 Konami Code! Nyaa~!", 2500);
	const emojis = ["🐱", "😺", "🐾", "💜", "✨", "🌸"];
	for (let i = 0; i < 28; i++) {
		setTimeout(() => {
			const el = document.createElement("div");
			el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
			el.style.cssText = `position:fixed;font-size:${18 + Math.random() * 20}px;left:${Math.random() * 100}vw;top:-40px;z-index:9999;pointer-events:none;animation:catFall ${1.5 + Math.random() * 2.5}s linear forwards;`;
			document.body.appendChild(el);
			el.addEventListener("animationend", () => el.remove());
		}, i * 90);
	}
}
// inject cat fall keyframe
const style = document.createElement("style");
style.textContent =
	"@keyframes catFall{from{transform:translateY(0) rotate(0deg);opacity:1}to{transform:translateY(105vh) rotate(720deg);opacity:0}}";
document.head.appendChild(style);

/* ══════════════════════════════════════
   PAGE LOAD
══════════════════════════════════════ */
applyProfile();
applyImages();
applyChips();
applySchedule();
applyStatus();
renderLikeChips();

const loaderEl = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");
const pageEl = document.getElementById("page");
let dotCount = 0;
const dotTimer = setInterval(() => {
	loaderText.textContent = "Loading" + ".".repeat(++dotCount % 4);
}, 500);

window.addEventListener("load", () => {
	clearInterval(dotTimer);
	setTimeout(() => {
		loaderEl.classList.add("hide");
		setTimeout(() => (loaderEl.style.display = "none"), 500);
		pageEl.classList.add("loaded");
		mascot.classList.add("loaded");
	}, 350);
});
