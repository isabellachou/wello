import Link from "next/link";

export default function InfoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#FCF5E6] p-6">
      <h1 className="text-3xl font-semibold text-black">Info</h1>
      <p className="text-[#7C7167]">This page is coming soon.</p>
      <Link
        href="/welcome"
        className="rounded-full border-2 border-black bg-[#ECC363] px-5 py-2 font-medium text-black underline underline-offset-2 transition-colors hover:bg-[#F4FDAF]"
      >
        back
      </Link>
    </div>
  );
}
