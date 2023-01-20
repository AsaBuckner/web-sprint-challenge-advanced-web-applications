import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import { useEffect } from 'react'
import { axiosWithAuth } from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [currentArticle, setCurrentArticle] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { 
    navigate('/')
   }
   const redirectToArticles = () => { 
    navigate('/articles')
  }
  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('')
    setSpinnerOn(true)
     // and launch a request to the proper endpoint.
     axios.post(`http://localhost:9000/api/login`,({ 'username': username, 'password': password}), { validateStatus: function (status) { return status >= 200 && status < 300 || status === 401 } })
    .then(res=>{
       // On success, we should set the token to local storage in a 'token' key,
      localStorage.setItem('token',res.data.token)
       // put the server success message in its proper state, and redirect
      setMessage(res.data.message)
      // to the Articles screen. Don't forget to turn off the spinner!
      setSpinnerOn(false)
      redirectToArticles()
    })
    .catch(err=> {
      console.log(err)
      setSpinnerOn(false)
      setMessage(err.response.data.message)
    })
    }

  const simpleGet = () => {
    axiosWithAuth().get('http://localhost:9000/api/articles')
      .then(res => {    
        setArticles(res.data.articles)
      })
  }


  const getArticles = () => {
    // ✨ implement 
    // We should flush the message state, turn on the spinner
    setMessage('')
    setSpinnerOn(true)
    // and launch an authenticated request to the proper endpoint
    axiosWithAuth().get('http://localhost:9000/api/articles')
      .then(res => {    
        // On success, we should set the articles in their proper state and
        setArticles(res.data.articles)
        console.log(res.data)
        // put the server success message in its proper state.
        setMessage(res.data.message)
        setSpinnerOn(false)
      }).catch(err => {
          console.log(err.response);
              setSpinnerOn(false)
          })
     
      console.log(articles);      
    }
  

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    axiosWithAuth().post('http://localhost:9000/api/articles',article)
    .then(res=>{
      setArticles([...articles, res.data.article ])
      setMessage(res.data.message)
      
    })
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = ( article_id, article ) => {
    // ✨ implement
    // You got this!
    axiosWithAuth().put(`http://localhost:9000/api/articles/${article_id}`,article)
    .then(res=>{
      setMessage(res.data.message)
      
    })
    .finally(()=>{
      simpleGet()
    })
  }

  const deleteArticle = article_id => {
    setSpinnerOn(true)
    axiosWithAuth().delete( `http://localhost:9000/api/articles/${article_id}`)
    .then(res =>{
      setMessage(res.data.message)
      simpleGet()
      setSpinnerOn(false)
     
    })
  }




  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} updateArticle={updateArticle} currentArticle={currentArticle} setCurrentArticle={setCurrentArticle} currentArticleId={currentArticleId} setCurrentArticleId={setCurrentArticleId}/>
              <Articles redirectToLogin={redirectToLogin} articles={articles} deleteArticle={deleteArticle} getArticles={getArticles} setCurrentArticle={setCurrentArticle} setCurrentArticleId={setCurrentArticleId}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
