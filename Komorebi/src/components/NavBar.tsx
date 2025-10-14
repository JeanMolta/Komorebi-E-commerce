import { Search, Heart, Bell, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-komorebi-offwhite border-b border-komorebi-gray px-8 py-6">
      {/* Logo and Links */}
      <div className="flex items-center gap-8">
        <h1 className="font-simonetta text-komorebi-yellow text-2xl">Komorebi</h1>
        <div className="hidden sm:flex items-center gap-4 font-sf text-sm text-komorebi-black">
          <button className="p-2 hover:text-komorebi-yellow transition-colors">Categories</button>
          <button className="p-2 hover:text-komorebi-yellow transition-colors">Sell</button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center w-1/2 sm:w-1/3 bg-komorebi-gray rounded-full px-4 py-2">
        <Search size={18} className="text-komorebi-black opacity-70" />
        <input
          type="text"
          placeholder="Search for snacks..."
          className="ml-2 w-full bg-transparent outline-none placeholder:text-komorebi-black/50 text-sm font-sf"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-6 text-komorebi-black">
        <Heart
          size={22}
          className="cursor-pointer hover:text-komorebi-yellow transition-colors"
        />
        <Bell
          size={22}
          className="cursor-pointer hover:text-komorebi-yellow transition-colors"
        />
        <ShoppingCart
          size={22}
          className="cursor-pointer hover:text-komorebi-yellow transition-colors"
        />
        <User
          size={22}
          className="cursor-pointer hover:text-komorebi-yellow transition-colors"
        />
      </div>
    </nav>
  );
}
