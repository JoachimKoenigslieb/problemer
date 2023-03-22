import { CollectionReference, DocumentData, collection } from "firebase/firestore"
import { ProblemProps } from "./Problem"
import { db } from "./firestore"

const converter = <T extends DocumentData,>(path: CollectionReference) => {
	const converted = path.withConverter({
		fromFirestore: (snapshot): T => {
			const data = snapshot.data() as T

			return data
		},
		toFirestore: (data: T) => {
			return data
		},
	})
	
	return converted
}

export const problemCollection = converter<ProblemProps>(collection(db, 'problems'))
