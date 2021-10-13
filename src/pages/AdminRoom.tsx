import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useHistory, useParams } from 'react-router-dom'
import '../styles/room.scss'
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import deleteImage from '../assets/images/delete.svg';
import checkImage from '../assets/images/check.svg';
import answerImage from '../assets/images/answer.svg';
import { database } from '../services/firebase';
type RoomParams = {
  id: string
}

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const history = useHistory();
  const roomId = params.id;
  //const { user } = useAuth();
  const { title, questions } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({ endedAt: new Date()})
    history.push('/')
  }
  async function handleDeleteQuestion(questionId: string) {
    if(window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    } 
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });
  } 

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo da página" />
          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom} isOutlined>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}

        </div>



        <div className="question-list">
          {
            questions.map(question => {
              return (
                <Question
                  key={question.id}
                  isHighLighted={question.isHighLighted}
                  isAnswered={question.isAnswered}
                  content={question.content}
                  author={question.author}>
                    {!question.isAnswered && (
                      <>
                      <button type="button" onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                        <img src={checkImage} alt="Marcar como respondida" />
                      </button>
                      <button type="button" onClick={() => handleHighLightQuestion(question.id)}>
                        <img src={answerImage} alt="Dar destaque a pergunta" />
                      </button>  
                                        
                    </>
                    )}
                    <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                      <img src={deleteImage} alt="Delete pergunta" />
                    </button>
                  </Question>
              )
            })
          }
        </div>

      </main>
    </div>
  );
}


