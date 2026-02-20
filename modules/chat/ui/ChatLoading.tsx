export function ChatLoading() {
  return (
    <div className="flex gap-3 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
      <div className="flex items-center gap-1 rounded-2xl bg-surface px-4 py-2.5">
        <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:0.2s]"
        />
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:0.4s]"
        />
      </div>
    </div>
  );
}
