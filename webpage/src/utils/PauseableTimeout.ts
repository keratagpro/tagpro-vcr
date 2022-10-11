// Class to make all timers pauseable. We do this by intercepting every call
// to setTimeout and scheduling our own timer instead. To pause, we cancel all
// outstanding timers and make a note of how much time was left on each. Then
// when resuming, we reschedule each timer to run after its remaining time.
//
// We also need to make clearTimeout work, which means storing the original
// interval id assigned for each timer. A new interval id is generated each
// time we pause/resume, so if the caller uses clearTimeout with the original
// id, we need to map it to the current id for that timer.

const _setTimeout = window.setTimeout;
const _clearTimeout = window.clearTimeout;

type OnExecute = (timer: PauseableTimer) => void;

class PauseableTimer {
	// Adapted from https://stackoverflow.com/a/3969760

	originalId: number;
	timerId: number;

	private args: any[];
	private start: number;

	constructor(private onExecute: OnExecute, private handler: TimerHandler, private remaining: number, ...args: any[]) {
		this.args = args;
		this.resume();
	}

	pause() {
		_clearTimeout(this.timerId);
		this.timerId = null;
		this.remaining -= Date.now() - this.start;
	}

	resume() {
		const handler = () => {
			if (this.handler instanceof Function) {
				this.handler(...this.args);
			} else {
				// tslint:disable-next-line: no-eval
				eval(this.handler);
			}

			this.onExecute(this);
		};

		this.start = Date.now();
		if (this.timerId) _clearTimeout(this.timerId);
		this.timerId = _setTimeout(handler.bind(this), this.remaining);
		this.originalId ??= this.timerId;
	}

	shift(delta: number) {
		this.pause();
		this.remaining = delta < 0 ? 0 : Math.max(this.remaining - delta, 0);
		this.resume();
	}
}

interface Timers {
	[key: number]: PauseableTimer;
}

const timers: Timers = {};
let timeBase = 0;

export default abstract class PauseableTimeouts {
	public static hookSetTimeout() {
		(window as any).setTimeout = (handler: TimerHandler, timeout?: number, ...args: any[]): number => {
			// If the timeout is small, we're probably looking at use of
			// setTimeout to escape the event loop rather than a real
			// deferred action, so we'll bypass the special handling

			if (timeout && (timeout > 10)) {
				const onExecute = (timer: PauseableTimer) => {
					delete timers[timer.originalId];
				};

				const newTimer = new PauseableTimer(onExecute, handler, timeout + timeBase, ...args);
				const id = newTimer.timerId;
				timers[id] = newTimer;
				return id;
			} else {
				return _setTimeout(handler, timeout, ...args);
			}
		};

		(window as any).clearTimeout = (handle?: number) => {
			if (handle && (handle in timers)) {
				const timerId = timers[handle].timerId;
				if (timerId) _clearTimeout(timerId);
				delete timers[handle];
			} else {
				_clearTimeout(handle);
			}
		};
	}

	public static pauseAll() {
		Object.values(timers).forEach(timer => timer.pause());
	}

	public static resumeAll() {
		Object.values(timers).forEach(timer => timer.resume());
	}

	public static shiftAll(delta: number) {
		Object.values(timers).forEach(timer => timer.shift(delta));
	}

	public static setBase(base: number) {
		timeBase = base;
	}
}
