import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  School, 
  FileCheck2, 
  Award, 
  BarChart3, 
  LifeBuoy, 
  Sparkles, 
  HelpCircle, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { TeacherDashboardTab } from '../../types';

interface TeacherSidebarProps {
  activeTab: TeacherDashboardTab;
  onSelectTab: (tab: TeacherDashboardTab) => void;
  remedialCount: number;
  enrichmentCount: number;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

interface NavItem {
  id: TeacherDashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

export const TeacherSidebar: React.FC<TeacherSidebarProps> = ({
  activeTab,
  onSelectTab,
  remedialCount,
  enrichmentCount,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'students', label: 'Daftar Siswa', icon: Users },
    { id: 'classes', label: 'Kelas & Heatmap', icon: School },
    { id: 'assessment', label: 'Asesmen & Ujian', icon: FileCheck2 },
    { id: 'mastery', label: 'Mastery Domain', icon: Award },
    { id: 'analytics', label: 'Analitik & Error', icon: BarChart3 },
    { 
      id: 'remedial', 
      label: 'Pusat Remedial', 
      icon: LifeBuoy, 
      badge: remedialCount > 0 ? remedialCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    },
    { 
      id: 'enrichment', 
      label: 'Pengayaan', 
      icon: Sparkles,
      badge: enrichmentCount > 0 ? enrichmentCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    },
    { id: 'questions', label: 'Bank Soal', icon: HelpCircle },
    { id: 'settings', label: 'Pengaturan & Demo', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Bar Navigation Toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">MENU GURU:</span>
          <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">
            {navItems.find((n) => n.id === activeTab)?.label}
          </span>
        </div>
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white border border-slate-700"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown / Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 border-b border-slate-800 p-3 grid grid-cols-2 gap-2 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onToggleMobileMenu();
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ml-1 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-slate-900/80 border-r border-slate-800/80 p-4 space-y-1.5 min-h-[calc(100vh-65px)]">
        <div className="px-3 py-2 mb-1">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Navigasi Asesmen
          </p>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="mt-auto pt-4 border-t border-slate-800/60 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            Logic Escape v0.6
          </p>
          <p className="text-[10px] text-cyan-400/80 font-mono mt-0.5">
            Offline-Ready Local Storage
          </p>
        </div>
      </aside>
    </>
  );
};
