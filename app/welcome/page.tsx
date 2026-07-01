import Link from "next/link";
import { Source_Serif_4 } from "next/font/google";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600"],
});

const PLACEHOLDER_USERNAME = "Friend";

const noiseSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
const noiseBackgroundImage = `url("data:image/svg+xml,${encodeURIComponent(noiseSvg)}")`;

export default function WelcomePage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_#FDFBF1_0%,_#F5EBCE_45%,_#E2CFA0_100%)] p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
        style={{ backgroundImage: noiseBackgroundImage }}
      />

      <div className="relative z-10 flex -translate-y-16 flex-col items-center gap-10 text-center">
        <h1
          className={`${sourceSerif.className} text-7xl font-semibold text-[#53453B]`}
        >
          Wello,
        </h1>

        <p className="text-lg tracking-widest text-[#53453B]/70">
          [{PLACEHOLDER_USERNAME.toUpperCase()}]
        </p>

        <div className="flex items-center gap-6">
          <Link
            href="/info"
            className="rounded-full bg-[#F8FECE] px-10 py-4 font-medium text-[#53453B] transition-colors hover:bg-[#F8FECE]/80"
          >
            Dashboard
          </Link>

          <Link
            href="/chat"
            className="rounded-full bg-[#7C7167]/50 px-10 py-4 font-medium text-[#53453B] transition-colors hover:bg-[#7C7167]/65"
          >
            Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
