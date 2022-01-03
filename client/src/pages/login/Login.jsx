import React, { useContext, useRef } from 'react'
import './login.css'
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import userImg from '../../assets/icons/user.png'
import { CircularProgress } from '@material-ui/core';

const Login = () => {

    const navigate = useNavigate();

    const email = useRef();
    const password = useRef();
    const { isFetching, dispatch } = useContext(AuthContext);

    const handleClick = async (e) => {
        e.preventDefault();
        loginCall(
            {
                email: email.current.value,
                password: password.current.value
            },
            dispatch,
        );
    };

    const handleCreateAccount = () => {
        navigate('/register')
    }

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">iSocial Media</h3>
                    <span className="loginDesc">Connect with friends and the world around you on iSocial Media</span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick} method="POST">
                        <img src={userImg} alt="." className="loginUserImg" />

                        <input type="email" placeholder="Email" className="loginInput"
                            required
                            ref={email} />
                        <input type="password" placeholder="Password" className="loginInput"
                            required
                            minLength="6"
                            ref={password} />
                        <button type="submit" className="loginBtn"
                            disabled={isFetching}>{isFetching ? <CircularProgress color="white" size="20px" /> : "Log In"}</button>
                        <button className="loginRegisterBtn" onClick={handleCreateAccount}>{isFetching ? <CircularProgress color="white" size="20px" /> : <span className='
                        loginNewAccTxt'>Create a New Account</span>}</button>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Login
