import { useParams } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';

import { database, ref, push, set, onValue, onChildAdded } from '../../services/firebase';
import { RoomCode } from '../../components/RoomCode';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';

import logoImg from '../../assets/images/logo.svg';

import './styles.scss';

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

type RoomParams = {
    id: string;
}


export function Room() {
    const { user } = useAuth();
    const db = database;

    const params = useParams<RoomParams>();
    const [ newQuestion, setNewQuestion ] = useState('');
    const [ questions, setQuestions ] = useState<Question[]>([]);
    const [ title, setTitle ] = useState('');
    const roomId = params.id;

    useEffect(() => {
        const roomRef = ref(db, `rooms/${roomId}/questions`);
        onValue(roomRef, room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted,
                }
            });
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        }, {
            onlyOnce: true
          });
    }, [roomId, db]);

    async function handleSendQuestion( event: FormEvent) {
        event.preventDefault();
        if(newQuestion.trim() === '') {
            return;
        }
        if(!user) {
            throw new Error("You must be logged in");
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false
        };

        /*
            Para adicionar uma lista versão do firebase ^9.4.1
        */
        const roomRef = ref(db, `rooms/${roomId}/questions`);
        const firebaseRoom = push(roomRef);
        set(firebaseRoom, question);

        setNewQuestion('');
    
            //history.push(`/rooms/${firebaseRoom.key}`)
    }
    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId}/>
                </div>
            </header>
            
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && (
                        <span>{questions.length} pergunta(s)</span>
                    )}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        {
                            user ? (
                                <div className="user-info">
                                    <img src={user.avatar} alt={user.name} />
                                    <span>{ user.name }</span>
                                </div>
                            ) : (
                                <span>Para enviar a pergunta, <button>faça seu login</button>.</span>
                            )
                        }
                        <Button type="submit" disabled={!user} >
                            Enviar pergunta
                        </Button>
                    </div>
                </form>
                {JSON.stringify(questions)}
            </main>
        </div>
    )
}