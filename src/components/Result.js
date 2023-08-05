import React, {useEffect} from 'react'
import {questions, _getQuestions, users, _getUsers} from '../_DATA'
import {useParams, useNavigate} from 'react-router-dom'
import {keyframes} from 'styled-components'

export function Result() {
  _getQuestions()
  _getUsers()
  const navigate = useNavigate()
  const {id} = useParams()
  const votedQ = Object.values(questions).filter((x)=> x.id === id)
  useEffect(() => {
    if (votedQ.length !== 1) {
      return navigate('/404')
    }
  })
  if (votedQ.length === 1) {
    const votedU = Object.values(users).filter((x)=> x.id === votedQ[0].author)
    const percentabeOptionOne = Math.floor(votedQ[0].optionOne.votes.length/(votedQ[0].optionOne.votes.length+votedQ[0].optionTwo.votes.length)*100)
    const percentabeOptionTwo = Math.floor(votedQ[0].optionTwo.votes.length/(votedQ[0].optionOne.votes.length+votedQ[0].optionTwo.votes.length)*100)
    var animationBarWidth1 = keyframes`
     0% {width: 0}
     100% {width: ${percentabeOptionOne}%}
    `
    var animationBarWidth2 = keyframes`
     0% {width: 0}
     100% {width: ${percentabeOptionTwo}%}
    `
    var animationBar1 = {animation: `${animationBarWidth1} .5s 0s forwards`}
    var animationBar2 = {animation: `${animationBarWidth2} .5s 0s forwards`}
     return(
       <>
         <h2>Thanks for your vote!</h2><br/>
         <p>Would you rather..</p>
           <div className='progress-bar-container'>
             <div>{votedQ[0].optionOne.text}:{votedQ[0].optionOne.votes.length} <div className='progress-bar'><div className='progress-bar-optionOne' style={animationBar1}></div><span>{percentabeOptionOne}%</span></div></div>
             <div>{votedQ[0].optionTwo.text}:{votedQ[0].optionTwo.votes.length} <div className='progress-bar'><div className='progress-bar-optionTwo' style={animationBar2}></div>
             <span>{percentabeOptionTwo}%</span></div></div>
           </div>
           <p style={{fontSize:'12px'}}>This question is created by:<img src={votedU[0].avatarURL} alt='avatar' className='user-icon-detail' /> {votedQ[0].author} on {new Date(votedQ[0].timestamp).getUTCMonth() + 1}.{new Date(votedQ[0].timestamp).getUTCDate()}.{new Date(votedQ[0].timestamp).getUTCFullYear()}</p>
       </>
     )
  } 

}
 
export default Result