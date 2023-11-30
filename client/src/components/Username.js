import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'
import { Input, Panel, Submit } from './Profile'


export default function Username() {

  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);

  const formik = useFormik({
    initialValues: {
      username: ''
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      setUsername(values.username);
      navigate('/password')
    }
  })

  return (
    <Panel>

      <div className="title flex flex-col items-center py-2">
        <h4 className='text-4xl font-light'>Hello! There</h4>
      </div>

      <form
        className='py-1'
        onSubmit={formik.handleSubmit}>
        <div className='profile flex justify-center py-4'>
          <img
            src={avatar}
            className="w-[150px] rounded-full shadow-lg cursor-pointer hover:border-gray-400 mx-auto"
            alt="avatar" />
        </div>

        <div className="textbox flex flex-col items-center gap-5">
          <Input
            name="Username"
            props={formik.getFieldProps("username")} />
          <Submit name="Let's Go" />
        </div>

        <div className="text-center py-4">
          <span className='text-gray-500'>Not a Member <Link className='text-red-500' to="/register">Register Now</Link></span>
        </div>

      </form>

    </Panel>
  )
}
