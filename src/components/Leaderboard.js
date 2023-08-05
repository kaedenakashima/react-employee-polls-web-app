import React from 'react'
import {users, _getUsers} from '../_DATA'
export function Leaderboard() {
    _getUsers()
    const usersRanked = Object.keys(users).sort((x, y) => (Object.keys(users[y].answers).length + users[y].questions.length) - (Object.keys(users[x].answers).length + users[x].questions.length)).map((x)=> users[x])
    return (
      <>
        <b>Top 3 active users</b>
        <table className='questions-table ttl-table'>
         <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Questions/Answers</th>
          </tr>
         </thead>
          <tbody>
          {usersRanked.map((x, i)=> (
            <tr key={x.id} className='questions-row'>
            <td>{i+1}</td>
            <td style={{display:'flex', width: 'max-content'}}><img src={x.avatarURL} className='user-icon' alt='avatar'/><div className='user-name'>{x.name}</div></td>
            <td>{x.questions.length}/{Object.keys(x.answers).length}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </>
    )
}
export default Leaderboard