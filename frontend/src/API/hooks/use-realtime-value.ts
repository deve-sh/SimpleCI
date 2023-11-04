import { useState, useEffect } from "react";
import { onSnapshot, type DocumentData, type Query } from "firebase/firestore";

import { useAuth } from "../../providers/auth";

const useRealtimeFirestoreQuery = <T>(
	query: Query<DocumentData, DocumentData>
) => {
	const { user } = useAuth();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [data, setData] = useState<T[]>([]);

	useEffect(() => {
		if (!user?.uid) return;

		setLoading(true);
		const unsubFunction = onSnapshot(
			query,
			(snapshot) => {
				setLoading(false);
				setData(snapshot.docs.map((run) => run.data() as T));
			},
			setError
		);

		return () => {
			if (unsubFunction) unsubFunction();
		};
	}, [user?.uid, query]);

	return { data, error, loading };
};

export default useRealtimeFirestoreQuery;
