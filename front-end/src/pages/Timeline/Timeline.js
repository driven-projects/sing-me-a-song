import { Outlet } from 'react-router-dom'
import React from 'react'
import Header from '../../components/Header/Header'
import Menu from '../../components/Menu/Menu'

export default function Timeline() {
  return (
    <>
      <Header />
      <Menu />
      <Outlet />
    </>
  )
}
