"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { db } from "./firestore";
import { FieldValue, arrayUnion, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { problemCollection } from "./problemsCollection";



interface IComment {
	createdAt: number,
	comment: string,
}

type WithComments = { 
	comments: IComment[] 
} 

export type ProblemProps = {
  uid: string;

  question: string;
  answers: string[];
  votes: number[];

  timestamp: number,
} & WithComments;


const Answers = (props: { problem: ProblemProps} & { hasVoted: boolean, setHasVoted: (arg: number) => void, setHasSeen: Dispatch<SetStateAction<string[]>> }) => {
  const { problem: { answers, votes, uid, }, hasVoted, setHasVoted, setHasSeen} = props;

  return (
    <div className="problem-container">
      {answers.map((answer, i) => (
		hasVoted ? 
		<div className={['left', 'up', 'right'][i]} key={i}>
			{answer}: {votes[i]}
		</div>
		:
		<div className={['left', 'up', 'right'][i]} key={i}>
			<button key={i} onClick={() => {
				setHasVoted(i)
				const ref = doc(problemCollection, uid)
				updateDoc(ref, {
					'votes': votes.map((vote, index) => index === i ? vote + 1 : vote)
				})
			}}>
			{answer}
			</button>
		</div>
      ))}
	  	<div className="down">

		<button onClick={() => {
			setHasSeen(alreadySeen => [...alreadySeen, uid, ])
		}}>
			{hasVoted ? 'næste': 'skip'}
		</button>
		</div>
    </div>
  );
};


const CommentFeed = ({ problem, }: { problem: ProblemProps}) => {
	const [ newComment, setNewComment, ] = useState('')

	const sendComment = () => {
		if (newComment !== '') {
			const ref = doc(problemCollection, problem.uid)
			const createdAt = Date.now()
			
			updateDoc(ref, {
				comments: [ ...problem.comments, { comment: newComment, createdAt, }]
			})
			
			setNewComment('')
		}
	}

	console.log('comments???', problem.comments)

	return (
		<div>
			<h2>kommentarer: </h2>
			{problem.comments.map(comment => <div key={comment.createdAt}>{comment.comment}</div>)}
			<label htmlFor="comment">Din kommentar</label>
			<br/><br/>
			<input name="comment" id="comment" value={newComment} onChange={e => setNewComment(e.target.value)}/>
			<button onClick={() => sendComment()} style={{ marginLeft: 16, }}>
				Send kommentar
			</button>
		</div>
	)
}

export const Problem = (props: { problem: ProblemProps, setHasSeen: Dispatch<SetStateAction<string[]>> }) => {
  const {
    problem, setHasSeen
  } = props;

  const { question, uid, } = problem
  const [ hasVotedOn, setHasVotedOn, ] = useState<number>();

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>{question}</h2>
      <Answers problem={problem} hasVoted={hasVotedOn !== undefined} setHasVoted={setHasVotedOn} setHasSeen={setHasSeen}/>
		<CommentFeed problem={problem}/>
    </div>
  );
};

export const CreateProblem = () => {
	return (
		<div className="problem-container">
			<h2>Lav problem</h2>
			<form style={{ flexDirection: 'column', display: 'flex', gap: 8, }} onSubmit={event => {
				event.preventDefault()
				const values = event.target as any

				const question = values.question.value as string
				const answers = [ values.answer1.value, values.answer2.value, values.answer3.value, ] as string[]
				const timestamp = new Date().getTime()

				const ref = doc(collection(db, 'problems'))

				const problem: ProblemProps = {
					uid: ref.id,
					answers,
					question,
					votes: [0, 0, 0],
					timestamp,
					comments: []
				} 
				
				setDoc(ref, problem)
			}}
			>
				<label htmlFor="question">
					Spørgsmål
				</label >
				<input id="question" name="question"/>

				<label htmlFor="answer-1">
					Svarmulighed 1
				</label >
				<input id="answer1" name="answer-1"/>
				<label htmlFor="answer-2">
					Svarmulighed 2
				</label >
				<input id="answer2" name="answer-2"/>
				<label htmlFor="answer-3">
					Svarmulighed 3
				</label >
				<input id="answer3" name="answer-3"/>
				<button>
					gem
				</button>
			</form>
		</div>
	)
}