import { createSlice } from "@reduxjs/toolkit"

const localstoragedata=JSON.parse(localStorage.getItem("user"))
const initialState = {
    isLoggedin: localstoragedata?true:false,
    userData: localstoragedata || null
}
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signup: (state, action) => {
            state.userData = action.payload
            state.isLoggedin = true
            localStorage.setItem("user",JSON.stringify(action.payload))
        },
        login: (state, action) => {
            state.userData = action.payload.user
            state.isLoggedin = true
            localStorage.setItem("user",JSON.stringify(action.payload.user))
        },
        logout: (state) => {
            state.userData = null,
            state.isLoggedin = false
            localStorage.removeItem("user")
        },
    }
})

export const { signup, login, logout } = userSlice.actions
export default userSlice.reducer