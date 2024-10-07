import {createAsyncThunk} from "@reduxjs/toolkit";
import {User, UserMutation} from "../../Types.ts";
import axiosApi from "../../AxiosApi/AxiosApi.ts";
import {unsetUser} from "./UsersSlice.ts";

export const createUser = createAsyncThunk<User, UserMutation>(
    'user/createUser',
    async (userMutation) => {
        const response = await axiosApi.post<UserMutation>('/users', userMutation);
        return response.data
    }
);

export const saveUser = createAsyncThunk<User, UserMutation>(
    'user/SaveUser',
    async (userMutation) => {
        const response = await axiosApi.post<UserMutation>('/users/sessions', userMutation);
        return response.data
    }
);

export const logout = createAsyncThunk<void,void>(
    'users/logout',
    async (_, { dispatch}) => {

        const user = localStorage.getItem('persist:chat-ws:user');
        const UserJsonParse = JSON.parse(user);
        const token = JSON.parse(UserJsonParse.user)
        await axiosApi.delete('/users/sessions', {
            headers: {
                Authorization: `Bearer ${token.token}`
            }
        });
        dispatch(unsetUser());
    }
);