import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from '../components/Blog'
import { voteBlog, deleteBlog, create } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import Togglable from '../components/Togglable'
import NewBlogForm from '../components/NewBlogForm'

const UserList = () => {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  const removeBlog = (id) => {
    const toRemove = blogs.find((b) => b.id === id)

    const ok = window.confirm(
      `remove '${toRemove.title}' by ${toRemove.author}?`
    )

    if (!ok) {
      return
    }

    dispatch(deleteBlog(id))
    notify('blog deleted')
  }

  const notify = (message, type = 'info') => {
    dispatch(setNotification(message, type, 5))
  }

  const likeBlog = async (id) => {
    const toLike = blogs.find((b) => b.id === id)
    const liked = {
      ...toLike,
      likes: (toLike.likes || 0) + 1,
      user: toLike.user.id,
    }
    dispatch(voteBlog(liked))
  }

  const createBlog = async (blog) => {
    dispatch(create(blog)).catch((error) => {
      notify('creating a blog failed: ' + error.response.data.error, 'alert')
    })
    blogFormRef.current.toggleVisibility()
  }

  return (
    <div>
      <Togglable buttonLabel='new note' ref={blogFormRef}>
        <NewBlogForm onCreate={createBlog} />
      </Togglable>

      <div id='blogs'>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              likeBlog={likeBlog}
              removeBlog={removeBlog}
              user={user}
            />
          ))}
      </div>
    </div>
  )
}

export default UserList
