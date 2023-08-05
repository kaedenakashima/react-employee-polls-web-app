import React, {useState} from 'react'
import {users, _getUsers} from '../_DATA'
import {useDispatch} from 'react-redux'
import {loginU} from '../App'
export function Login() {
    _getUsers()
    const dispatch = useDispatch()
    const [txt, setTxt]=useState(null)
    const onClick2Login = async (e) => {
      e.preventDefault()
      if(txt){
        const selectedusers = Object.values(users).find(x => x.id === txt)
        await dispatch(loginU({id: selectedusers.id, name:selectedusers.name, aId:Object.keys(selectedusers.answers),answers:Object.values(selectedusers.answers), questions: selectedusers.questions}))
      }
    }
    return (
      <>
      <b>Login</b><br/>
      Please select your account<br/>
      User: <select data-testid='select' style={{width: '180px'}} onChange={e => setTxt(e.target.value)}>
      <option value=''>-----Please select--------</option>
        {Object.values(users).map((x, i)=> (<option data-testid='users' key={i} value={x.id}>{x.name}</option>))}
      </select><br/>
      <button data-testid="login" onClick={(e) => onClick2Login(e)} disabled={!txt}>Login</button>
      </>
    )
  }
export default Login
