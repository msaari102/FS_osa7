import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNoti(state, action) {
      return action.payload
    },
    removeNotification() {
      return null
    },
  },
})

export const { setNoti, removeNotification } = notificationSlice.actions

export const setNotification = (content, type, time) => {
  return async (dispatch) => {
    dispatch(setNoti({ message: content, type: type }))
    var timeoutID = setTimeout(() => {
      dispatch(removeNotification())
    }, time * 1000)
    clearTimeout(timeoutID - 1)
  }
}

export default notificationSlice.reducer
