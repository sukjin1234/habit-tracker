import { ItemView, WorkspaceLeaf } from 'obsidian';
import { StrictMode } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { DataManager } from './DataManager';
import App from './App';

export const VIEW_TYPE_HABIT = 'habit-tracker-view';

export class HabitView extends ItemView {
	root: Root | null = null;
	dataManager: DataManager;

	constructor(leaf: WorkspaceLeaf, dataManager: DataManager) {
		super(leaf);
		this.dataManager = dataManager;
	}

	getViewType(): string {
		return VIEW_TYPE_HABIT;
	}

	getDisplayText(): string {
		return '습관 트래커';
	}

	getIcon(): string {
		return 'check-circle';
	}

	async onOpen(): Promise<void> {
		const container = this.containerEl.children[1];
		container.empty();
		container.addClass('habit-tracker-container');

		this.root = createRoot(container);
		this.root.render(
			<StrictMode>
				<App dataManager={this.dataManager} />
			</StrictMode>
		);
	}

	async onClose(): Promise<void> {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}
