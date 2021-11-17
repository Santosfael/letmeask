import { useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import { database, ref, get, child } from '../../services/firebase';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';

import illustrationImg from '../../assets/images/illustration.svg';
import googleIconImg from '../../assets/images/google-icon.svg';
import logoImg from '../../assets/images/logo.svg';


import './styles.scss';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [ roomCode, setRoomCode ] = useState('');

    async function handleCreateRoom() {
        if(!user) {
            await signInWithGoogle();
        }

        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();
        if(roomCode.trim() === '') {
            return;
        }

        /*
            Para adicionar uma lista versão do firebase ^9.4.1
        */
        const db = ref(database);
        const roomRef = await get(child(db, `rooms/${roomCode}`));
        if(!roomRef.exists()) {
            alert('Room does not exists.');
            return;
        }

        if(roomRef.val().endedAt) {
            alert('Room already closed');
            setRoomCode('');
            return;
        }
        history.push(`/rooms/${roomCode}`);
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <button className="create-room" onClick={handleCreateRoom} >
                        <img src={googleIconImg} alt="Logo Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
};