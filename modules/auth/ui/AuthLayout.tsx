import Link from "next/link";

export function AuthLayout({
  children,
  title,
  subtitle,
  footerLink,
  footerLabel,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerLink: string;
  footerLabel: string;
}) {
  return (
    <div className="w-full">
      <Link
        href="/"
        className="mb-6 inline-block font-semibold text-text-primary transition hover:opacity-90"
      >
        ← Mytsyy
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
        {title}
      </h1>
      <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
      <div className="mt-8">{children}</div>
      <p className="mt-6 text-center text-sm text-text-secondary">
        <Link href={footerLink} className="text-accent hover:underline">
          {footerLabel}
        </Link>
      </p>
    </div>
  );
}
