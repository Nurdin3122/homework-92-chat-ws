import React from 'react';
import {userState} from "../../Components/Users/UsersSlice.ts";
import {useAppSelector} from "../../app/hooks.ts";
import HeaderForAnon from "./HeaderForAnon.tsx";
import HeaderForUsers from "./HeaderForUsers.tsx";

const Header = () => {
    const user = useAppSelector(userState)
    return (
        <div>
            {
                user ? (
                    <HeaderForUsers/>
                ) : (
                    <HeaderForAnon/>
                )
            }
        </div>
    );
};

export default Header;