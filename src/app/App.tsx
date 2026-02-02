import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday, isFuture } from 'date-fns';
import { ChevronLeft, ChevronRight, Settings, Plus, Trophy, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { cn } from '@/lib/utils';
import { HabitTabs } from '@/app/components/habit-tabs';
import { HabitGrid } from '@/app/components/habit-grid';
import { StatusPicker } from '@/app/components/status-picker';

export type HabitLevel = 0 | 1 | 2 | 3;

export interface Habit {
  id: string;
  name: string;
  levels: [string, string, string];
  data: Record<string, HabitLevel>;
  color: string;
}

const DEFAULT_HABITS: Habit[] = [
  {
    id: '1',
    name: '공부',
    levels: ['10분', '1시간', '3시간'],
    data: {},
    color: '#3b82f6', // blue
  },
  {
    id: '2',
    name: '운동',
    levels: ['스트레칭', '30분', '1시간'],
    data: {},
    color: '#10b981', // emerald
  },
  {
    id: '3',
    name: '독서',
    levels: ['5페이지', '20페이지', '1시간'],
    data: {},
    color: '#f59e0b', // amber
  },
];

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habit-tracker-data');
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });
  const [activeHabitId, setActiveHabitId] = useState(habits[0].id);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    localStorage.setItem('habit-tracker-data', JSON.stringify(habits));
  }, [habits]);

  const activeHabit = habits.find((h) => h.id === activeHabitId) || habits[0];

  const calculateStreak = (habit: Habit) => {
    let streak = 0;
    let checkDate = new Date();
    
    // Start checking from today backwards
    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      if (habit.data[dateStr] && habit.data[dateStr] > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If it's today and not recorded yet, don't break the streak immediately
        // unless yesterday was also not recorded.
        if (isToday(checkDate)) {
          checkDate.setDate(checkDate.getDate() - 1);
          const yesterdayStr = format(checkDate, 'yyyy-MM-dd');
          if (!habit.data[yesterdayStr] || habit.data[yesterdayStr] === 0) {
            break;
          }
        } else {
          break;
        }
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak(activeHabit);
  const monthlyCount = Object.entries(activeHabit.data).filter(([date, level]) => {
    return level > 0 && format(new Date(date), 'yyyy-MM') === format(currentMonth, 'yyyy-MM');
  }).length;

  const updateHabitStatus = (date: Date, level: HabitLevel) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === activeHabitId) {
          return {
            ...h,
            data: {
              ...h.data,
              [dateStr]: level,
            },
          };
        }
        return h;
      })
    );
    setSelectedDate(null);
    toast.success(`${format(date, 'M월 d일')} 기록 완료!`);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, -1)); // Wait, subMonths takes positive number to subtract

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
      <div className="max-w-md mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Habit Tracker</h1>
            <p className="text-zinc-500 text-sm">{format(currentMonth, 'yyyy년 M월')}</p>
          </div>
          <button className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
        </header>

        <HabitTabs 
          habits={habits} 
          activeId={activeHabitId} 
          onSelect={setActiveHabitId} 
        />

        <main className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: activeHabit.color }}
              />
              {activeHabit.name}
            </h2>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-400 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-400 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <HabitGrid 
            month={currentMonth}
            habit={activeHabit}
            onDateClick={setSelectedDate}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">이번 달 달성도</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">
                  {monthlyCount}
                </span>
                <span className="text-zinc-500 text-sm mb-1">일</span>
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">현재 스트릭</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{currentStreak}</span>
                <span className="text-zinc-500 text-sm mb-1">일</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-zinc-400">목표 단계</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {activeHabit.levels.map((level, idx) => (
                <div key={idx} className="space-y-2">
                  <div 
                    className="h-1.5 rounded-full overflow-hidden bg-zinc-800"
                  >
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: '100%',
                        backgroundColor: activeHabit.color,
                        opacity: (idx + 1) / 3
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 text-center font-medium">{level}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <AnimatePresence>
          {selectedDate && (
            <StatusPicker
              date={selectedDate}
              habit={activeHabit}
              onClose={() => setSelectedDate(null)}
              onSelect={(level) => updateHabitStatus(selectedDate, level)}
            />
          )}
        </AnimatePresence>

        <footer className="mt-12 text-center">
          <p className="text-zinc-600 text-xs">
            날짜를 클릭하여 습관 달성 여부를 기록하세요
          </p>
        </footer>
      </div>
      <Toaster position="bottom-center" theme="dark" />
    </div>
  );
}
