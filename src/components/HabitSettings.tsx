import { useState } from 'react';
import { Habit } from '../types';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface HabitSettingsProps {
	habits: Habit[];
	onAddHabit: (habit: Omit<Habit, 'id' | 'data'>) => void;
	onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
	onDeleteHabit: (id: string) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function HabitSettings({ habits, onAddHabit, onUpdateHabit, onDeleteHabit }: HabitSettingsProps) {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editForm, setEditForm] = useState<Partial<Habit>>({});
	const [isAdding, setIsAdding] = useState(false);
	const [newHabit, setNewHabit] = useState({
		name: '',
		levels: ['', '', ''] as [string, string, string],
		color: COLORS[0],
	});

	const startEdit = (habit: Habit) => {
		setEditingId(habit.id);
		setEditForm({
			name: habit.name,
			levels: [...habit.levels] as [string, string, string],
			color: habit.color,
		});
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditForm({});
	};

	const saveEdit = () => {
		if (editingId && editForm.name) {
			onUpdateHabit(editingId, editForm);
			setEditingId(null);
			setEditForm({});
		}
	};

	const handleAddHabit = () => {
		if (newHabit.name && newHabit.levels.every(l => l)) {
			onAddHabit(newHabit);
			setNewHabit({
				name: '',
				levels: ['', '', ''],
				color: COLORS[habits.length % COLORS.length],
			});
			setIsAdding(false);
		}
	};

	return (
		<div className="habit-settings">
			<div className="settings-header">
				<h3 className="settings-title">습관 관리</h3>
				{!isAdding && (
					<button onClick={() => setIsAdding(true)} className="btn-add-habit">
						<Plus size={16} />
						추가
					</button>
				)}
			</div>

			{isAdding && (
				<div className="habit-edit-card">
					<div className="edit-field">
						<label>습관 이름</label>
						<input
							type="text"
							value={newHabit.name}
							onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
							placeholder="예: 운동"
						/>
					</div>
					<div className="edit-field">
						<label>레벨 1 (쉬움)</label>
						<input
							type="text"
							value={newHabit.levels[0]}
							onChange={(e) => setNewHabit({ ...newHabit, levels: [e.target.value, newHabit.levels[1], newHabit.levels[2]] })}
							placeholder="예: 10분"
						/>
					</div>
					<div className="edit-field">
						<label>레벨 2 (보통)</label>
						<input
							type="text"
							value={newHabit.levels[1]}
							onChange={(e) => setNewHabit({ ...newHabit, levels: [newHabit.levels[0], e.target.value, newHabit.levels[2]] })}
							placeholder="예: 30분"
						/>
					</div>
					<div className="edit-field">
						<label>레벨 3 (어려움)</label>
						<input
							type="text"
							value={newHabit.levels[2]}
							onChange={(e) => setNewHabit({ ...newHabit, levels: [newHabit.levels[0], newHabit.levels[1], e.target.value] })}
							placeholder="예: 1시간"
						/>
					</div>
					<div className="edit-field">
						<label>색상</label>
						<div className="color-picker">
							{COLORS.map((color) => (
								<button
									key={color}
									className={`color-option ${newHabit.color === color ? 'selected' : ''}`}
									style={{ backgroundColor: color }}
									onClick={() => setNewHabit({ ...newHabit, color })}
								/>
							))}
						</div>
					</div>
					<div className="edit-actions">
						<button onClick={() => setIsAdding(false)} className="btn-cancel">취소</button>
						<button onClick={handleAddHabit} className="btn-save">추가</button>
					</div>
				</div>
			)}

			<div className="habits-list">
				{habits.map((habit) => (
					<div key={habit.id} className="habit-item">
						{editingId === habit.id ? (
							<div className="habit-edit-card">
								<div className="edit-field">
									<label>습관 이름</label>
									<input
										type="text"
										value={editForm.name || ''}
										onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
									/>
								</div>
								<div className="edit-field">
									<label>레벨 1</label>
									<input
										type="text"
										value={editForm.levels?.[0] || ''}
										onChange={(e) => setEditForm({ 
											...editForm, 
											levels: [e.target.value, editForm.levels?.[1] || '', editForm.levels?.[2] || ''] as [string, string, string]
										})}
									/>
								</div>
								<div className="edit-field">
									<label>레벨 2</label>
									<input
										type="text"
										value={editForm.levels?.[1] || ''}
										onChange={(e) => setEditForm({ 
											...editForm, 
											levels: [editForm.levels?.[0] || '', e.target.value, editForm.levels?.[2] || ''] as [string, string, string]
										})}
									/>
								</div>
								<div className="edit-field">
									<label>레벨 3</label>
									<input
										type="text"
										value={editForm.levels?.[2] || ''}
										onChange={(e) => setEditForm({ 
											...editForm, 
											levels: [editForm.levels?.[0] || '', editForm.levels?.[1] || '', e.target.value] as [string, string, string]
										})}
									/>
								</div>
								<div className="edit-field">
									<label>색상</label>
									<div className="color-picker">
										{COLORS.map((color) => (
											<button
												key={color}
												className={`color-option ${editForm.color === color ? 'selected' : ''}`}
												style={{ backgroundColor: color }}
												onClick={() => setEditForm({ ...editForm, color })}
											/>
										))}
									</div>
								</div>
								<div className="edit-actions">
									<button onClick={cancelEdit} className="btn-cancel">취소</button>
									<button onClick={saveEdit} className="btn-save">저장</button>
								</div>
							</div>
						) : (
							<div className="habit-item-content">
								<div className="habit-item-info">
									<div className="habit-item-color" style={{ backgroundColor: habit.color }} />
									<div className="habit-item-details">
										<span className="habit-item-name">{habit.name}</span>
										<span className="habit-item-levels">{habit.levels.join(' → ')}</span>
									</div>
								</div>
								<div className="habit-item-actions">
									<button onClick={() => startEdit(habit)} className="btn-edit">
										<Edit2 size={16} />
									</button>
									<button onClick={() => onDeleteHabit(habit.id)} className="btn-delete">
										<Trash2 size={16} />
									</button>
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
