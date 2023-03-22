import { DocumentReference, Query, onSnapshot } from "firebase/firestore"
import { useReducer, Reducer, useEffect } from "react"

type LoadedData<T> = {
	status: 'LOADING'
	data: undefined,
} | {
	status: 'FINISHED',
	data: T
} | {
	status: 'ERROR', 
	data: undefined,
	message: string
}

type Actions<T> = {
	type: 'SET_DATA',
	payload: T,
} | {
	type: 'ERROR', 
	payload: string,
}

const loaderReducer = <T>(state: LoadedData<T>, action: Actions<T>): LoadedData<T> => {
	switch (action.type) {
		case 'SET_DATA': {
			return { status: 'FINISHED', data: action.payload, }
		}

		case 'ERROR': {
			return { status: 'ERROR', data: undefined, message: action.payload, }
		}

		default: 
			throw new Error('Cant handle that case')
	}
}

/**
 * Helper for setting up a snapshot. Returns a nice interface for handling loading state: just check if status === 'LOADING' and early return if true 
 */
export const useDocumentSnapshot = <T, >(ref: DocumentReference<T>): LoadedData<T>  => {
	const [ data, setData, ] = useReducer<Reducer<LoadedData<T>, Actions<T>>>(loaderReducer, { status: 'LOADING', data: undefined, })
	
	useEffect(() => {
		onSnapshot(ref, doc => {
			const docData = doc.data()

			if (docData) {
				setData({
					type: 'SET_DATA',
					payload: docData,
				})
			}
		}, error => {
			setData({
				type: 'ERROR',
				payload: error.message,
			})
		})
		
	}, [ ref, ])

	return data
}


/**
 * Helper for setting up a snapshot. Returns a nice interface for handling loading state: just check if status === 'LOADING' and early return if true 
 */
export const useQuerySnapshot = <T, >(ref: Query<T>): LoadedData<T[]> => {
	const [ data, setData, ] = useReducer<Reducer<LoadedData<T[]>, Actions<T[]>>>(loaderReducer, { status: 'LOADING', data: undefined, })

	useEffect(() => {
		onSnapshot(ref, 
			query => {
				const docs = query.docs
				const docData = docs.map(queryDocSnapshot => queryDocSnapshot.data())
				setData({
					type: 'SET_DATA',
					payload: docData,
				})
			}, error => {
				setData({
					type: 'ERROR',
					payload: error.message,
				})
			})
	}, [ ref, ])

	return data
}