"use strict";

const express = require("express");
const path    = require("path");
const crypto  = require("crypto");
const { Pool } = require("pg");

const app  = express();
const PORT = process.env.PORT || 3000;

/* ─────────────────────────────────────────────
   PostgreSQL
───────────────────────────────────────────── */
const pool = new Pool({
	user:     process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host:     process.env.DB_HOST,
	port:     Number(process.env.DB_PORT) || 6438,
	database: process.env.DB_NAME,
	ssl:      { rejectUnauthorized: false }
});

async function initDB() {
	await pool.query(`
		CREATE TABLE IF NOT EXISTS site_data (
			id   INTEGER PRIMARY KEY DEFAULT 1,
			data JSONB   NOT NULL,
			CHECK (id = 1)
		)
	`);
	await pool.query(`
		INSERT INTO site_data (id, data)
		VALUES (1, $1::jsonb)
		ON CONFLICT (id) DO NOTHING
	`, [JSON.stringify(DEFAULT_DATA)]);
	console.log("✓ Database ready");
}

async function readData() {
	const res = await pool.query("SELECT data FROM site_data WHERE id = 1");
	const row = res.rows[0]?.data ?? {};
	return Object.assign({}, DEFAULT_DATA, row);
}

async function writeData(data) {
	await pool.query(
		"UPDATE site_data SET data = $1::jsonb WHERE id = 1",
		[JSON.stringify(data)]
	);
}

/* ─────────────────────────────────────────────
   Default data
───────────────────────────────────────────── */
const DEFAULT_DATA = {
	password: "neychii",
	playlist: [
		{ title: "Despite Everything, It Is Still Me", artist: "LuvBytes404",              src: "./public/public/Assets/Audios/audio.mp3",  link: "https://soundcloud.com/luvbytes404/despite-everything-it-is-still-me" },
		{ title: "Limerence",                          artist: "angelize, ft. Lilycat",    src: "./public/Assets/Audios/audio3.mp3", link: "https://open.spotify.com/track/5TEOhfxU5KP5lZApP1psga" },
		{ title: "Kill me with a lie",                 artist: "angelize",                 src: "./public/Assets/Audios/audio4.mp3", link: "https://open.spotify.com/track/6H2egbHEnfpGQgWGTA4icy" },
		{ title: "under the sky",                      artist: "coco., ft. Lil Chili",     src: "./public/Assets/Audios/audio6.mp3", link: "https://open.spotify.com/track/1SY9IArHB4QtiX37o4mOg7" },
		{ title: "Seasons",                            artist: "Alohaii, ft. Shiki Myokino", src: "./public/Assets/Audios/audio2.mp3", link: "https://soundcloud.com/lonealphamusic/seasons" },
		{ title: "Tell Me",                            artist: "coco., ft. Lil Chili",     src: "./public/Assets/Audios/audio7.mp3", link: "https://open.spotify.com/track/14ar0JOH3XfT9AJWRlganR" },
		{ title: "3edw",                               artist: "angelize",                 src: "./public/Assets/Audios/audio8.mp3", link: "https://open.spotify.com/track/2QPSTJZuLHo3dQSjOVioUf" },
		{ title: "Looking For Me",                     artist: "Itoguruma, ft. Lil Chili", src: "./public/Assets/Audios/audio9.mp3", link: "https://open.spotify.com/track/575k01Ql5iqK5aR9kIv0Kw" },
		{ title: "Hobbies",                            artist: "Aleyna Moon",              src: "./public/Assets/Audios/audio5.mp3", link: "https://open.spotify.com/track/7evB1jJ0cK4ZYUeVGUDhQf" }
	],
	statuses: [
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
	],
	profile: {
		name:     "JustNeychii",
		username: "CHEEZEBORGIR",
		bio:      "Unserious silly goober that meows randomly and my food goes blub blub blub 🐟 ( ironically i hate seafood XD )<br/><br/>Puple Cat | 19 | MDNI!!"
	},
	images:   { art: "", p1: "", p2: "", p3: "", p4: "" },
	ld: [
		{ label: "Headpats",   type: "like" },
		{ label: "Music",      type: "like" },
		{ label: "Kebabs",     type: "like" },
		{ label: "Cuddle/Hug", type: "ask"  },
		{ label: "Kisses",     type: "ask"  },
		{ label: "Grab Me Up", type: "ng"   }
	],
	tags:     ["VRChat", "EN", "Photographer", "Music Addict", "Femboy", "Cat Boy"],
	gallery:  { sfw: 23, nsfw: 8 },
	schedule: { day: "Weekends", time: "19:00 ~ 02:00" },
	chips:    { gender: 0, age: 0, mic: "on", device: 0 },
	status:   "online",
	rank:     4,
	aboutMe:  null
};

/* ─────────────────────────────────────────────
   Middleware
───────────────────────────────────────────── */
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

/* ─────────────────────────────────────────────
   Session store  (in-memory, per process)
───────────────────────────────────────────── */
const sessions    = new Map();
const SESSION_TTL = 8 * 60 * 60 * 1000;

setInterval(() => {
	const now = Date.now();
	for (const [token, expiry] of sessions) {
		if (expiry < now) sessions.delete(token);
	}
}, 30 * 60 * 1000);

function requireAuth(req, res, next) {
	const header = req.headers["authorization"] || "";
	const token  = header.replace(/^Bearer\s+/i, "").trim();
	if (!token || !sessions.has(token) || sessions.get(token) < Date.now()) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	next();
}

/* ─────────────────────────────────────────────
   Routes
───────────────────────────────────────────── */

app.get("/api/data", async (_req, res) => {
	try {
		const { password, ...safe } = await readData();
		res.json(safe);
	} catch (e) {
		res.status(500).json({ error: "DB error" });
	}
});

app.post("/api/login", async (req, res) => {
	const { password } = req.body || {};
	if (!password) return res.status(400).json({ error: "Missing password" });
	try {
		const data = await readData();
		if (password !== data.password) {
			return res.status(401).json({ error: "Wrong password" });
		}
		const token  = crypto.randomBytes(32).toString("hex");
		const expiry = Date.now() + SESSION_TTL;
		sessions.set(token, expiry);
		res.json({ token, expiresAt: expiry });
	} catch (e) {
		res.status(500).json({ error: "DB error" });
	}
});

app.post("/api/logout", (req, res) => {
	const header = req.headers["authorization"] || "";
	const token  = header.replace(/^Bearer\s+/i, "").trim();
	sessions.delete(token);
	res.json({ ok: true });
});

app.post("/api/data", requireAuth, async (req, res) => {
	try {
		const current = await readData();
		const { password, ...updates } = req.body || {};
		const merged = { ...current, ...updates, password: current.password };
		await writeData(merged);
		res.json({ ok: true });
	} catch (e) {
		res.status(500).json({ error: "DB error" });
	}
});

app.post("/api/changepassword", requireAuth, async (req, res) => {
	const { currentPassword, newPassword } = req.body || {};
	if (!newPassword || !newPassword.trim()) {
		return res.status(400).json({ error: "New password required" });
	}
	try {
		const data = await readData();
		if (currentPassword !== data.password) {
			return res.status(401).json({ error: "Current password wrong" });
		}
		data.password = newPassword.trim();
		await writeData(data);
		res.json({ ok: true });
	} catch (e) {
		res.status(500).json({ error: "DB error" });
	}
});

app.get("*", (_req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ─────────────────────────────────────────────
   Start
───────────────────────────────────────────── */
initDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`\n🐱 JustNeychii server running!`);
			console.log(`   → http://localhost:${PORT}\n`);
		});
	})
	.catch(err => {
		console.error("❌ Failed to connect to database:", err.message);
		process.exit(1);
	});
