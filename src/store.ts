export type Store<T> = {
	subscribe: Subscriber<T>;
	set: Setter<T>;
	update: Updater<T>;
};
export type Subscriber<T> = (fn: Subscribed<T>) => Unsubscriber;
export type Subscribed<T> = (val: T) => void;
export type Unsubscriber = () => void;

export type Setter<T> = (newVal: T) => void;

export type Updater<T> = (fn: Updated<T>) => void;
export type Updated<T> = (val: T) => T;

export function createStore<T>(original: T): Store<T> {
	let val = original;
	const subscribers: Record<string, Subscribed<T> | undefined> = {};

	function subscribe(fn: Subscribed<T>): Unsubscriber {
		const id = `${Math.random()}`.replace('.', '');
		subscribers[id] = fn;
		fn(val);

		return () => {
			subscribers[id] = undefined;
		};
	}
	function set(newVal: T) {
		Object.values(subscribers).forEach((fn) => (fn ? fn(newVal) : undefined));
		val = newVal;
	}
	function update(fn: Updated<T>) {
		set(fn(val));
	}

	return {
		subscribe,
		set,
		update,
	};
}
