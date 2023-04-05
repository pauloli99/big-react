import { Action } from 'shared/ReactTypes';

export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		penging: Update<State> | null;
	};
}

export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

export const createUpdateQueue = <Action>(): UpdateQueue<Action> => {
	return {
		shared: {
			penging: null
		}
	};
};

export const enqueueUpdate = <Action>(
	updateQueue: UpdateQueue<Action>,
	update: Update<Action>
) => {
	updateQueue.shared.penging = update;
};

export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memorizeState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memorizeState: baseState
	};

	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;

		if (action instanceof Function) {
			result.memorizeState = action(baseState);
		} else {
			result.memorizeState = action;
		}
	}

	return result;
};
