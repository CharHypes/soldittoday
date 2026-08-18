/**
 * RelocationArt ... a branded illustration for the Relocation hero.
 *
 * Shows a dashed route arcing from an origin pin (with moving boxes) to a pin
 * dropped on the Michigan mitten. Communicates "relocating from another place to
 * Southeast Michigan" at a glance. Pure inline SVG, no external assets, reads on
 * both light and dark themes because the framed card carries its own dark ground.
 */
export default function RelocationArt() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:ml-auto lg:mr-0">
      <div
        className="aurora-ring overflow-hidden rounded-xl2 border border-auroraMauve/25 shadow-aurora"
        style={{
          background:
            "radial-gradient(120% 120% at 25% 0%, #3d2530 0%, #241820 55%, #17131a 100%)",
        }}
      >
        <svg
          viewBox="0 0 400 320"
          className="block h-auto w-full"
          role="img"
          aria-label="A route leading to a pin dropped on Southeast Michigan"
        >
          <title>Relocating to Southeast Michigan</title>
          <defs>
            <linearGradient id="mitten" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#e0b0a0" stopOpacity="0.9" />
              <stop offset="1" stopColor="#7c5c69" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="pin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ecc39b" />
              <stop offset="1" stopColor="#c99383" />
            </linearGradient>
            <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#e0b0a0" stopOpacity="0.55" />
              <stop offset="1" stopColor="#e0b0a0" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* faint map latitude lines */}
          <g stroke="rgba(243,233,236,0.06)" strokeWidth="1" fill="none">
            <path d="M20 90 C 140 70, 260 110, 384 84" />
            <path d="M16 160 C 150 145, 250 180, 388 156" />
            <path d="M20 234 C 140 220, 270 250, 384 228" />
          </g>

          {/* Upper Peninsula sliver */}
          <path
            d="M214 60 C 232 50, 258 50, 276 54 C 292 58, 304 54, 302 62 C 288 68, 258 66, 236 66 C 224 66, 212 68, 214 60 Z"
            fill="url(#mitten)"
            opacity="0.45"
          />

          {/* Michigan Lower Peninsula (stylized mitten) */}
          <path
            d="M236 82 C 232 100, 232 122, 234 150 C 235 178, 244 214, 270 232
               C 292 247, 316 240, 324 214 C 329 198, 328 186, 330 174
               C 332 166, 340 164, 347 167 C 356 171, 362 162, 357 153
               C 353 146, 343 147, 337 151 C 332 154, 329 151, 329 144
               C 329 124, 326 102, 320 88 C 314 76, 300 72, 284 74
               C 267 76, 250 76, 236 82 Z"
            fill="url(#mitten)"
            stroke="rgba(243,233,236,0.25)"
            strokeWidth="1.5"
          />

          <text
            x="286"
            y="150"
            textAnchor="middle"
            fontSize="11"
            letterSpacing="2.5"
            fill="rgba(23,19,26,0.55)"
            fontFamily="system-ui, sans-serif"
            fontWeight="700"
          >
            MICHIGAN
          </text>

          {/* Route arc from origin to destination */}
          <path
            d="M76 250 C 120 150, 235 120, 305 200"
            fill="none"
            stroke="#e0b0a0"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="2 9"
            opacity="0.85"
          />
          {/* traveling marker (static) */}
          <circle cx="215" cy="132" r="4" fill="#f3e9ec" opacity="0.9" />

          {/* Origin: moving boxes + pin (lower left) */}
          <g stroke="rgba(243,233,236,0.4)" strokeWidth="1.5" fill="rgba(243,233,236,0.05)">
            <rect x="44" y="262" width="26" height="22" rx="2" />
            <path d="M44 270 H70" opacity="0.7" />
            <rect x="74" y="270" width="20" height="16" rx="2" />
          </g>
          <path
            d="M74 232 C 67 232 62 237 62 243 C 62 251 74 262 74 262 C 74 262 86 251 86 243 C 86 237 81 232 74 232 Z"
            fill="#7c5c69"
            stroke="rgba(243,233,236,0.25)"
            strokeWidth="1"
          />
          <circle cx="74" cy="243" r="4.5" fill="#17131a" />

          {/* Destination: glowing pin dropped on Southeast Michigan */}
          <circle cx="305" cy="204" r="30" fill="url(#glow)" className="animate-pulse" />
          <path
            d="M305 176 C 296 176 289 183 289 191 C 289 202 305 218 305 218 C 305 218 321 202 321 191 C 321 183 314 176 305 176 Z"
            fill="url(#pin)"
            stroke="rgba(243,233,236,0.35)"
            strokeWidth="1"
          />
          {/* tiny key head inside the pin */}
          <circle cx="305" cy="190" r="4.5" fill="#17131a" />
          <rect x="303.6" y="190" width="2.8" height="8" rx="1" fill="#17131a" />
        </svg>
      </div>
    </div>
  );
}
