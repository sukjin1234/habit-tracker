export type HabitLevel = 0 | 1 | 2 | 3;

export interface Habit {
	id: string;
	name: string;
	levels: [string, string, string];
	data: Record<string, HabitLevel>;
	color: string;
}

export interface HabitData {
	habits: Habit[];
	settings: HabitSettings;
}

export interface HabitSettings {
	defaultColors: string[];
}

export const DEFAULT_HABITS: Habit[] = [
	{
		id: '1',
		name: '공부',
		levels: ['10분', '1시간', '3시간'],
		data: {},
		color: '#3b82f6',
	},
	{
		id: '2',
		name: '운동',
		levels: ['스트레칭', '30분', '1시간'],
		data: {},
		color: '#10b981',
	},
	{
		id: '3',
		name: '독서',
		levels: ['5페이지', '20페이지', '1시간'],
		data: {},
		color: '#f59e0b',
	},
];

export const DEFAULT_DATA: HabitData = {
	habits: DEFAULT_HABITS,
	settings: {
		defaultColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
	},
};
