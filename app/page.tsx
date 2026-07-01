import Link from "next/link";

export default function Home() {
  return (
    <main className="hero-bg flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="flex max-w-xl flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-serif text-5xl font-bold tracking-tight text-wello-dark-brown sm:text-6xl">
            Welcome to Wello
          </h1>
          <p className="text-lg leading-relaxed text-wello-grey-brown">
            A warm companion that welcomes families into a new chapter with
            personalized guidance, trusted resources, and everyday support.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="rounded-full bg-wello-yellow px-8 py-3 font-semibold text-wello-dark-brown transition-opacity hover:opacity-90"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-wello-grey-brown px-8 py-3 font-semibold text-wello-white transition-opacity hover:opacity-90"
          >
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
