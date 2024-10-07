import React from 'react';
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {userState} from "../../Components/Users/UsersSlice.ts";
import {logout} from "../../Components/Users/UsersThunk.ts";
import {Link} from "react-router-dom";
import Logo from "../../assets/logo.svg";

const HeaderForUsers = () => {
    let logo = Logo
    const dispatch = useAppDispatch();
    const user = useAppSelector(userState)
    const handleLogout = () => {
        dispatch(logout());
    };
    return (
        <div>
            <nav className="navbar bg-body-tertiary">
                <div className="container">
                    <div>
                        <Link to="/" className="navbar-brand" href="#">
                            <img src={`${logo}`} alt="Bootstrap" width="30" height="24"/>
                            <span className="ps-2">Chat</span>
                        </Link>
                    </div>

                    <div className="d-flex align-items-center">
                        <p style={{margin: 0, padding: 0, display: "inline-block", verticalAlign: "middle"}}>
                            Hello: {user.username}
                        </p>
                        <button className="btn btn-close-white" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default HeaderForUsers;