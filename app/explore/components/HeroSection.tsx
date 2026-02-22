"use client";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-background px-8 py-16 text-center sm:px-12 sm:py-20 md:px-16 md:py-24 explore-hero">
      <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
        Startups naciendo en 30 días
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary sm:text-xl">
        Descubre lo que builders están construyendo ahora mismo.
      </p>
    </section>
  );
}
