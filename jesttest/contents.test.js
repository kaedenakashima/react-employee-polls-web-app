import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer'
import {Provider} from 'react-redux'
import {App, store, loginU, HeaderNav, HeaderNav2, QuestionList, Create} from '../src/App'
import Login from '../src/components/Login'
import {BrowserRouter} from 'react-router-dom'
import {_getUsers, _getQuestions, _saveQuestion, _saveQuestionAnswer} from '../src/_DATA'
test('test#1 Renders app title', () => {
    render(<BrowserRouter><Provider store={store}><HeaderNav2/></Provider></BrowserRouter>)
    const res = screen.getByText(/React Udacity App/i)
    expect(res).toBeInTheDocument()
})
test('test#2 App component snapshot test ', ()=> {
    const component = renderer.create(<BrowserRouter><Provider store={store}><App /></Provider></BrowserRouter>)
    let res = component.toJSON()
    expect(res).toMatchSnapshot()
})
const mockLoginUser = jest.fn()
test('test#3 login with correct user', async() => {
        let {getAllByTestId,getByTestId} = render(
            <BrowserRouter><Provider store={store}><Login setTxt={mockLoginUser} /></Provider></BrowserRouter>
        )
        const res1 = getAllByTestId('users')
        const res2 = await _getUsers()
        expect(Object.values(res1).length).toEqual(Object.values(res2).length)
        
        const res3 = getByTestId('select')
        fireEvent.change(res3, {target: {value:'tylermcginnis'}}) 
        expect(res3.value).toBe('tylermcginnis')
        const res4 = screen.getByRole('button', {name: 'Login'})
        fireEvent.click(res4)
})
const mockLoginedUser = [ { "id": "tylermcginnis", "name": "Tyler McGinnis", "aId": [ "vthrdm985a262al8qx3do", "xj352vofupe1dqz9emx13r" ], "answers": [ "optionOne", "optionTwo" ], "questions": [ "loxhs1bqm25b708cmbf3g", "vthrdm985a262al8qx3do" ] } ]
test('test#4 Header shows logined user name', async() => {
    const onClick2LoginSpy = async (e) => {
        e.preventDefault()
        if(txt){
            var selectedusers = Object.values(users).find(x => x.id === txt)
            await dispatch(loginU({id: selectedusers.id, name:selectedusers.name, aId:Object.keys(selectedusers.answers),answers:Object.values(selectedusers.answers), questions: selectedusers.question})) 
        }
    }
    const {getByTestId} = render(<BrowserRouter><Provider store={store}><Login setTxt={mockLoginUser} onClick2Login={onClick2LoginSpy} />
    <HeaderNav selecteduser={mockLoginedUser}/>
    </Provider></BrowserRouter>)
    const res1 = getByTestId('select')
    fireEvent.change(res1, {target: {value:'tylermcginnis'}}) 
    expect(res1.value).toBe('tylermcginnis')
    const res2 = screen.getByRole('button', {name: 'Login'})
    expect(res2).not.toBeDisabled()
    await userEvent.click(res2)
    expect(onClick2LoginSpy)
    expect(screen.getByText(/username:Tyler McGinnis/i)).toBeInTheDocument()
})
test('test#5 _getQuestions():Question displays all initial qestions.', async() => {
        const {getAllByTestId} = render(<BrowserRouter><Provider store={store}><QuestionList/></Provider></BrowserRouter>)
        const res1 = getAllByTestId('questions').length
        const x = screen.getByRole('button', {name: 'AnsweredQuestions'})
        fireEvent.click(x)
        const res2 = getAllByTestId('questions').length
        console.log('---------------------------------------',res2)
        const res3 = await _getQuestions()
        expect(res1+res2).toEqual(Object.values(res3).length)
        
})
test('test#6 _saveQuestion():Question is saved with correct format.', async() => {
    const mockChoice1 = jest.fn()
    const mockChoice2 = jest.fn()
    var {getAllByTestId, getByTestId} = render(<BrowserRouter><Provider store={store}><Create setTxt1={mockChoice1} setTxt2={mockChoice2}/></Provider></BrowserRouter>)
    const res1 = getByTestId('choice1')
    const res2 = getByTestId('choice2')
    fireEvent.change(res1, {target: {value:'Eat apple'}}) 
    fireEvent.change(res2, {target: {value:'Eat orange'}}) 
    expect(res1.value).toBe('Eat apple')
    expect(res2.value).toBe('Eat orange')
    const res3 =  await _saveQuestion({ optionOneText:res1.value, optionTwoText:res2.value, author:'tylermcginnis' })
    expect( Object.keys(res3)).toContain('id', 'timestamp', 'author', 'optionOne', 'optionTwo')
    const res4 = await _getQuestions()
    expect(Object.values(res4).length).toEqual(7)
    var {getAllByTestId, getByTestId} = render(<BrowserRouter><Provider store={store}><QuestionList /></Provider></BrowserRouter>)
    const res5 = getAllByTestId('questions').length
    const x = screen.getByRole('button', {name: 'AnsweredQuestions'})
    fireEvent.click(x)
    const res6 = getAllByTestId('questions').length
    expect(res5+res6).toEqual(Object.values(res4).length)
})
test('test#7 _saveQuestion(): error returns when user input wrong data', () => {
    const mockChoice1 = jest.fn()
    const mockChoice2 = jest.fn()
    const mockError = jest.fn()
    var {getByTestId} = render(<BrowserRouter><Provider store={store}><Create setTxt1={mockChoice1} setTxt2={mockChoice2} setError={mockError} /></Provider></BrowserRouter>)
    const a = getByTestId('choice1')
    const b = getByTestId('choice2')
    fireEvent.change(a, {target: {value:''}}) 
    fireEvent.change(b, {target: {value:'Eat orange'}}) 
    const c = screen.getByRole('button', {name: '+'})
    fireEvent.click(c)
    const d = getByTestId('error').textContent
    expect(d).toBe('*Please add both Choice1 and Choice2')
})
test('test#8 _getQuestions(): My answered item displays for each qestions correctly.', async() => {
    const questions = Object.values(await _getQuestions())
    render(<BrowserRouter><Provider store={store}><QuestionList/></Provider></BrowserRouter>)
    var loginedusers = [ { "id": "tylermcginnis", "name": "Tyler McGinnis", "aId": [ "vthrdm985a262al8qx3do", "xj352vofupe1dqz9emx13r" ], "answers": [ "optionOne", "optionTwo" ], "questions": [ "loxhs1bqm25b708cmbf3g", "vthrdm985a262al8qx3do" ] } ]
    const isQMatched = (a) => {
    const y = loginedusers[0].aId.find(x => x == a.id)
        if(y){
            return true
            }
        }
    var a = Object.values(questions)[4]
    var a2 = isQMatched(a)? loginedusers[0].answers[loginedusers[0].aId.findIndex((y) => y == a.id)]==='optionOne'? a.optionOne.text:a.optionTwo.text:'vote now'
    expect(a2).toBe('find $50 yourself')
    a = Object.values(questions)[5]
    a2 = isQMatched(a)? loginedusers[0].answers[loginedusers[0].aId.findIndex((y) => y == a.id)]==='optionOne'? a.optionOne.text:a.optionTwo.text:'vote now'
    expect(a2).toBe('write Swift')
})
test('test#9 _saveQuestionAnswer(): answer is saved with correct format', async () => {
    const mockVote = jest.fn()
    const mockId = jest.fn()
    var {getByTestId} = render(<BrowserRouter><Provider store={store}><QuestionList setData2VoteUpdate={mockVote} setData2VoteUpdateId={mockId} /></Provider></BrowserRouter>)
    fireEvent.click(screen.getAllByRole('button', {name: 'Vote now!'})[0])
    fireEvent.change(getByTestId('voteThisChoice'), {target: {value:'optionOne'}})
    fireEvent.click(screen.getByRole('button', {name: 'Vote'}))
    var answers = await _getUsers()
    var questions = await _getQuestions()
    expect(Object.keys(Object.values(answers)[1].answers).length).toEqual(2)
    expect(Object.values(questions)[0].optionOne.votes.length).toEqual(1)
    const res1 = await _saveQuestionAnswer({ authedUser:'tylermcginnis', qid: Object.values(questions)[0].id, answer:'optionOne'})
    expect(res1).toBe('ok!');
    answers = await _getUsers()
    questions = await _getQuestions()
    expect(Object.keys(Object.values(answers)[1].answers).length).toEqual(3)
    expect(Object.values(questions)[0].optionOne.votes.length).toEqual(2)
})
test('test#10 _saveQuestionAnswer(): button is disabled when user did not select a choice', () => {
    const mockVote = jest.fn()
    const mockId = jest.fn()
    var {getByTestId} = render(<BrowserRouter><Provider store={store}><QuestionList setData2VoteUpdate={mockVote} setData2VoteUpdateId={mockId} /></Provider></BrowserRouter>)
    fireEvent.click(screen.getAllByRole('button', {name: 'Vote now!'})[0])
    fireEvent.change(getByTestId('voteThisChoice'), {target: {value:''}})
    expect(screen.getByRole('button', {name: 'Vote'})).toHaveAttribute('disabled');
})