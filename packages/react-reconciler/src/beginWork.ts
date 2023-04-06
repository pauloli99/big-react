import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { mountChildFibers, reconcileChildFibers } from './childFibers';

export const beginWork = (wip: FiberNode): FiberNode | null => {
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			return null;

		default:
			if (__DEV__) {
				console.warn('beginwork未实现的类型');
			}
			return null;
	}
};

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memorizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.penging;
	updateQueue.shared.penging = null;

	const { memorizeState } = processUpdateQueue(baseState, pending);
	wip.memorizedState = memorizeState;

	const nextChildren = wip.memorizedState;

	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate;

	if (current !== null) {
		// update
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		// mount
		wip.child = mountChildFibers(wip, null, children);
	}
}
