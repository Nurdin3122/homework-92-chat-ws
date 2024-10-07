import {RootState} from "../../app/store.ts";
import {createSlice} from "@reduxjs/toolkit";
import {User} from "../../Types.ts";
import {createUser, saveUser} from "./UsersThunk.ts";

export interface userState {
    user:User | null
    loading:boolean;
    error:boolean;
}


export const initialState:userState = {
    user:null,
    loading:false,
    error:false,
}

export const UserSlice = createSlice<userState>({
    name:"user",
    initialState,
    reducers: {
        unsetUser: (state) => {
            state.user = null;
        }
    },
    extraReducers:(builder) => {
        builder.addCase(createUser.pending,(state) => {
            state.loading = true;
            state.error = false;
        });
        builder.addCase(createUser.fulfilled,(state) => {
            state.loading = false;
        });
        builder.addCase(createUser.rejected,(state) => {
            state.loading = false;
            state.error = true;
        });

        builder.addCase(saveUser.pending,(state) => {
            state.loading = true;
            state.error = false;
        });
        builder.addCase(saveUser.fulfilled,(state,{payload: user}) => {
            state.loading = false;
            state.user = user;
        });
        builder.addCase(saveUser.rejected,(state) => {
            state.loading = false;
            state.error = true;
        });

    }
});

export const {unsetUser} = UserSlice.actions;

export const UserReducer = UserSlice.reducer;
export const loadingUserState = (state: RootState) => state.user.loading;
export const userState = (state: RootState) => state.user.user;
