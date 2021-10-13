import ilustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import {Link, useHistory} from 'react-router-dom'

import '../styles/auth.scss'
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import {database} from '../services/firebase'



export function NewRoom() {

    const {user} = useAuth();
    const history = useHistory();

    const [newRoom, setNewRoom] = useState('')


    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();
        if(newRoom.trim() === '') {
            return;
        }

        const roomRef = database.ref('rooms')

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
            
        })

        history.push(`/admin/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={ilustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&A ao vivo</strong>
                <p>Tire as duvidas da suas audiencia em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />                       
                    <h2> Criar uma nova Sala</h2>

                    <form onSubmit={handleCreateRoom}>
                        <input
                            onChange={event => setNewRoom(event.target.value)}
                            type="text"
                            value={newRoom}
                            placeholder="Nome da sala"
                        />
                       <Button>
                          Criar sala
                       </Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
                </div>
            </main>
        </div>
    )
}