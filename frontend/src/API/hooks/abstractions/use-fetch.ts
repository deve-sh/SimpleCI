import useSWR from "swr";

const useFetch = <T = unknown>(
	key: Parameters<typeof useSWR>[0],
	fetcher: Parameters<typeof useSWR>[1],
	config?: Parameters<typeof useSWR>[2]
) =>
	// @ts-expect-error SWR doesn't work well with casted generics
	useSWR<Awaited<T>>(key, fetcher, {
		...config,
		revalidateOnFocus: false,
		revalidateIfStale: false,
		revalidateOnReconnect: false,
	});

export default useFetch;
