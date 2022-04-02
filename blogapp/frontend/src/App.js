import { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from 'react-router-dom'

import LoginForm from './components/LoginForm'

import Notification from './components/Notification'

import UserList from './components/UserList'
import BlogList from './components/BlogList'
import SingleBlog from './components/SingleBlog'
import loginService from './services/login'
import { initializeUsers } from './reducers/usersReducer'

import { setNotification } from './reducers/notificationReducer'
import { initUser, setUser, logoutUser } from './reducers/userReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Button } from 'react-bootstrap'

const App = () => {
  const user = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)
  const padding = {
    padding: 5,
  }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    dispatch(initUser())
  }, [])

  const login = async (username, password) => {
    loginService
      .login({
        username,
        password,
      })
      .then((user) => {
        dispatch(setUser(user))
      })
      .catch(() => {
        notify('wrong username/password', 'alert')
      })
  }

  const logout = () => {
    dispatch(logoutUser())
  }

  const notify = (message, type = 'info') => {
    dispatch(setNotification(message, type, 5))
  }

  if (user === null) {
    return (
      <>
        <Notification />
        <LoginForm onLogin={login} />
      </>
    )
  }

  const User = () => {
    const id = useParams().id
    const user = users.find((n) => n.id === String(id))
    if (!user) {
      return null
    }
    return (
      <div>
        <h2>{user.name}</h2>
        <h3>
          <b>added blogs</b>
        </h3>
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>
              <>{blog.title}</>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className='container'>
      <Router>
        <Navbar collapseOnSelect expand='lg' bg='light' variant='light'>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='mr-auto'>
              <Nav.Link href='#' as='span'>
                <Link style={padding} to='/blogs'>
                  blogs
                </Link>
              </Nav.Link>
              <Nav.Link href='#' as='span'>
                <Link style={padding} to='/users'>
                  users
                </Link>
              </Nav.Link>
              <Nav.Link href='#' as='span'>
                {user.name} logged in
              </Nav.Link>
              <Button onClick={logout}>logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className='container'>
          <h2>blogs</h2>
        </div>

        <Notification />

        <Routes>
          <Route path='/blogs' element={<BlogList />} />
          <Route path='/blogs/:id' element={<SingleBlog />} />
          <Route path='/' element={<BlogList />} />
          <Route path='/users' element={<UserList />} />
          <Route path='/users/:id' element={<User />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
