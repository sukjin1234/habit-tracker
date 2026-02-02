import {
	format,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	startOfWeek,
	endOfWeek,
	isToday,
	isFuture,
	isSameMonth,
} from 'date-fns';
import { Habit, HabitLevel } from '../types';

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
		<div className="habit-calendar">
			{/* 요일 헤더 - 별도 행 */}
			<div className="habit-weekdays">
				{weekDays.map((day, idx) => (
					<div key={idx} className="habit-weekday">
						{day}
					</div>
				))}
			</div>

			{/* 날짜 그리드 - 바둑판 */}
			<div className="habit-grid">
				{days.map((day) => {
					const dateStr = format(day, 'yyyy-MM-dd');
					const level = (habit.data[dateStr] || 0) as HabitLevel;
					const isCurrentMonth = isSameMonth(day, month);
					const isFutureDay = isFuture(day) && !isToday(day);
					const isTodayDay = isToday(day);

					return (
						<button
							key={dateStr}
							disabled={isFutureDay}
							onClick={() => onDateClick(day)}
							className={`habit-day ${!isCurrentMonth ? 'other-month' : ''} ${isFutureDay ? 'future' : ''} ${isTodayDay ? 'today' : ''} ${level > 0 ? 'completed' : ''}`}
							style={{
								backgroundColor: level > 0 ? habit.color : undefined,
								opacity: !isCurrentMonth ? 0.3 : level === 1 ? 0.4 : level === 2 ? 0.7 : undefined,
							}}
						>
							{format(day, 'd')}
						</button>
					);
				})}
			</div>
		</div>
	);
}
