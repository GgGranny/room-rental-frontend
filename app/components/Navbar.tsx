import { Bell, Search, Settings, SlidersHorizontal } from "lucide-react";
import ThemeToggle from "./ToggleTheme";

export default function Navbar() {
    return (
        <nav>
            <nav className="w-full bg-white border-b border-slate-100 px-6 py-3.5 fixed top-0 z-50 flex items-center justify-between shadow-sm shadow-slate-100/40 dark:bg-slate-900 dark:border-slate-700/50 dark:shadow-slate-900/20 ">
                <ThemeToggle />
                <div className="flex items-center gap-12 flex-1">
                    {/* Logo */}
                    <span className="text-xl font-bold text-indigo-600 tracking-tight dark:text-indigo-400">RoomEase</span>

                    {/* Search Bar Container */}
                    <div className="relative w-full max-w-md hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Start your search..."
                            className="w-full pl-11 pr-12 py-2.5 bg-slate-50 border border-slate-200/80 rounded-full text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-slate-800 dark:border-slate-700/80 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-500 dark:text-slate-200"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-slate-100 rounded-full transition-colors">
                            <SlidersHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Mid & Right Nav elements */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
                        <button className="text-indigo-600 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600 dark:text-slate-300 dark:after:bg-indigo-400 dark:hover:text-white">Explore</button>
                        <button className="hover:text-slate-800 transition-colors dark:text-slate-300 dark:after:bg-indigo-400 dark:hover:text-white">My Bookings</button>
                        <button className="hover:text-slate-800 transition-colors dark:text-slate-300 dark:after:bg-indigo-400 dark:hover:text-white">Favorites</button>
                    </div>

                    <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 dark:hover:bg-slate-700 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                            <Bell className="w-5 h-5 dark:text-slate-300" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                        </button>
                        <button className="p-2 dark:hover:bg-slate-700 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                            <Settings className="w-5 h-5 dark:text-slate-300" />
                        </button>
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </nav>
        </nav>
    )
}