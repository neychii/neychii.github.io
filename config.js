/* ================================================================
   ✏️  NEYCHII SITE — CONFIG FILE
   Edit this file to customize everything on your site.
   No server needed — just save and refresh!
================================================================ */

const SITE_CONFIG = {

  /* ──────────────────────────────────────────
     👤 PROFILE
  ────────────────────────────────────────── */
  profile: {
    name:     "JustNeychii",
    username: "CHEEZEBORGIR",
    bio:      "Unserious silly goober that meows randomly and my food goes blub blub blub 🐟 ( ironically i hate seafood XD )<br/><br/>Puple Cat | 19 | MDNI!!"
  },

  /* ──────────────────────────────────────────
     🏷️ TAGS
     Add or remove tags as you like.
  ────────────────────────────────────────── */
  tags: ["VRChat", "EN", "Photographer", "Music Addict", "Foodie Devourer", "Femboy", "Cat Boy"],

  /* ──────────────────────────────────────────
     🎮 CHIPS (the small info pills on your card)
     gender index:  0=Femboy  1=Female  2=Male  3=Non-binary
     age    index:  0=18+     1=13+     2=All Ages
     mic:           "on" or "off"
     device index:  0=Desktop 1=Mobile  2=VR    3=Quest
  ────────────────────────────────────────── */
  chips: {
    gender: 0,
    age:    0,
    mic:    "on",
    device: 0
  },

  /* ──────────────────────────────────────────
     🏅 RANK BADGE (VRChat rank)
     0=Visitor  1=New User  2=User  3=Known User  4=Trusted User
  ────────────────────────────────────────── */
  rank: 4,

  /* ──────────────────────────────────────────
     🟢 STATUS (which dot is highlighted)
     Options: "alone" | "online" | "movie" | "busy"
  ────────────────────────────────────────── */
  status: "online",

  /* ──────────────────────────────────────────
     💭 ROTATING STATUS QUOTES
     These cycle in the little status bar.
  ────────────────────────────────────────── */
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

  /* ──────────────────────────────────────────
     ❤️ LIKES & DISLIKES PILLS
     type: "like" (green) | "ask" (yellow) | "ng" (red)
  ────────────────────────────────────────── */
  ld: [
    { label: "Headpats",   type: "like" },
    { label: "Music",      type: "like" },
    { label: "Kebab",     type: "like" },
    { label: "Cuddle/Hug", type: "ask"  },
    { label: "Kisses",     type: "ask"  },
    { label: "Grab Me Up", type: "ng"   }
  ],

  /* ──────────────────────────────────────────
     🗓️ SCHEDULE
  ────────────────────────────────────────── */
  schedule: {
    day:  "Saturday",
    time: "19:00 ~ 04:00"
  },

  /* ──────────────────────────────────────────
     🖼️ IMAGES
     Use local paths like "./Assets/Images/art.png"
     or full URLs like "https://cdn.discordapp.com/..."
     Leave as "" to use the default local file.
  ────────────────────────────────────────── */
  images: {
    art: "",      // Main character art / avatar
    p1:  "",      // Polaroid top-left
    p2:  "",      // Polaroid top-right
    p3:  "",      // Polaroid bottom-left
    p4:  ""       // Polaroid bottom-right
  },

  /* ──────────────────────────────────────────
     🎵 PLAYLIST
     src: path to the audio file (local or URL)
     link: clickable link (Spotify / SoundCloud / etc.)
  ────────────────────────────────────────── */
  playlist: [
    { title: "Despite Everything, It Is Still Me", artist: "LuvBytes404",               src: "./Assets/Audios/audio.mp3",  link: "https://soundcloud.com/luvbytes404/despite-everything-it-is-still-me" },
    { title: "Limerence",                          artist: "angelize, ft. Lilycat",     src: "./Assets/Audios/audio3.mp3", link: "https://open.spotify.com/track/5TEOhfxU5KP5lZApP1psga" },
    { title: "Kill me with a lie",                 artist: "angelize",                  src: "./Assets/Audios/audio4.mp3", link: "https://open.spotify.com/track/6H2egbHEnfpGQgWGTA4icy" },
    { title: "under the sky",                      artist: "coco., ft. Lil Chili",      src: "./Assets/Audios/audio6.mp3", link: "https://open.spotify.com/track/1SY9IArHB4QtiX37o4mOg7" },
    { title: "Seasons",                            artist: "Alohaii, ft. Shiki Myokino",src: "./Assets/Audios/audio2.mp3", link: "https://soundcloud.com/lonealphamusic/seasons" },
    { title: "Tell Me",                            artist: "coco., ft. Lil Chili",      src: "./Assets/Audios/audio7.mp3", link: "https://open.spotify.com/track/14ar0JOH3XfT9AJWRlganR" },
    { title: "3edw",                               artist: "angelize",                  src: "./Assets/Audios/audio8.mp3", link: "https://open.spotify.com/track/2QPSTJZuLHo3dQSjOVioUf" },
    { title: "Looking For Me",                     artist: "Itoguruma, ft. Lil Chili",  src: "./Assets/Audios/audio9.mp3", link: "https://open.spotify.com/track/575k01Ql5iqK5aR9kIv0Kw" },
    { title: "Hobbies",                            artist: "Aleyna Moon",               src: "./Assets/Audios/audio5.mp3", link: "https://open.spotify.com/track/7evB1jJ0cK4ZYUeVGUDhQf" }
  ],

  /* ──────────────────────────────────────────
     🖼️ GALLERY
     sfw:  number of SFW slides  (named t_slide1.png, t_slide2.png, ...)
     nsfw: number of NSFW slides (named t_NsfwSlide1.png, t_NsfwSlide2.png, ...)
     Full-size images follow the same pattern without "t_".
  ────────────────────────────────────────── */
  gallery: {
    sfw:  23,
    nsfw: 8
  },

  /* ──────────────────────────────────────────
     📝 ABOUT ME  (the info card at the bottom)
     Write each bullet as a string in the array.
  ────────────────────────────────────────── */
  aboutMe: [
    "Name: Neychii",
    "Age: 19 / 6th November",
    "Height / Weight: 164cm / 42kg",
    "Pronouns: Any",
    "Country: Indonesia",
    "Fav food: Kebab & Burger or anything that's sweet or spicy",
    "Fav music genre: Hyperpop, Brazilian Funk, Metal/Nu-Metal, AltRock/Rock and R&B",
    "Hobbies: VRChat&Unity, Photography, Music and Reading"
  ]

};
