import React, { useState } from 'react'
import PT from 'prop-types'
import { axiosWithAuth } from '../axios'


const initialFormValues = {
  username: '',
  password: '',
}

export default function LoginForm(props) {
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here
const {login } = props
  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
    console.log(values)
  }



  const onSubmit = evt => {
    evt.preventDefault()
    login(values)
    setValues(initialFormValues)
  }

  return (
    <form id="loginForm" >
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={values.username.trim().length >= 3 && values.password.length >= 8 ? false : true} 
      id="submitCredentials"
      onClick={onSubmit}
      >
      Submit credentials
      </button>

    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
}
