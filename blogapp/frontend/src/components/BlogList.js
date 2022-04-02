import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { create } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import Togglable from '../components/Togglable'
import NewBlogForm from '../components/NewBlogForm'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs)
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  const notify = (message, type = 'info') => {
    dispatch(setNotification(message, type, 5))
  }

  const createBlog = async (blog) => {
    dispatch(create(blog)).catch((error) => {
      notify('creating a blog failed: ' + error.response.data.error, 'alert')
    })
    blogFormRef.current.toggleVisibility()
  }

  return (
    <div className='container'>
      <Togglable buttonLabel='create new' ref={blogFormRef}>
        <NewBlogForm onCreate={createBlog} />
      </Togglable>

      <Table striped>
        <thead>
          <tr>
            <td>
              <b>blogs created</b>
            </td>
          </tr>
        </thead>
        <tbody>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <tr key={blog.id}>
                <td>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title} {blog.author}
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  )
}

export default BlogList
