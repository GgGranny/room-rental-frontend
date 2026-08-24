"use client"

import { HelpCircle, Search } from 'lucide-react'
import React from 'react'
import NotificationBell from '@/components/NotificationBell'
import ProfileDropdown from './ProfileDropdown'

export default function AdminNav() {
    return (
        <div>
            <header className="h-16 border-b border-slate-200/60 bg-white dark:border-slate-900 dark:bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-30">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search portfolio, bookings, or guests..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                </div>

                <div className="flex items-center gap-4 shrink-0 relative">
                    <NotificationBell />

                    <button className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition-all">
                        <HelpCircle className="w-4 h-4" />
                    </button>

                    <ProfileDropdown />
                </div>
            </header>
        </div>
    )
}
