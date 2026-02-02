import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Habit, HabitLevel } from '@/app/App';
import { cn } from '@/lib/utils';

interface StatusPickerProps {
  date: Date;
  habit: Habit;
  onClose: () => void;
  onSelect: (level: HabitLevel) => void;
}

export function StatusPicker({ date, habit, onClose, onSelect }: StatusPickerProps) {
  const dateStr = format(date, 'yyyy-MM-dd');
  const currentLevel = habit.data[dateStr] || 0;

  const levels: { level: HabitLevel; label: string }[] = [
    { level: 0, label: '쉬기' },
    { level: 1, label: habit.levels[0] },
    { level: 2, label: habit.levels[1] },
    { level: 3, label: habit.levels[2] },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-12 sm:items-center sm:pb-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">{format(date, 'M월 d일')}</h3>
              <p className="text-zinc-500 text-sm">{habit.name} 기록하기</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {levels.map(({ level, label }) => (
              <button
                key={level}
                onClick={() => onSelect(level)}
                className={cn(
                  "w-full p-4 rounded-2xl flex items-center justify-between transition-all group",
                  currentLevel === level 
                    ? "bg-zinc-800 ring-1 ring-white/10" 
                    : "bg-zinc-900 hover:bg-zinc-800/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      level === 0 ? "bg-zinc-800" : ""
                    )}
                    style={level > 0 ? { 
                      backgroundColor: habit.color,
                      opacity: level === 1 ? 0.3 : level === 2 ? 0.6 : 1
                    } : {}}
                  >
                    {level === 0 ? (
                      <X size={18} className="text-zinc-500" />
                    ) : (
                      <Check size={18} className="text-white" />
                    )}
                  </div>
                  <span className={cn(
                    "font-medium transition-colors",
                    currentLevel === level ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                  )}>
                    {label}
                  </span>
                </div>
                
                {currentLevel === level && (
                  <motion.div
                    layoutId="check-indicator"
                    className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                  >
                    <Check size={14} className="text-black" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
