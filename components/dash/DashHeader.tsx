import { signOut } from "@/app/dashboard/actions";

export default function DashHeader() {
  return (
    <header className="border-b border-dusty/12 bg-plum/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="/dashboard" className="text-sm font-semibold uppercase tracking-[0.18em] text-pearl">
          Sold It Today <span className="text-dusty">· Dashboard</span>
        </a>
        <nav className="flex items-center gap-5">
          <a href="/dashboard" className="text-sm text-dusty transition-colors hover:text-pearl">Listings</a>
          <a href="/dashboard/buyers" className="text-sm text-dusty transition-colors hover:text-pearl">Buyers</a>
          <form action={signOut}>
            <button type="submit" className="text-xs text-dusty transition-colors hover:text-pearl">
              Sign out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
