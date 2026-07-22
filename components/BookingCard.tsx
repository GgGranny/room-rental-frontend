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
      <div className="rounded-[18px] border border-[#2C2C33] bg-[#15151A] p-6 space-y-5 shadow-2xl">
        {/* Header Price */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-3xl font-bold text-white tracking-tight">
              ${pricing.monthlyRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-[#9CA3AF]">per billing cycle (monthly)</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-[#9CA3AF]">
            <Zap className="h-3.5 w-3.5 fill-[#9CA3AF]" />
            <span>Instant Book</span>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-[#2C2C33] bg-[#1D1D23] p-3 cursor-pointer hover:border-[#2C2C33]/80">
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase font-semibold">Move-in Date</p>
              <p className="text-xs font-medium text-white">OCT 12, 2026</p>
            </div>
            <Calendar className="h-4 w-4 text-[#9CA3AF]" />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#2C2C33] bg-[#1D1D23] p-3 cursor-pointer hover:border-[#2C2C33]/80">
            <div>
              <p className="text-[10px] text-[#9CA3AF] uppercase font-semibold">Initial Duration</p>
              <p className="text-xs font-medium text-white">12 Months (Minimum)</p>
            </div>
            <ShieldAlert className="h-4 w-4 text-[#9CA3AF]" />
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-2 text-xs pt-1">
          <div className="flex justify-between text-[#9CA3AF]">
            <span>Base Monthly Rent</span>
            <span className="text-white">${pricing.baseRent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-[#9CA3AF]">
            <span>Security Deposit (Refundable)</span>
            <span className="text-white">${pricing.securityDeposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-[#9CA3AF]">
            <span>Maintenance Levy</span>
            <span className="text-white">${pricing.maintenanceFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <hr className="border-[#2C2C33]" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-white">Total Initial</span>
          <span className="text-xl font-bold text-white">
            ${totalInitial.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full rounded-xl bg-[#6C5CE7] py-3.5 text-xs font-bold text-white shadow-lg transition-colors hover:bg-[#7C6FFF] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
        >
          Proceed to Booking
        </motion.button>

        <p className="text-[10px] text-center text-[#6B7280]">
          By booking, you agree to our curation standards and background verification process.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 rounded-xl border border-[#2C2C33] bg-[#15151A] py-2.5 text-xs font-medium text-white transition-all hover:bg-[#1D1D23]">
          <Share2 className="h-3.5 w-3.5 text-[#9CA3AF]" />
          <span>Share Listing</span>
        </button>
        <button className="flex items-center justify-center gap-2 rounded-xl border border-[#2C2C33] bg-[#15151A] py-2.5 text-xs font-medium text-white transition-all hover:bg-[#1D1D23]">
          <AlertCircle className="h-3.5 w-3.5 text-[#9CA3AF]" />
          <span>Report Issue</span>
        </button>
      </div>
    </div>
  );
}