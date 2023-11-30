import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';
import { Input, Panel, Submit } from './Profile'


export default function Register() {

  const navigate = useNavigate()
  const [file, setFile] = useState()

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: ''
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || '' })
      let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Registration Successful...!</b>,
        error: <b>Could not Register.</b>
      });

      registerPromise.then(function () { navigate('/') });
    }
  })

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <Panel>

      <div className="title flex flex-col items-center">
        <h4 className='text-5xl font-light'>Register</h4>
      </div>

      <form
        className='py-1'
        onSubmit={formik.handleSubmit}>
        <div className='profile flex justify-center py-2'>
          <label htmlFor="profile">
            <img
              src={file || avatar}
              className="border-4 border-gray-100 w-[150px] rounded-full shadow-lg cursor-pointer hover:border-gray-400 mx-auto" alt="avatar" />
          </label>

          <input
            className='hidden'
            onChange={onUpload}
            type="file"
            id='profile'
            name='profile' />
        </div>

        <div className="textbox grid grid-flow-row justify-center gap-2">
          <Input
            name="Email"
            props={formik.getFieldProps("email")} />
          <Input
            name="Username"
            props={formik.getFieldProps("username")} />
          <Input
            name="Password"
            props={formik.getFieldProps("password")} />
          <Submit name="Register" />
        </div>

        <div className="text-center py-2">
          <span className='text-gray-500'>Already Registered? <Link className='text-red-500' to="/">Login Now</Link></span>
        </div>

      </form>

    </Panel>
  )
}

