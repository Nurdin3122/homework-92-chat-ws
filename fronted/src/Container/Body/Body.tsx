import React from 'react';
import {useAppSelector} from "../../app/hooks.ts";
import {userState} from "../../Components/Users/UsersSlice.ts";
import Chat from "../../Components/Chat/Chat.tsx";

const Body = () => {
    const user = useAppSelector(userState)
    return (
        <div>
            {
                user ? (
                    <Chat/>
                ) : (
                    <p>Sorry</p>
                )
            }
        </div>
    );
};

export default Body;