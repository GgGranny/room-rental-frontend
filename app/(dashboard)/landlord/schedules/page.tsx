"use client"

import { MyBigCalander } from '@/app/components/MyBigCalander'
import React from 'react'


export default function Schedules() {
    return (
        <div className='min-h-screen bg-transparent dark:bg-slate-950 flex font-sans antialiased text-slate-900 dark:text-slate-100'>
            <div className='min-h-full w-full flex-1 flex flex-col min-w-0'>
                <main className="h-full p-6 max-w-[1400px] w-full mx-auto space-y-6">
                    <div>
                        <h1 className="text-gray-800 font-inter-tight font-bold text-lg">Upcomming Events</h1>
                        <p className='text-xs text-gray-500'>view your recent events</p>
                    </div>
                    <MyBigCalander />
                </main>
            </div>
        </div>
    )
}
