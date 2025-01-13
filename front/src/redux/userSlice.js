import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _id: "",
  firstName: "",
  email: "",
  profile_pic: "",
  token: "",
  onlineUser: [],
  socketConnection: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id
      state.firstName = action.payload.firstName
      state.email = action.payload.email
      state.profile_pic = action.payload.profile_pic
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    logout: (state, action) => {
      state._id = ""
      state.firstName = ""
      state.email = ""
      state.profile_pic = ""
      state.token = ""
      state.socketConnection = null
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload
    },
  },
})

export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } = userSlice.actions
export default userSlice.reducer