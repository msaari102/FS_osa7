import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/user'
import { setNotification } from '../reducers/notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    initUser() {
      const userFromStorage = userService.getUser()
      if (userFromStorage) {
        return userFromStorage
      }
    },
    setUsers(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    },
  },
})

export const { initUser, setUsers, clearUser } = userSlice.actions

export const logoutUser = () => {
  return async (dispatch) => {
    userService.clearUser()
    dispatch(clearUser())
    dispatch(setNotification('good bye!', 'alert', 5))
  }
}

export const setUser = (user) => {
  return async (dispatch) => {
    userService.setUser(user)
    dispatch(setUsers(user))
    dispatch(setNotification(`${user.name} logged in!`, 'info', 5))
  }
}

export default userSlice.reducer
