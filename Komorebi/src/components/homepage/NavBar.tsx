import { Search, Heart, Bell, ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router";
import NotificationMenu from "./NotificationMenu";
export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="absolute top-0 left-0 w-full bg-transparent z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center gap-6">
          <div>
            <button
              className="text-[var(--komorebi-yellow)] text-2xl font-bold hover:text-[var(--komorebi-black)] transition-colors"
              onClick={() => navigate("/")}
            >
              Komorebi
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-sm text-[var(--komorebi-black)] ml-10">
            <button className="hover:text-[var(--komorebi-yellow)] transition-colors font-medium">Categories</button>
            <button className="hover:text-[var(--komorebi-yellow)] transition-colors font-medium">Sell</button>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex items-center bg-[var(--komorebi-gray)] rounded-full px-4 py-2 w-1/2 sm:w-1/3">
          <Search size={18} className="text-[var(--komorebi-black)]/70" />
          <input
            type="text"
            placeholder="Search for snacks..."
            className="ml-2 w-full bg-transparent outline-none placeholder:text-[var(--komorebi-black)]/50 text-sm"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5 text-[var(--komorebi-black)]">
          <Heart
            size={22}
            className="cursor-pointer hover:text-[var(--komorebi-yellow)] transition-colors"
          />
          <NotificationMenu />

          <ShoppingCart
            size={22}
            className="cursor-pointer hover:text-[var(--komorebi-yellow)] transition-colors"
          />
          <User
            size={22}
            className="cursor-pointer hover:text-[var(--komorebi-yellow)] transition-colors"
          />
        </div>
      </div>
    </nav>
  );
}
