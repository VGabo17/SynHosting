import { Logo } from "@/components/brand";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="glow-grid flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Logo />
      <div className="mt-8 w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur">
        {children}
      </div>
    </div>
  );
}
