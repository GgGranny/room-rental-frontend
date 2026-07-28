"use client";

import { Calendar, ShieldAlert, Zap, Share2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface BookingCardProps {
  pricing: {
    monthlyRate: number;
    baseRent: number;
    securityDeposit: number;
    maintenanceFee: number;
  };
}

export function BookingCard({ pricing }: BookingCardProps) {
  const totalInitial = pricing.baseRent + pricing.securityDeposit + pricing.maintenanceFee;

  return (
    <div className="space-y-4">
      <div className="space-y-5 rounded-[18px] border border-slate-200 bg-white p-6 shadow-2xl transition-colors duration-300 dark:border-[#2C2C33] dark:bg-[#15151A]">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              ${pricing.monthlyRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">per billing cycle (monthly)</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-[#9CA3AF]">
            <Zap className="h-3.5 w-3.5 fill-slate-500 dark:fill-[#9CA3AF]" />
            <span>Instant Book</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-slate-300 dark:border-[#2C2C33] dark:bg-[#1D1D23] dark:hover:border-[#2C2C33]/80">
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-500 dark:text-[#9CA3AF]">Move-in Date</p>
              <p className="text-xs font-medium text-slate-900 dark:text-white">OCT 12, 2026</p>
            </div>
            <Calendar className="h-4 w-4 text-slate-500 dark:text-[#9CA3AF]" />
          </div>

          <div className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-slate-300 dark:border-[#2C2C33] dark:bg-[#1D1D23] dark:hover:border-[#2C2C33]/80">
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-500 dark:text-[#9CA3AF]">Initial Duration</p>
              <p className="text-xs font-medium text-slate-900 dark:text-white">12 Months (Minimum)</p>
            </div>
            <ShieldAlert className="h-4 w-4 text-slate-500 dark:text-[#9CA3AF]" />
          </div>
        </div>

        <div className="space-y-2 pt-1 text-xs">
          <div className="flex justify-between text-slate-500 dark:text-[#9CA3AF]">
            <span>Base Monthly Rent</span>
            <span className="text-slate-900 dark:text-white">${pricing.baseRent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-[#9CA3AF]">
            <span>Security Deposit (Refundable)</span>
            <span className="text-slate-900 dark:text-white">${pricing.securityDeposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-[#9CA3AF]">
            <span>Maintenance Levy</span>
            <span className="text-slate-900 dark:text-white">${pricing.maintenanceFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-[#2C2C33]" />

        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-slate-900 dark:text-white">Total Initial</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            ${totalInitial.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full rounded-xl bg-[#6C5CE7] py-3.5 text-xs font-bold text-white shadow-lg transition-colors hover:bg-[#7C6FFF] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
        >
          Proceed to Booking
        </motion.button>

        <p className="text-center text-[10px] text-slate-500 dark:text-[#6B7280]">
          By booking, you agree to our curation standards and background verification process.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50 dark:border-[#2C2C33] dark:bg-[#15151A] dark:text-white dark:hover:bg-[#1D1D23]">
          <Share2 className="h-3.5 w-3.5 text-slate-500 dark:text-[#9CA3AF]" />
          <span>Share Listing</span>
        </button>
        <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50 dark:border-[#2C2C33] dark:bg-[#15151A] dark:text-white dark:hover:bg-[#1D1D23]">
          <AlertCircle className="h-3.5 w-3.5 text-slate-500 dark:text-[#9CA3AF]" />
          <span>Report Issue</span>
        </button>
      </div>
    </div>
  );
}