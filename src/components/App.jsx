import { useReducer } from 'react'
import Header from './Header'
import Main from './Main'
import StartScreen from './StartScreen'
import Question from './Question'
import NextButton from './NextButton'
import Progress from './Progress'
import FinishScreen from './FinishScreen'
import { questions } from '../data/questions'
import Footer from './Footer'
import Timer from './Timer'

const SECS_PER_QUESTION = 30

const initialState = {
  questions: questions,
  status: 'ready',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      }

    case 'newAnswer': {
      const question = state.questions.at(state.index)
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      }
    }

    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null }

    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      }

    case 'restart':
      return {
        ...initialState,
        questions: state.questions,
        status: 'ready',
      }

    case 'tick':
      if (state.secondsRemaining === 0) {
        return {
          ...state,
          status: 'finished',
          highscore:
            state.points > state.highscore ? state.points : state.highscore,
        }
      }
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
      }

    default:
      throw new Error('Action unknown')
  }
}

function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState)

  const numQuestions = questions.length
  const maxPossiblePoints = questions.reduce(
    (acc, next) => acc + next.points,
    0
  )

  return (
    <div className='app'>
      <Header />
      <Main>
        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  )
}

export default App
