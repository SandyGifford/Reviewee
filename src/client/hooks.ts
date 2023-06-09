import type { DependencyList } from "react";
import { useEffect, useState, useCallback, useRef } from "react";

/**
 * Returns a function that behaves identically to the one passed in, but whose reference never changes
 * @param callback The functional callback
 * @returns A function whose reference never changes
 */
export const useCallbackSafeRef = <T extends (...args: unknown[]) => unknown>(callback: T): T => {
	const outCb = useRef(callback);
	outCb.current = callback;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useCallback(((...args) => outCb.current(...args)) as T, []);
};


export type UsePromiseReturn<T> =
  | [data: T, loading: false, error: undefined]
	| [data: T | undefined, loading: true, error: undefined]
	| [data: T | undefined, loading: boolean, error: Error];

export const usePromise = <T>(cb: () => Promise<T>, deps: DependencyList): UsePromiseReturn<T> => {
	const [state, setState] = useState<T>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error>();
	const safeRefCb = useCallbackSafeRef(cb);

	useEffect(() => {
		setLoading(true);
		setError(undefined);

		safeRefCb()
			.then(r => {
				setState(r);
				setLoading(false);
			})
			.catch(r => {
				setError(r instanceof Error ?
					r :
					new Error("Encountered problem while running promise", { cause: error }),
				);
				setLoading(false);
			});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return [state, loading, error] as UsePromiseReturn<T>;
};