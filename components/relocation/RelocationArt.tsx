/**
 * RelocationArt ... a branded illustration for the Relocation hero.
 *
 * A dashed route arcs from an origin pin (with moving boxes) to a pin dropped on
 * Southeast Michigan. Michigan is drawn as a recognizable two-peninsula
 * silhouette: the Lower Peninsula mitten (with thumb and Saginaw Bay notch) and
 * the Upper Peninsula (with the Keweenaw hook). Pure inline SVG, no external
 * assets, reads on both themes because the framed card carries its own ground.
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
              <stop offset="0" stopColor="#e0b0a0" stopOpacity="0.92" />
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
            <path d="M20 96 C 140 78, 260 112, 384 90" />
            <path d="M16 168 C 150 152, 250 186, 388 162" />
            <path d="M20 238 C 140 224, 270 252, 384 232" />
          </g>

          <g transform="translate(14 18) scale(0.9)">
          {/* Upper Peninsula (with Keweenaw hook) */}
          <path
            d="M150 86
               C 146 78, 152 71, 163 71
               C 178 70, 196 72, 210 68
               C 220 65, 226 54, 236 46
               C 241 42, 249 43, 248 51
               C 247 58, 239 63, 231 66
               C 248 65, 272 64, 292 66
               C 310 68, 326 71, 335 79
               C 339 83, 334 89, 325 89
               C 288 91, 200 92, 172 92
               C 160 92, 153 91, 150 86 Z"
            fill="url(#mitten)"
            stroke="rgba(243,233,236,0.22)"
            strokeWidth="1.25"
            opacity="0.9"
          />

          {/* Lower Peninsula (mitten): thumb + Saginaw Bay notch */}
          <path
            d="M228 104
               C 255 98, 283 100, 300 108
               C 309 113, 313 123, 314 133
               C 321 132, 329 128, 335 134
               C 340 139, 335 149, 326 148
               C 319 147, 316 141, 311 144
               C 307 148, 306 155, 307 162
               C 302 156, 296 156, 296 165
               C 297 179, 305 193, 308 208
               C 310 222, 307 234, 300 240
               C 285 246, 260 244, 244 240
               L 214 240
               C 210 214, 206 168, 210 140
               C 212 122, 217 111, 228 104 Z"
            fill="url(#mitten)"
            stroke="rgba(243,233,236,0.28)"
            strokeWidth="1.5"
          />

          <text
            x="252"
            y="182"
            textAnchor="middle"
            fontSize="10.5"
            letterSpacing="2.5"
            fill="rgba(23,19,26,0.5)"
            fontFamily="system-ui, sans-serif"
            fontWeight="700"
          >
            MICHIGAN
          </text>

          {/* Route arc from origin to the destination pin */}
          <path
            d="M76 252 C 120 168, 226 150, 294 214"
            fill="none"
            stroke="#e0b0a0"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="2 9"
            opacity="0.85"
          />
          <circle cx="196" cy="150" r="4" fill="#f3e9ec" opacity="0.9" />

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

          {/* Destination: glowing pin on Southeast Michigan */}
          <circle cx="296" cy="212" r="28" fill="url(#glow)" className="animate-pulse" />
          <path
            d="M296 188 C 287 188 280 195 280 203 C 280 214 296 228 296 228 C 296 228 312 214 312 203 C 312 195 305 188 296 188 Z"
            fill="url(#pin)"
            stroke="rgba(243,233,236,0.35)"
            strokeWidth="1"
          />
          <circle cx="296" cy="202" r="4.5" fill="#17131a" />
          <rect x="294.6" y="202" width="2.8" height="8" rx="1" fill="#17131a" />
          </g>
        </svg>
      </div>
    </div>
  );
}
