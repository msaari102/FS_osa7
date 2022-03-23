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
      const changedBlog = action.payload
      return state.map((blog) =>
        blog.id !== changedBlog.id ? blog : changedBlog
      )
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    removeBlog(state, action) {
      return state.filter((b) => b.id !== action.payload)
    },
  },
})

export const { vote, appendBlog, setBlogs, likeBlog, removeBlog } =
  blogSlice.actions

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

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

export const voteBlog = (blog) => {
  return async (dispatch) => {
    const changedBlog = await blogService.update(blog.id, blog)
    dispatch(likeBlog(changedBlog))
    dispatch(
      setNotification(
        `you liked '${changedBlog.title}' by ${changedBlog.author}`,
        'info',
        5
      )
    )
  }
}

export default blogSlice.reducer
