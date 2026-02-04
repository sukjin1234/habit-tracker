import { useState, useEffect, useCallback } from 'react';
import { format, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { DataManager } from './DataManager';
import { Habit, HabitLevel } from './types';
import { HabitTabs } from './components/HabitTabs';
import { HabitGrid } from './components/HabitGrid';
import { StatusPicker } from './components/StatusPicker';
import { HabitSettings } from './components/HabitSettings';

interface AppProps {
	dataManager: DataManager;
}

export default function App({ dataManager }: AppProps) {
	const [habits, setHabits] = useState<Habit[]>([]);
	const [activeHabitId, setActiveHabitId] = useState<string>('');
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [showSettings, setShowSettings] = useState(false);

	const refreshData = useCallback(() => {
		const loadedHabits = dataManager.getHabits();
		setHabits(loadedHabits);
		if (loadedHabits.length > 0 && !activeHabitId) {
			setActiveHabitId(loadedHabits[0].id);
		}
	}, [dataManager, activeHabitId]);

	useEffect(() => {
		refreshData();
		const unsubscribe = dataManager.subscribe(refreshData);
		return unsubscribe;
	}, [dataManager, refreshData]);

	const activeHabit = habits.find((h) => h.id === activeHabitId) || habits[0];

	const calculateStreak = (habit: Habit) => {
		if (!habit) return 0;
		let streak = 0;
		let checkDate = new Date();

		while (true) {
			const dateStr = format(checkDate, 'yyyy-MM-dd');
			if (habit.data[dateStr] && habit.data[dateStr] > 0) {
				streak++;
				checkDate.setDate(checkDate.getDate() - 1);
			} else {
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

	const currentStreak = activeHabit ? calculateStreak(activeHabit) : 0;
	const monthlyCount = activeHabit
		? Object.entries(activeHabit.data).filter(([date, level]) => {
				return level > 0 && format(new Date(date), 'yyyy-MM') === format(currentMonth, 'yyyy-MM');
			}).length
		: 0;

	const updateHabitStatus = async (date: Date, level: HabitLevel) => {
		const dateStr = format(date, 'yyyy-MM-dd');
		await dataManager.updateHabitStatus(activeHabitId, dateStr, level);
		setSelectedDate(null);
	};

	const addHabit = async (habit: Omit<Habit, 'id' | 'data'>) => {
		await dataManager.addHabit(habit);
	};

	const updateHabit = async (id: string, updates: Partial<Habit>) => {
		await dataManager.updateHabit(id, updates);
	};

	const deleteHabit = async (id: string) => {
		await dataManager.deleteHabit(id);
		if (activeHabitId === id) {
			const remaining = habits.filter(h => h.id !== id);
			if (remaining.length > 0) {
				setActiveHabitId(remaining[0].id);
			}
		}
	};

	if (habits.length === 0 && !showSettings) {
		return (
			<div className="habit-tracker">
				<div className="habit-empty">
					<p>습관이 없습니다.</p>
					<button onClick={() => setShowSettings(true)} className="btn-add-first">
						습관 추가하기
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="habit-tracker">
			<header className="habit-header">
				<div>
					<h1 className="habit-title">습관 트래커</h1>
					<p className="habit-subtitle">{showSettings ? '설정' : format(currentMonth, 'yyyy년 M월')}</p>
				</div>
				<button 
					onClick={() => setShowSettings(!showSettings)} 
					className={`btn-settings ${showSettings ? 'active' : ''}`}
				>
					<Settings size={20} />
				</button>
			</header>

			{showSettings ? (
				<HabitSettings
					habits={habits}
					onAddHabit={addHabit}
					onUpdateHabit={updateHabit}
					onDeleteHabit={deleteHabit}
				/>
			) : (
				<>
					<HabitTabs habits={habits} activeId={activeHabitId} onSelect={setActiveHabitId} />

					<main className="habit-main">
						<div className="habit-section-header">
							<h2 className="habit-section-title">
								<span className="habit-color-dot" style={{ backgroundColor: activeHabit?.color }} />
								{activeHabit?.name}
							</h2>
							<div className="habit-nav">
								<button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="habit-nav-btn">
									<ChevronLeft size={18} />
								</button>
								<button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="habit-nav-btn">
									<ChevronRight size={18} />
								</button>
							</div>
						</div>

						{activeHabit && (
							<>
								<HabitGrid month={currentMonth} habit={activeHabit} onDateClick={setSelectedDate} />

								<div className="habit-stats">
									<div className="stat-card">
										<p className="stat-label">이번 달 달성도</p>
										<div className="stat-value-row">
											<span className="stat-value">{monthlyCount}</span>
											<span className="stat-unit">일</span>
										</div>
									</div>
									<div className="stat-card">
										<p className="stat-label">현재 스트릭</p>
										<div className="stat-value-row">
											<span className="stat-value">{currentStreak}</span>
											<span className="stat-unit">일</span>
										</div>
									</div>
								</div>

								<div className="habit-levels-card">
									<h3 className="levels-title">목표 단계</h3>
									<div className="levels-grid">
										{activeHabit.levels.map((level, idx) => (
											<div key={idx} className="level-item">
												<div className="level-bar-bg">
													<div
														className="level-bar"
														style={{
															backgroundColor: activeHabit.color,
															opacity: (idx + 1) / 3,
														}}
													/>
												</div>
												<p className="level-label">{level}</p>
											</div>
										))}
									</div>
								</div>
							</>
						)}
					</main>

					{selectedDate && activeHabit && (
						<StatusPicker
							date={selectedDate}
							habit={activeHabit}
							onClose={() => setSelectedDate(null)}
							onSelect={(level) => updateHabitStatus(selectedDate, level)}
						/>
					)}

					<footer className="habit-footer">
						<p>날짜를 클릭하여 습관 달성 여부를 기록하세요</p>
					</footer>
				</>
			)}
		</div>
	);
}
