import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from '../reducers/notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    createBlog(state, action) {
      const newBlog = action.payload
      state.push(newBlog)
    },
    likeBlog(state, action) {
      const id = action.payload
      const blogToChange = state.find((n) => n.id === id)
      const changedBlog = {
        ...blogToChange,
        votes: blogToChange.likes + 1,
      }
      return state.map((blog) => (blog.id !== id ? blog : changedBlog))
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
  },
})

export const { vote, appendBlog, setBlogs } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const create = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
    dispatch(
      setNotification(
        `a new blog '${newBlog.title}' by ${newBlog.author} added`,
        'info',
        5
      )
    )
  }
}

export const voteBlog = (id) => {
  return async (dispatch) => {
    const changedBlog = await blogService.update(id)
    dispatch(vote(changedBlog))
  }
}

export default blogSlice.reducer
