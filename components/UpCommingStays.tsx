"use client"

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// Define types for our stay data
interface Stay {
    id: string;
    propertyName: string;
    propertyImage: string;
    guestName: string;
    dates: string;
    status: 'CONFIRMED' | 'CHECKED IN' | 'UPCOMING';
}

const staysData: Stay[] = [
    {
        id: '1',
        propertyName: 'The Glass Pavilion',
        propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=150&q=80', // Replace with your actual assets
        guestName: 'Julianna Vance',
        dates: 'Oct 12 — Oct 18',
        status: 'CONFIRMED',
    },
    {
        id: '2',
        propertyName: 'Concrete Sanctuary',
        propertyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80',
        guestName: 'Marcus Thorne',
        dates: 'Oct 15 — Oct 22',
        status: 'CHECKED IN',
    },
    {
        id: '3',
        propertyName: 'Ochre Loft',
        propertyImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80',
        guestName: 'Elena Rossi',
        dates: 'Oct 20 — Oct 25',
        status: 'UPCOMING',
    },
];

export default function UpcomingStays() {
    // Helper to style status badges dynamically
    const getStatusStyles = (status: Stay['status']) => {
        switch (status) {
            case 'CONFIRMED':
                return 'bg-[#4ADE80] text-[#043418]';
            case 'CHECKED IN':
                return 'bg-[#2563EB] text-white';
            case 'UPCOMING':
                return 'bg-[#DBEAFE] text-[#1E40AF]';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="w-full max-w-4xl bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#0F2942]">Active & Upcoming Stays</h2>
                <a
                    href="#calendar"
                    className="flex items-center gap-1 text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                >
                    View Calendar
                    <ArrowRight className="w-4 h-4" />
                </a>
            </div>

            {/* Table Structure */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs font-bold tracking-widest text-gray-400 uppercase border-b border-gray-50">
                            <th className="pb-4 font-semibold w-2/5">Property</th>
                            <th className="pb-4 font-semibold w-1/5">Guest</th>
                            <th className="pb-4 font-semibold w-1/5">Dates</th>
                            <th className="pb-4 font-semibold w-1/5 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/60">
                        {staysData.map((stay) => (
                            <tr key={stay.id} className="group hover:bg-gray-50/50 transition-colors">
                                {/* Property Column */}
                                <td className="py-5 flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                                        <Image
                                            src={stay.propertyImage}
                                            alt={stay.propertyName}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    </div>
                                    <span className="font-semibold text-[#0F2942]">{stay.propertyName}</span>
                                </td>

                                {/* Guest Column */}
                                <td className="py-5 text-gray-600 font-medium">
                                    {stay.guestName}
                                </td>

                                {/* Dates Column */}
                                <td className="py-5 text-gray-600 font-medium">
                                    {stay.dates}
                                </td>

                                {/* Status Column */}
                                <td className="py-5 text-right">
                                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${getStatusStyles(stay.status)}`}>
                                        {stay.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}