import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { voteBlog, deleteBlog, commentBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useState } from 'react'
import { Button, Form, Table } from 'react-bootstrap'

const SingleBlog = () => {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const id = useParams().id
  const blog = blogs.find((n) => n.id === String(id))
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (!blog || !user) {
    return null
  }

  const addedBy = blog.user && blog.user.name ? blog.user.name : 'anonymous'
  const own = blog.user && user.username === blog.user.username

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

  const handleSubmit = (event) => {
    event.preventDefault()
    const response = { content: comment }
    dispatch(commentBlog(blog.id, response)).catch((error) => {
      notify('creating a blog failed: ' + error.response.data.error, 'alert')
    })
    setComment('')
  }

  return (
    <div className='container'>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>{blog.likes} likes</div>
      <Button variant='success' onClick={() => likeBlog(blog.id)}>
        like
      </Button>
      <div>added by {addedBy} </div>
      {own && (
        <Button variant='secondary' onClick={() => removeBlog(blog.id)}>
          remove
        </Button>
      )}
      <h2>comments</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            id='commentInput'
          />
          <Button id='comment-button' type='submit'>
            add comment
          </Button>
        </Form.Group>
      </Form>

      <Table striped>
        <tbody>
          {blog.comments.map((value, key) => (
            <tr key={key}>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default SingleBlog
