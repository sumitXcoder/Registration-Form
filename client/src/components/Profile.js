import React, { useState } from 'react'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook';
import { updateUser } from '../helper/helper'
import { useNavigate } from 'react-router-dom'

export default function Profile() {

  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || ''
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' })
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: <b>Updated Successfully...!</b>,
        error: <b>Could not Update!</b>
      });

    }
  })

  function Avatar() {
    return (
      <div className='profile w-full row-span-2'>
        <label htmlFor="profile">
          <img
            src={apiData?.profile || file || avatar}
            className="w-[150px] rounded-full shadow-lg cursor-pointer mx-auto mt-1"
            alt="avatar" />
        </label>
        <input
          className="hidden"
          onChange={onUpload}
          type="file"
          id='profile'
          name='profile' />
      </div>
    )
  }

  async function onUpload(e) {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  function userLogout() {
    localStorage.removeItem('token');
    navigate('/')
  }

  if (isLoading) return <h1 className='text-2xl font-bold mx-auto w-min mt-[45vh]'>Loading...</h1>;
  if (serverError) return <h1 className='text-xl text-red-500 mx-auto w-min mt-[45vh]'>{serverError.message}</h1>

  return (
    <Panel>
      <div className="title flex flex-col items-center">
        <h4 className='text-5xl font-light'>Profile</h4>
        <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
          You can update the details.
        </span>
      </div>

      <form className='py-1' onSubmit={formik.handleSubmit}>

        <div className="sm:grid sm:grid-flow-col sm:grid-rows-5 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-1 max-w-[750px] mx-auto flex flex-col mx-auto gap-y-2">
          <Avatar />
          <Input
            name="First Name"
            props={formik.getFieldProps("firstName")} />
          <Input
            name="Last Name"
            props={formik.getFieldProps("lastName")} />
          <button
            className="border bg-green-400 w-1/5 rounded-lg text-white text-xl shadow-sm my-3 mx-auto active:translate-y-1 col-span-2 hidden sm:block"
            type='submit'>Save</button>
          <Input
            name="Phone No."
            props={formik.getFieldProps("mobile")} />
          <Input
            name="Email"
            props={formik.getFieldProps("email")} />
          <Input
            name="Address"
            props={formik.getFieldProps("address")} colSpan="2" />
          <button
            className="border bg-green-400 w-1/3 py-2 rounded-lg text-white text-xl shadow-sm my-2 mx-auto active:translate-y-1 sm:hidden" type='submit'>Save</button>
        </div>

        <div className="text-center py-3">
          <span className='text-gray-500'>Come back later?
            <button
              onClick={userLogout}
              className='text-red-500' to="/">Logout</button></span>
        </div>
      </form>
    </Panel>
  )
}

export function Panel({ children }) {
  return (
    <div className="container mx-auto">
      <Toaster
        position='top-center'
        reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center p-2 min-h-[100dvh]'>
        <div className='bg-[rgba(252, 252, 252, 0.5)] rounded-2xl shadow-[0_0_10px_1px_rgba(25,25,25,.25)] border-2 border-gray-250 p-2'>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Input({ name, props, colSpan = 1 }) {

  const styles = "bg-[#e8e8e899] px-4 py-3 rounded-xl text-lg w-full shadow-[inset_3px_3px_7px_#bebebe,inset_-3px_-3px_7px_#ffffff] focus:shadow-[inset_-3px_-3px_7px_#bebebe,inset_3px_3px_7px_#ffffff] outline-none border-2 border-gray-250";
  return (
    <div className={`h-full row-span-${colSpan}`}>
      <span className='ml-2 py-4 text-sm text-left text-gray-500'>
        {name}
      </span>{
        name === "Address" ?
          <textarea {...props} className={`${styles} h-[125px] sm:h-[85%]`} type="text" /> :
          <input {...props} className={styles} type="text" />
      }
    </div>
  )
}

export function Submit({ name }) {
  return (
    <button
      className="border bg-green-400 w-1/3 py-2 rounded-lg text-white text-xl shadow-sm my-2 mx-auto active:translate-y-1"
      type='submit'>
      {name}
    </button>
  )
}

