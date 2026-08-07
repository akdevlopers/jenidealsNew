'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'
import logoImg from '../../assets/logo.png'

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const handleStartChat = () => {
    window.open("https://wa.me/971545320252?text=Hello%20Jeni%20Deals%20Support", "_blank")
  }

  return (
    <div className="fixed z-[99999] right-4 bottom-20 lg:right-6 lg:bottom-6 flex flex-col items-end">
      {/* Popover Window */}
      {isOpen && (
        <div className="mb-4 w-[290px] rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden animate-fade-in duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <Image
                    src={logoImg}
                    alt="Jeni Deals Logo"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-emerald-600 rounded-full animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-xs leading-tight">Jeni Deals Support</h4>
                <p className="text-[10px] text-white/80 mt-0.5">Online • Replies in minutes</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Message Bubble */}
          <div className="p-4 bg-gray-50/50 flex flex-col justify-end text-left min-h-[80px]">
            <div className="bg-white rounded-xl rounded-tl-none p-3 text-[11px] font-semibold text-gray-700 shadow-sm border border-gray-100 max-w-[85%] self-start leading-relaxed">
              Hi there! 👋 How can we help you today?
            </div>
          </div>

          {/* Action button */}
          <div className="p-3 bg-white border-t border-gray-100">
            <button
              onClick={handleStartChat}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-2.5 text-xs font-bold text-white shadow-md active:scale-[0.98] transition-all hover:shadow-lg shadow-emerald-500/10 outline-none"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.8.001-2.615-1.013-5.074-2.855-6.918C16.38 2.04 13.916.988 11.3 1.002c-5.401.003-9.804 4.399-9.807 9.806-.001 1.62.455 3.202 1.32 4.61l-.995 3.635 3.729-.977c1.424.775 2.78 1.157 4.51 1.158zm11.083-7.461c-.302-.15-1.788-.882-2.057-.981-.269-.099-.465-.149-.661.15-.196.299-.757.981-.928 1.18-.172.2-.344.225-.646.075-.302-.15-1.274-.469-2.427-1.496-.897-.801-1.502-1.791-1.678-2.091-.176-.3-.019-.462.13-.611.135-.134.302-.351.454-.526.15-.175.2-.299.301-.498.101-.2.05-.376-.025-.526-.075-.15-.661-1.593-.906-2.191-.238-.575-.48-.497-.661-.506-.171-.007-.367-.008-.564-.008-.196 0-.514.074-.783.374-.269.299-1.027 1.007-1.027 2.456 0 1.449 1.053 2.848 1.201 3.048.147.2 2.073 3.166 5.02 4.445.702.304 1.25.486 1.677.621.705.224 1.346.193 1.854.117.564-.085 1.788-.731 2.04-.14c.253-.37.253-1.31 0-1.46-.05-.15-.246-.3-.548-.45z" />
              </svg>
              <span>Start Chat</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 shadow-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 relative group outline-none"
        aria-label="Toggle chat support"
      >
        {/* Glow pulsing ring behind the button */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping opacity-75" />
        
        {/* Inner logo icon */}
        <svg className="h-6 w-6 fill-current text-white relative z-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.8.001-2.615-1.013-5.074-2.855-6.918C16.38 2.04 13.916.988 11.3 1.002c-5.401.003-9.804 4.399-9.807 9.806-.001 1.62.455 3.202 1.32 4.61l-.995 3.635 3.729-.977c1.424.775 2.78 1.157 4.51 1.158zm11.083-7.461c-.302-.15-1.788-.882-2.057-.981-.269-.099-.465-.149-.661.15-.196.299-.757.981-.928 1.18-.172.2-.344.225-.646.075-.302-.15-1.274-.469-2.427-1.496-.897-.801-1.502-1.791-1.678-2.091-.176-.3-.019-.462.13-.611.135-.134.302-.351.454-.526.15-.175.2-.299.301-.498.101-.2.05-.376-.025-.526-.075-.15-.661-1.593-.906-2.191-.238-.575-.48-.497-.661-.506-.171-.007-.367-.008-.564-.008-.196 0-.514.074-.783.374-.269.299-1.027 1.007-1.027 2.456 0 1.449 1.053 2.848 1.201 3.048.147.2 2.073 3.166 5.02 4.445.702.304 1.25.486 1.677.621.705.224 1.346.193 1.854.117.564-.085 1.788-.731 2.04-.14c.253-.37.253-1.31 0-1.46-.05-.15-.246-.3-.548-.45z" />
        </svg>
      </button>
    </div>
  )
}
