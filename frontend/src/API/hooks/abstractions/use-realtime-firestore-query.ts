import { useState, useEffect } from "react";
import { onSnapshot, type DocumentData, type Query } from "firebase/firestore";

import { useAuth } from "../../../providers/auth";

const useRealtimeFirestoreQuery = <T>(
	query: Query<DocumentData, DocumentData>
) => {
	const { user } = useAuth();

	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [data, setData] = useState<T[]>([]);

	useEffect(() => {
		if (!user?.uid) return;

		setLoading(true);
		const unsubFunction = onSnapshot(
			query,
			(snapshot) => {
				setLoading(false);
				setData(snapshot.docs.map((doc) => doc.data() as T));
			},
			setError
		);

		return () => {
			if (unsubFunction) unsubFunction();
		};
	}, [user?.uid]);

	return { data, error, isLoading };
};

export default useRealtimeFirestoreQuery;
