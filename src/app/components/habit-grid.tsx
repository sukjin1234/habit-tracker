import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  startOfWeek, 
  endOfWeek, 
  isToday, 
  isFuture,
  isSameMonth
} from 'date-fns';
import { cn } from '@/lib/utils';
import { Habit, HabitLevel } from '@/app/App';

interface HabitGridProps {
  month: Date;
  habit: Habit;
  onDateClick: (date: Date) => void;
}

export function HabitGrid({ month, habit, onDateClick }: HabitGridProps) {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  
  const days = eachDayOfInterval({ start, end });
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="grid grid-cols-7 gap-3">
      {weekDays.map((day) => (
        <div key={day} className="text-[11px] font-bold text-zinc-600 text-center mb-2 uppercase tracking-widest">
          {day}
        </div>
      ))}
      
      {days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const level = (habit.data[dateStr] || 0) as HabitLevel;
        const isCurrentMonth = isSameMonth(day, month);
        const isFutureDay = isFuture(day) && !isToday(day);
        
        return (
          <button
            key={dateStr}
            disabled={isFutureDay}
            onClick={() => onDateClick(day)}
            className={cn(
              "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 relative group",
              !isCurrentMonth && "opacity-20",
              isFutureDay ? "cursor-not-allowed text-zinc-800" : "hover:scale-105 active:scale-95"
            )}
            style={{
              backgroundColor: level > 0 
                ? habit.color 
                : isCurrentMonth ? '#1a1a1a' : '#111',
              opacity: level > 0 
                ? (level === 1 ? 0.3 : level === 2 ? 0.6 : 1)
                : isCurrentMonth ? 1 : 0.2,
              border: isToday(day) ? `1px solid ${habit.color}80` : '1px solid transparent'
            }}
          >
            <span className={cn(
              level > 0 ? "text-white" : "text-zinc-500",
              isToday(day) && level === 0 && "text-white"
            )}>
              {format(day, 'd')}
            </span>
            
            {isToday(day) && level === 0 && (
              <div 
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: habit.color }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
