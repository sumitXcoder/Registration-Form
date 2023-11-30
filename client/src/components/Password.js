import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../helper/validate'
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store'
import { verifyPassword } from '../helper/helper'
import { Input, Panel, Submit } from './Profile'

export default function Password() {

  const navigate = useNavigate()
  const { username } = useAuthStore(state => state.auth)
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`)

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {

      let loginPromise = verifyPassword({ username, password: values.password })
      toast.promise(loginPromise, {
        loading: 'Checking...',
        success: <b>Login Successful!</b>,
        error: <b>Wrong Password!</b>
      });

      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/profile')
      })
    }
  })

  if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <Panel>

      <div className="title flex flex-col items-center">
        <h4 className='text-5xl font-light'>Hello {apiData?.firstName || apiData?.username}</h4>
      </div>

      <form
        className='py-1'
        onSubmit={formik.handleSubmit}>
        <div className='profile flex justify-center py-4'>
          <img
            src={apiData?.profile || avatar}
            className="border-4 border-gray-100 w-[150px] rounded-full shadow-lg cursor-pointer hover:border-gray-400 mx-auto" alt="avatar" />
        </div>

        <div className="textbox flex flex-col items-center gap-6">
          <Input
            name="Password"
            props={formik.getFieldProps('password')} />
          <Submit name="Sign in" />
        </div>

        <div className="text-center py-4">
          <span className='text-gray-500'>Forgot Password? <Link className='text-red-500' to="/recovery">Recover Now</Link></span>
        </div>

      </form>

    </Panel>
  )
}
