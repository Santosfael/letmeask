import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { ref, set,database, push } from '../../services/firebase';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';

import './styles.scss';

export function NewRoom() {
    const { user } = useAuth();
    const history = useHistory();
    const [ newRoom, setNewRoom ] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();
        if(newRoom.trim() === '') {
            return;
        }

        /*
            Para adicionar uma lista versão do firebase ^9.4.1
        */
        const db = database;
        const pushRef = ref(db, 'rooms');
        const firebaseRoom = push(pushRef);
        set(firebaseRoom, {
            title: newRoom,
            authorId: user?.id,
        });

        history.push(`/rooms/${firebaseRoom.key}`)
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
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
                </div>
            </main>
        </div>
    )
};