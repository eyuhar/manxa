import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Discover from './pages/Discover'
import History from './pages/History'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import MyManxa from './pages/MyManxa'
import Profile from './pages/Profile'
import ProtectedRoute from "./components/ProtectedRoute"
import ManxaDetail from './pages/ManxaDetail'
import ChapterReader from './pages/ChapterReader'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="discover" element={<Discover />} />
          <Route path="myManxa" element={<ProtectedRoute><MyManxa /></ProtectedRoute>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='manxa/:title' element={<ManxaDetail />} />
          <Route path="/manxa/:title/:chapter" element={<ChapterReader />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
