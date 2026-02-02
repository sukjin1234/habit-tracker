import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Habit } from '@/app/App';

interface HabitTabsProps {
  habits: Habit[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function HabitTabs({ habits, activeId, onSelect }: HabitTabsProps) {
  return (
    <div className="flex p-1.5 bg-zinc-900/80 backdrop-blur-md rounded-2xl gap-1">
      {habits.map((habit) => {
        const isActive = habit.id === activeId;
        return (
          <button
            key={habit.id}
            onClick={() => onSelect(habit.id)}
            className={cn(
              "relative flex-1 py-2.5 text-sm font-medium transition-colors rounded-xl outline-hidden",
              isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-zinc-800 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{habit.name}</span>
          </button>
        );
      })}
    </div>
  );
}
