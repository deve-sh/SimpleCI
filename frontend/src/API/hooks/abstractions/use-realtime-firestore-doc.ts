import { useState, useEffect } from "react";
import {
	onSnapshot,
	type DocumentData,
	type DocumentReference,
} from "firebase/firestore";

import { useAuth } from "../../../providers/auth";

const useRealtimeFirestoreDoc = <T>(
	doc: DocumentReference<DocumentData, DocumentData>
) => {
	const { user } = useAuth();

	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [data, setData] = useState<T | null>(null);

	useEffect(() => {
		if (!user?.uid) return;

		setLoading(true);
		const unsubFunction = onSnapshot(
			doc,
			(snapshot) => {
				setLoading(false);
				setData(snapshot.data() as T);
			},
			setError
		);

		return () => {
			if (unsubFunction) unsubFunction();
		};
	}, [user?.uid]);

	return { data, error, isLoading };
};

export default useRealtimeFirestoreDoc;
