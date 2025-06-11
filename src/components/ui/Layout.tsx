import { Outlet } from 'react-router-dom'
import Header from './Header'
import type { JSX } from 'react'

export default function Layout(): JSX.Element {
  return (
    <>
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  )
}
