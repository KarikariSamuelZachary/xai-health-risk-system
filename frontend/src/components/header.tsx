"use client";

import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  const handleComingSoon = (e: React.MouseEvent, feature: string) => {
    e.preventDefault();
    alert(`${feature} is currently under construction.`);
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e8eef2] dark:border-gray-700 bg-surface-light dark:bg-surface-dark px-6 md:px-10 py-3 sticky top-0 z-50">
      <div className="flex items-center gap-4 text-primary">
        <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
          <span className="text-sm font-bold uppercase tracking-[0.18em]">CR</span>
        </div>
        <h2 className="text-[#0f151a] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
          Clinical Risk Assessment Platform
        </h2>
      </div>

      <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
        <div className="flex items-center gap-9">
          <Link className="text-primary text-sm font-semibold" href="/">
            Dashboard
          </Link>
          <Link 
            className="text-[#537893] dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors" 
            href="/diabetes"
          >
            Diabetes
          </Link>
          <Link 
            className="text-[#537893] dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors" 
            href="/heart-disease"
          >
            Heart Disease
          </Link>
          <Link 
            className="text-[#537893] dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors" 
            href="/stroke"
          >
            Stroke
          </Link>
        </div>
        <div className="h-6 w-px bg-[#e8eef2] dark:bg-gray-700 mx-2"></div>
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center gap-3 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
            onClick={(e) => handleComingSoon(e, "User Profile")}
          >
            <div className="text-right hidden lg:block">
              <p className="text-xs font-semibold text-[#0f151a] dark:text-white">Guest User</p>
            </div>
            <div className="size-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full text-[#537893] ring-1 ring-gray-200 dark:ring-gray-700">
                <span className="text-xs font-bold uppercase tracking-[0.16em]">GU</span>
            </div>
          </div>
        </div>
      </div>
      <button className="md:hidden p-2 text-[#537893] dark:text-gray-300">
        <span className="text-xs font-bold uppercase tracking-[0.16em]">Menu</span>
      </button>
    </header>
  );
};

export default Header;
