import { format } from 'date-fns';
import { X, Check, Minus } from 'lucide-react';
import { Habit, HabitLevel } from '../types';

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
		{ level: 0, label: '안함' },
		{ level: 1, label: habit.levels[0] },
		{ level: 2, label: habit.levels[1] },
		{ level: 3, label: habit.levels[2] },
	];

	return (
		<div className="status-picker-overlay" onClick={onClose}>
			<div className="status-picker" onClick={(e) => e.stopPropagation()}>
				<div className="picker-header">
					<div>
						<h3 className="picker-title">{format(date, 'M월 d일')}</h3>
						<p className="picker-subtitle">{habit.name} 기록하기</p>
					</div>
					<button onClick={onClose} className="picker-close-btn">
						<X size={18} />
					</button>
				</div>

				<div className="picker-options">
					{levels.map(({ level, label }) => (
						<button
							key={level}
							onClick={() => onSelect(level)}
							className={`picker-option ${currentLevel === level ? 'selected' : ''}`}
						>
							<div className="option-content">
								<div
									className={`option-icon ${level === 0 ? 'option-icon-none' : ''}`}
									style={
										level > 0
											? {
													backgroundColor: habit.color,
													opacity: level === 1 ? 0.4 : level === 2 ? 0.7 : 1,
												}
											: {}
									}
								>
									{level === 0 ? (
										<Minus size={16} />
									) : (
										<Check size={16} />
									)}
								</div>
								<span className="option-label">{label}</span>
							</div>
							{currentLevel === level && (
								<div className="option-check">
									<Check size={12} />
								</div>
							)}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
