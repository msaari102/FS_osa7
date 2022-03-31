import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { voteBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const SingleBlog = () => {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const id = useParams().id
  const blog = blogs.find((n) => n.id === String(id))

  if (!blog || !user) {
    return null
  }
  const addedBy = blog.user && blog.user.name ? blog.user.name : 'anonymous'
  const own = blog.user && user.username === blog.user.username
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const likeBlog = async (id) => {
    const toLike = blogs.find((b) => b.id === id)
    const liked = {
      ...toLike,
      likes: (toLike.likes || 0) + 1,
      user: toLike.user.id,
    }
    dispatch(voteBlog(liked))
  }

  const notify = (message, type = 'info') => {
    dispatch(setNotification(message, type, 5))
  }

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
    navigate('/')
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>{blog.likes} likes</div>
      <button onClick={() => likeBlog(blog.id)}>like</button>
      <div>added by {addedBy} </div>
      {own && <button onClick={() => removeBlog(blog.id)}>remove</button>}
    </div>
  )
}

export default SingleBlog
