import { App } from 'obsidian';
import { HabitData, Habit, HabitLevel, DEFAULT_DATA } from './types';

const DATA_FILE_PATH = 'habits.json';

export class DataManager {
	private app: App;
	private data: HabitData;
	private listeners: Set<() => void> = new Set();

	constructor(app: App) {
		this.app = app;
		this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
	}

	async loadData(): Promise<void> {
		try {
			const adapter = this.app.vault.adapter;
			const exists = await adapter.exists(DATA_FILE_PATH);

			if (exists) {
				const content = await adapter.read(DATA_FILE_PATH);
				const loadedData = JSON.parse(content);

				this.data = {
					habits: loadedData.habits || DEFAULT_DATA.habits,
					settings: {
						...DEFAULT_DATA.settings,
						...loadedData.settings,
					},
				};
				console.log('습관 데이터 로드 완료:', this.data.habits.length, '개');
			} else {
				console.log('습관 데이터 파일 없음, 새로 생성');
				await this.saveData();
			}
		} catch (error) {
			console.error('습관 데이터 로드 실패:', error);
			this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
		}
	}

	async saveData(): Promise<void> {
		try {
			const adapter = this.app.vault.adapter;
			const content = JSON.stringify(this.data, null, 2);
			await adapter.write(DATA_FILE_PATH, content);
			console.log('습관 데이터 저장 완료');
		} catch (error) {
			console.error('습관 데이터 저장 실패:', error);
		}
	}

	getHabits(): Habit[] {
		return [...this.data.habits];
	}

	getSettings() {
		return { ...this.data.settings };
	}

	async updateHabitStatus(habitId: string, date: string, level: HabitLevel): Promise<void> {
		this.data.habits = this.data.habits.map((h) => {
			if (h.id === habitId) {
				return {
					...h,
					data: {
						...h.data,
						[date]: level,
					},
				};
			}
			return h;
		});
		await this.saveData();
		this.notifyListeners();
	}

	async addHabit(habit: Omit<Habit, 'id' | 'data'>): Promise<void> {
		const newHabit: Habit = {
			...habit,
			id: Date.now().toString(),
			data: {},
		};
		this.data.habits = [...this.data.habits, newHabit];
		await this.saveData();
		this.notifyListeners();
	}

	async deleteHabit(id: string): Promise<void> {
		this.data.habits = this.data.habits.filter((h) => h.id !== id);
		await this.saveData();
		this.notifyListeners();
	}

	async updateHabit(id: string, updates: Partial<Habit>): Promise<void> {
		this.data.habits = this.data.habits.map((h) =>
			h.id === id ? { ...h, ...updates } : h
		);
		await this.saveData();
		this.notifyListeners();
	}

	subscribe(listener: () => void): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	private notifyListeners(): void {
		this.listeners.forEach((listener) => listener());
	}
}
