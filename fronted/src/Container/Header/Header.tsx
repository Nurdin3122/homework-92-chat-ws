import React from 'react';
import Logo from '../../assets/logo.svg'
import {Link} from "react-router-dom";

const Header = () => {
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
                        <button type="button" className="btn btn-dark me-3">sign up</button>
                        <button type="button" className="btn btn-close-white">sign in</button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;