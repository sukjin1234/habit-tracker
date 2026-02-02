import { Habit } from '../types';

interface HabitTabsProps {
	habits: Habit[];
	activeId: string;
	onSelect: (id: string) => void;
}

export function HabitTabs({ habits, activeId, onSelect }: HabitTabsProps) {
	return (
		<div className="habit-tabs">
			{habits.map((habit) => {
				const isActive = habit.id === activeId;
				return (
					<button
						key={habit.id}
						onClick={() => onSelect(habit.id)}
						className={`habit-tab ${isActive ? 'active' : ''}`}
					>
						{habit.name}
					</button>
				);
			})}
		</div>
	);
}
