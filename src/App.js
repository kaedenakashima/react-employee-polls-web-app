import React, {useState} from 'react'
import './index.css'
import {Routes, Route, Link, useNavigate, generatePath, Navigate} from 'react-router-dom'
import {generateId, questions, _getUsers, _getQuestions, _saveQuestion, _saveQuestionAnswer} from './_DATA'
import Leaderboard from './components/Leaderboard'
import Result from './components/Result'
import Login from './components/Login'
import NotFoundPage from './components/NotFoundPage'
import {useSelector, useDispatch } from 'react-redux'
import {configureStore, createSlice} from '@reduxjs/toolkit'
import TurnRightIcon from '@mui/icons-material/TurnRight'
import LogoutIcon from '@mui/icons-material/Logout'

var loginList = []
export const loginSlice = createSlice({
  name: 'loginedusers',
  initialState: loginList,
  reducers: {
    loginU: (state, action) => {
      state.push(action.payload)
    },
    addLoginUQ: (state, action) => {
      const {id, QId} = action.payload
      const y = state.find(x => x.id === id)
      if(y){
        y.questions = y.questions.concat(QId)
      }
    },
    addLoginUA: (state, action) => {
      const {id, aId, vote} = action.payload
      const y = state.find(x => x.id === id)
        y.aId.push(aId)
        y.answers.push(vote)
    },
    logoutU: (state, action) => {
      const {id} = action.payload
      const y = state.find(x => x.id === id)
      if(y){
        return state.filter(x=>x.id !== id)
      }
    }
  }
})
export const {loginU, addLoginUQ, addLoginUA, logoutU} = loginSlice.actions
export const loginsReducer = loginSlice.reducer
export const store = configureStore({
  reducer: {
    loginedusers:loginsReducer,
  }
})
export function Create() {
  const [txt1, setTxt1]=useState('')
  const [txt2, setTxt2]=useState('')
  const [error, setError]=useState('')
  _getQuestions()
  const loginedusers = useSelector((state)=> state.loginedusers)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const onClick2Add = async(e)=> {
    e.preventDefault()
    if (txt1 && txt2) {
      const generatedID = generateId()
      _saveQuestion({id: generatedID, author:loginedusers[0].id, optionOneText:txt1, optionTwoText:txt2})
      await dispatch(addLoginUQ({id: loginedusers[0].id, QId:generatedID}))
      setTxt1('')
      setTxt2('')
      _getQuestions()
      return setTimeout(() => {
        navigate(generatePath('/'))
        }, 3)
        
    } else {
      setError('*Please add both Choice1 and Choice2')
    }
  }
  return (
    <div style={{display:'inline-flex'}}> 
    <div>
      Do you rather choose <input data-testid='choice1' type='text' name='txt1' placeholder='Choice1' value={txt1} onChange={e => setTxt1(e.target.value)}/> or <input data-testid='choice2' type='text' name='txt2' placeholder='Choice2' value={txt2} onChange={e => setTxt2(e.target.value)}/>?
      <div data-testid='error' style={{color: 'red', fontSize:'12px'}}>{error}</div>
    </div>
    <div>
      <button
      onClick={onClick2Add}
      style={{background: 'none', border: 'none'}}>+</button>
    </div>
  </div>
  )
}
export function QuestionList() {
  var loginedusers = useSelector((state)=> state.loginedusers)
  _getQuestions()
  _getUsers()
  const dispatch = useDispatch()
  const [selectedTable, setSelectedTable] = useState('UnansweredQuestions')
  const [data2VoteUpdate, setData2VoteUpdate] = useState({})
  const [dataVoteUpdateId, setDataVoteUpdateId] = useState(null)
  const [vote, setVote]=useState()
  const navigate = useNavigate()
  const onClick2VoteUpdate = (e, id) => {
    e.preventDefault()
    setDataVoteUpdateId(id)
    const selectedQuestion = Object.values(questions).filter(x => x.id === id)
    const {vote} = selectedQuestion[0]
    setVote(vote)
  }
  const onClick2SaveVoteUpdate = async(e, id)=> {
    e.preventDefault()
    if(vote === Object.values(questions).find(x => x.id === id).optionOne.text){
      _saveQuestionAnswer ({ authedUser:loginedusers[0].id, qid:id, answer:'optionOne'})
      await dispatch(addLoginUA({id: loginedusers[0].id, aId:id, vote: 'optionOne'}))
    }
    else{
      _saveQuestionAnswer ({ authedUser:loginedusers[0].id, qid:id, answer:'optionTwo'})
      await dispatch(addLoginUA({id: loginedusers[0].id, aId:id, vote: 'optionTwo'}))
    }
    setData2VoteUpdate({id:id, vote:vote})
    _getQuestions()
    return setTimeout(() => {
    navigate(generatePath('/questions/:id', { id }))
    }, 3)
  }
  const onClick2CancelVoteUpdate = () => {
    setDataVoteUpdateId(null)
  }
  const isQMatched = (x) => {
    const y = loginedusers[0].aId.find(z => z === x.id)
    if(y){
      return true
    }
  }
  const onClick2QuestionResult = (e, id) => {
    e.preventDefault()
    return navigate(generatePath('/questions/:id', { id }))
  }
  const optionTabs = [
    {
      ttl: 'UnansweredQuestions',
      table: <table className='questions-table'>
      <tbody>
      <tr>
        <th></th>
        <th colSpan='2'>Question</th>
        <th>Created By</th>
        <th>Your Answer</th>
        <th>Result</th>
      </tr>
      {Object.values(questions).reverse().map((x, i)=> (
        <>
        {isQMatched(x)?
        undefined:<tr key={i} className='questions-row'>
          <td data-testid='questions'>{i+1}</td>
            <td className='vote-result' onClick={(e) => onClick2QuestionResult(e, x.id)}>Would you rather choose {x.optionOne.text} or {x.optionTwo.text}?</td>
            <td style={{display:'flex'}}>
            </td>
            <td>{new Date(x.timestamp).getUTCMonth() + 1}.{new Date(x.timestamp).getUTCDate()}.{new Date(x.timestamp).getUTCFullYear()} {x.author}</td>
              {dataVoteUpdateId === x.id ? (
              <td style={{display:'contents'}}>
              <form>
                <div>
                  <input data-testid='voteThisChoice' type='radio' id='voteChoice1' name='vote' value={x.optionOne.text} onChange={e => setVote(e.target.value)}/>
                  <label htmlFor='voteChoice1'>{x.optionOne.text}</label>
                  <input type='radio' id='voteChoice2' name='vote' value={x.optionTwo.text} onChange={e => setVote(e.target.value)}/>
                  <label htmlFor='voteChoice2'>{x.optionTwo.text}</label>
                </div>
              </form>
              <div className='cell-btns'>
                <button type='button' onClick={onClick2CancelVoteUpdate} style={{background: 'none', border: 'none', alignItems: 'center', color:'black',transform: 'rotate(180deg)'}}><TurnRightIcon/>
                </button><button className='cell-vote-btn' onClick={(e) => onClick2SaveVoteUpdate(e, x.id)} disabled={!vote}>Vote</button>
              </div>
            </td>
            ):(
              <td data-testid='answers' style={{textAlign:'center'}}>
              {isQMatched(x)? <span style={{textAlign:'center'}}>
              {loginedusers[0].answers[loginedusers[0].aId.findIndex((y) => y === x.id)]==='optionOne'? <>{x.optionOne.text}</>:<>{x.optionTwo.text}</>}
              </span>:<button className='cell-vote-btn' onClick={(e)=>onClick2VoteUpdate(e, x.id)}>Vote now!</button>}</td>
            )}
          <td>{x.optionOne.text}:{x.optionOne.votes.length}<br/>{x.optionTwo.text}:{x.optionTwo.votes.length}</td>
          </tr>
        }
        </>
      ))}
      </tbody>
  </table>
    },
    {
      ttl: 'AnsweredQuestions',
      table:<table className='questions-table'>
      <tbody>
      <tr>
        <th></th>
        <th colSpan='2'>Question</th>
        <th>Created By</th>
        <th>Your Answer</th>
        <th>Result</th>
      </tr>
      {Object.values(questions).reverse().map((x, i)=> (
        <>
        {isQMatched(x)?
        <tr key={i} className='questions-row'>
          <td data-testid='questions'>{i+1}</td>
            <td className='vote-result' onClick={(e) => onClick2QuestionResult(e, x.id)}>Would you rather choose {x.optionOne.text} or {x.optionTwo.text}?</td>
            <td style={{display:'flex'}}>
            </td>
            <td>{new Date(x.timestamp).getUTCMonth() + 1}.{new Date(x.timestamp).getUTCDate()}.{new Date(x.timestamp).getUTCFullYear()} {x.author}</td>
              {dataVoteUpdateId === x.id ? (
              <td style={{display:'tables'}}>
              <form>
                <div>
                  <input data-testid='voteThisChoice' type='radio' id='voteChoice1' name='vote' value={x.optionOne.text} onChange={e => setVote(e.target.value)}/>
                  <label htmlFor='voteChoice1'>{x.optionOne.text}</label>
                  <input type='radio' id='voteChoice2' name='vote' value={x.optionTwo.text} onChange={e => setVote(e.target.value)}/>
                  <label htmlFor='voteChoice2'>{x.optionTwo.text}</label>
                </div>
              </form>
              <div className='cell-btns'>
                <button type='button' onClick={onClick2CancelVoteUpdate} style={{background: 'none', border: 'none', alignItems: 'center', color:'black',transform: 'rotate(180deg)'}}><TurnRightIcon/>
                </button><button className='cell-vote-btn' onClick={(e) => onClick2SaveVoteUpdate(e, x.id)} disabled={!vote}>Vote</button>
              </div>
            </td>
            ):(
              <td data-testid='answers' style={{textAlign:'center'}}>
              {isQMatched(x)? <span style={{textAlign:'center'}}>
              {loginedusers[0].answers[loginedusers[0].aId.findIndex((y) => y === x.id)]==='optionOne'? <>{x.optionOne.text}</>:<>{x.optionTwo.text}</>}
              </span>:<button className='cell-vote-btn' onClick={(e)=>onClick2VoteUpdate(e, x.id)}>Vote now!</button>}</td>
            )}
          <td>{x.optionOne.text}:{x.optionOne.votes.length}<br/>{x.optionTwo.text}:{x.optionTwo.votes.length}</td>
          </tr>:undefined
        }
        </>
      ))}
      </tbody>
  </table>
    }
  ]
  return (
  <>
   <div>
        {optionTabs.map((x, i) => (
          <button
            key={i}
            onClick={() => setSelectedTable(x.ttl)}
            className={selectedTable === x.ttl ? 'table-selected':undefined}
            style={{display:'inline-block', margin: '0 4px', cursor:'pointer', fontSize:'12px', border:'none',background:'#fff'}}
          >
            {x.ttl}
          </button>
        ))}
      </div>
      <div>
        {optionTabs.map((x, i) => x.ttl === selectedTable && <div key={i}>{x.table}</div>)}
      </div>
  </>
  )
}
export const App = () =>  {
  const loginedusers = useSelector((state)=> state.loginedusers)
  const dispatch = useDispatch()
  const onClick3Logout = async (id) => {
    await dispatch(logoutU({id:id}))
  }
  return(
  <>
      {loginedusers.length === 0 ?(<>
      <HeaderNav2/>
      <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='*' element={<Login/>}/>
      </Routes>
      </>):undefined}
      {loginedusers.map((x, i)=> (<div key={i}>
       <HeaderNav onClick2Logout={() => onClick3Logout(x.id)}/>
      <Routes>
      <Route exact path='/' element={<QuestionList/>}/>
      <Route path='/questions/:id' element={<Result/>}/>
      <Route path='/add' element={<Create/>}/>
      <Route path='/leaderboard' element={<Leaderboard/>}/>
      <Route path="/404" element={<NotFoundPage/>}/>
      <Route path="*" element={<Navigate replace to="/404"/>}/>
      </Routes>
      </div>))}
  </>
  )
}
export const HeaderNav = ({onClick2Logout = () => {}}) => {
  var loginedusers = useSelector((state)=> state.loginedusers)
  return (
    <div className='nav-header'>
    <div className='nav-items'>
    <h1 className='nav-ttl'><b>React Udacity App</b></h1>
      <Link to='/' className='nav-item'>Vote</Link>
      <Link to='/add' className='nav-item'>Create Question</Link>
      <Link to='/leaderboard' className='nav-item'>Ranking</Link>
    </div>
      <div data-testid='loginuser' className='nav-display'>username:{loginedusers[0].name}<button onClick={() => onClick2Logout()} style={{background: 'none', border: 'none'}} className='nav-icon'><LogoutIcon/></button></div>
    </div>
  )
}
export const HeaderNav2 = () => {
  return (
    <div className='nav-header'>
    <h1 className='nav-ttl'><b>React Udacity App</b></h1>
    </div>
  )
}
export default App
