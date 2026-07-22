"use client"

import { Bell, HelpCircle, Search } from 'lucide-react'
import React from 'react'

export default function AdminNav() {
    return (
        <div>
            <header className="h-16 border-b border-slate-200/60 bg-white dark:border-slate-900 dark:bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-30">
                {/* Search Inputs Frame */}
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search portfolio, bookings, or guests..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                </div>

                {/* User Identity Utility Tray */}
                <div className="flex items-center gap-4 shrink-0">
                    <button className="p-2 rounded-xl border border-slate-150 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 relative transition-all">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    </button>
                    <button className="p-2 rounded-xl border border-slate-150 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition-all">
                        <HelpCircle className="w-4 h-4" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                            alt="Account Holder Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </header>
        </div>
    )
}
