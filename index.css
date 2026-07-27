import React from 'react';
import { Camera, Award, Gamepad2, HelpCircle, Leaf, Flame, Sparkles } from 'lucide-react';
import { UserEcoProfile } from '../types';

interface HeaderProps {
  activeTab: 'camera' | 'reward' | 'game' | 'guide';
  setActiveTab: (tab: 'camera' | 'reward' | 'game' | 'guide') => void;
  userProfile: UserEcoProfile;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 text-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('camera')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-sky-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-emerald-600 rounded-[14px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-emerald-800 italic">
                  GreenScan
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold">
                에코파인더 • 스마트 분리수거
              </p>
            </div>
          </div>

          {/* User Points & Streak Pill */}
          <div className="flex items-center gap-2">
            <div
              onClick={() => setActiveTab('reward')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 hover:bg-orange-200/80 cursor-pointer transition-colors shadow-sm"
              title="에코 마일리지 보상 샵 이동"
            >
              <Sparkles className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-xs font-extrabold text-orange-600">
                {userProfile.points.toLocaleString()} P
              </span>
            </div>

            <div
              onClick={() => setActiveTab('reward')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-xs font-extrabold text-emerald-800 cursor-pointer hover:bg-emerald-200/70 transition-colors shadow-sm"
              title="연속 분리수거 인증 출석일"
            >
              <Flame className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>{userProfile.streakDays}일 연속 인증</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center justify-around sm:justify-start sm:gap-2 pt-1 pb-2 border-t border-emerald-50/80 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'camera'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>AI 카메라 인식</span>
          </button>

          <button
            onClick={() => setActiveTab('reward')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'reward'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>인증 & 보상받기</span>
          </button>

          <button
            onClick={() => setActiveTab('game')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'game'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>분리수거 게임</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'guide'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Q&A 가이드봇</span>
            <span className="sm:hidden">가이드</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
