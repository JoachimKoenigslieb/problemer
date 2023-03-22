'use client'

import Image from 'next/image'
import { Inter } from 'next/font/google'
import { CreateProblem, Problem, ProblemProps } from './Problem'
import { CollectionReference, DocumentData, collection, limit, orderBy, query, where } from 'firebase/firestore'
import { db } from './firestore'
import { useQuerySnapshot } from './useDocumentSnapshot'
import { useEffect, useState } from 'react'
import { NoMoreProblems } from './NoMoreProblems'
import { problemCollection } from './problemsCollection'

const inter = Inter({ subsets: ['latin'] })


const problemRefs = query(problemCollection, orderBy('timestamp', 'desc'), limit(100)) 

export default function Home() {
	const { data, status, } = useQuerySnapshot(problemRefs)

	const [ hasSeen, setHasSeen, ] = useState<string[]>([])

	if (status !== 'FINISHED') {
		return <>loading...</>
	}

	const notSeen = data.filter(problem => !hasSeen.includes(problem.uid))
	const problemToDisplay = notSeen.at(0)

	console.log('infinite?', data)

  return (
    <main>
		<Image
			src="/questionmark.svg"
			alt="Vercel Logo"
			width={200}
			style={{ width: 200, height: 300, alignSelf: 'center' }}
			height={24}
			priority
		/>
		{!!problemToDisplay ? <Problem problem={problemToDisplay} setHasSeen={setHasSeen} key={problemToDisplay.uid}/> : <NoMoreProblems />}
		<CreateProblem />
    </main>
  )
}
