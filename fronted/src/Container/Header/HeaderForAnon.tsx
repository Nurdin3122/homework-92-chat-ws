import React from 'react';
import Logo from "../../assets/logo.svg";
import {Link} from "react-router-dom";

const HeaderForAnon = () => {
    let logo = Logo
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

                    <div>
                        <Link to="/create-user" type="button" className="btn btn-dark me-3">sign up</Link>
                        <Link to="/login-user" type="button" className="btn btn-close-white">sign in</Link>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default HeaderForAnon;