import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e8eef2] dark:border-gray-700 bg-surface-light dark:bg-surface-dark px-6 md:px-10 py-3 sticky top-0 z-50">
      <div className="flex items-center gap-4 text-primary">
        <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
          <span className="material-symbols-outlined text-2xl">health_and_safety</span>
        </div>
        <h2 className="text-[#0f151a] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
          XAI Health Risk System
        </h2>
      </div>

      <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
        <div className="flex items-center gap-9">
          <a className="text-primary text-sm font-semibold" href="#">Dashboard</a>
          <a className="text-[#537893] dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors" href="#">Patient History</a>
          <a className="text-[#537893] dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors" href="#">Settings</a>
        </div>
        <div className="h-6 w-px bg-[#e8eef2] dark:bg-gray-700 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-semibold text-[#0f151a] dark:text-white">Dr. Sarah Smith</p>
            <p className="text-xs text-[#537893] dark:text-gray-400">Cardiology Dept.</p>
          </div>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC80p9OC7MREJdGE6MsXzYKr6R_yNLPsPCUs2Q2wo7tsGzcJzyUM0AXY-jw4t8WEAz5TBkaYwP_Rxv4-FC8k4efq1dPL-fn874PHcESxZulQ_zi4vjJNqda1H6mpS8BYWG89P1rRx6ashQNpGAYifpC73CcVx5YdqYgC3a8lTA-4dhMW9ynVogLFip3H-MxO3V99p747CoqTULi-dlPTmpOyXgKrBbcFKVx52kIMhEMpdTsFOEBOhGsNBEUCLidUTpnuddwH4G_1vQ")' }}
          ></div>
        </div>
      </div>
      <button className="md:hidden p-2 text-[#537893] dark:text-gray-300">
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  );
};

export default Header;
