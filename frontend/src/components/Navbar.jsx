// frontend/src/components/Navbar.jsx
export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="cursor-pointer text-2xl font-bold tracking-tight text-foreground">
          Flash<span className="text-gray-400">Tix</span>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-6">
          <button className="text-sm font-medium text-gray-500 transition hover:text-foreground">
            Log In
          </button>
          <button className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
