import { Plugin, WorkspaceLeaf } from 'obsidian';
import { HabitView, VIEW_TYPE_HABIT } from './HabitView';
import { DataManager } from './DataManager';

export default class HabitTrackerPlugin extends Plugin {
	dataManager: DataManager;

	async onload() {
		this.dataManager = new DataManager(this.app);
		await this.dataManager.loadData();

		this.registerView(
			VIEW_TYPE_HABIT,
			(leaf) => new HabitView(leaf, this.dataManager)
		);

		this.addRibbonIcon('check-circle', '습관 트래커 열기', () => {
			this.activateSidebarView();
		});

		this.addCommand({
			id: 'open-habit-sidebar',
			name: '습관 트래커 사이드바에서 열기',
			callback: () => {
				this.activateSidebarView();
			},
		});

		this.addCommand({
			id: 'open-habit-tab',
			name: '습관 트래커 새 탭에서 열기',
			callback: () => {
				this.activateTabView();
			},
		});
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_HABIT);
	}

	async activateSidebarView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_HABIT);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			if (leaf) {
				await leaf.setViewState({ type: VIEW_TYPE_HABIT, active: true });
			}
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	async activateTabView() {
		const { workspace } = this.app;
		const leaf = workspace.getLeaf('tab');
		if (leaf) {
			await leaf.setViewState({ type: VIEW_TYPE_HABIT, active: true });
			workspace.revealLeaf(leaf);
		}
	}
}
