/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-explicit-any */

const debounce = <T extends (...args: any) => any>(
	callback: T,
	wait: number = 250
) => {
	let timeoutId: number | null = null;

	return (...args: Parameters<T>) => {
		if (timeoutId) window.clearTimeout(timeoutId);

		let returnValue: ReturnType<T>;
		timeoutId = window.setTimeout(() => {
			returnValue = callback.apply(null, args);
		}, wait);
		// @ts-expect-error To fix debounce function's return value types
		return returnValue;
	};
};

export default debounce;
