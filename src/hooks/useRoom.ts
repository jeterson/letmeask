import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isHighLighted: boolean,
  isAnswered: boolean,
  likesCount: number,
  likeId: string | undefined,
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isHighLighted: boolean,
  isAnswered: boolean,
  likes: Record<string, {authorId: string}>
}>

export function useRoom(roomId: string) {
  const {user} = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)
    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions = (databaseRoom.questions || {}) as FirebaseQuestions
      console.log(firebaseQuestions)
      const parsedQuestions = Object.entries(firebaseQuestions)
        .map(([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighLighted: value.isHighLighted,
            isAnswered: value.isAnswered,
            likesCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {})
                      .find(([key, like]) => like.authorId === user?.id)?.[0]
          }
        })
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })

    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id])


  return {questions, title}
}