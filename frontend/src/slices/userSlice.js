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
        updateUserData:(state,action)=>{
            state.userData={...state.userData,...action.payload}
            const localuser=JSON.parse(localStorage.getItem("user"))
            if(localuser){
                const updateduser={
                    ...localuser,
                    ...action.payload
                }
                localStorage.setItem("user",JSON.stringify(updateduser))
            }
        }
    }
})

export const { signup, login, logout,updateUserData } = userSlice.actions
export default userSlice.reducer