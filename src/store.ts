export type Store<T> = {
	subscribe: Subscriber<T>;
	set: Setter<T>;
};
export type Subscriber<T> = (fn: Subscribed<T>) => Unsubscriber;
export type Subscribed<T> = (val: T) => void;
export type Unsubscriber = () => void;
export type Setter<T> = (newVal: T) => void;

export function store<T>(original: T): Store<T> {
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

	return {
		subscribe,
		set,
	};
}
