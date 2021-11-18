import { useParams, useHistory } from 'react-router-dom';
import { RoomCode } from '../../components/RoomCode';

import { database, ref, remove, update } from '../../services/firebase';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';

import './styles.scss';
import { Question } from '../../components/Question';
import { useRoom } from '../../hooks/useRoom';
import { Button } from '../../components/Button';

type RoomParams = {
    id: string;
}


export function AdminRoom() {

    const params = useParams<RoomParams>();
    const db = database;
    const roomId = params.id;
    const history = useHistory();

    const { questions, title } = useRoom(roomId);

    async function handleEndRoom() {
        const questionRef = ref(db, `rooms/${roomId}`);
        update(questionRef, {
            endedAt: new Date(),
        })

        history.push('/');

    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm("Tem certeza que você deseja excluir essa pergunta?")) {
            const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`);
            remove(questionRef);
        }
    }

    async function handleChekQuestionAsAnswered(questionId: string) {
        const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`);
        update(questionRef, {
            isAnswered: true
        });
    }

    async function handleHighLightQuestion(questionId: string) {
        const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`);
        update(questionRef, {
            isHighlighted: true
        });
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button
                            isOutlined
                            onClick={handleEndRoom}
                        >Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && (
                        <span>{questions.length} pergunta(s)</span>
                    )}
                </div>

                <div className="question-list">
                    {
                        questions.map(question => {
                            return (
                                <Question
                                    key={question.id}
                                    author={question.author}
                                    content={question.content}
                                    isAnswered={question.isAnswered}
                                    isHighlighted={question.isHighlighted}
                                >
                                    {
                                        !question.isAnswered && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => handleChekQuestionAsAnswered(question.id)}
                                                >
                                                    <img src={checkImg} alt="Marcar pergunta como resolvida" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleHighLightQuestion(question.id)}
                                                >
                                                    <img src={answerImg} alt="Dar destaque à pergunta" />
                                                </button>
                                            </>
                                        )
                                    }


                                    <button
                                        type="button"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                        <img src={deleteImg} alt="Remover pergunta" />
                                    </button>
                                </Question>
                            )
                        })
                    }
                </div>
            </main>
        </div>
    )
}