import React, { useContext, useRef } from 'react'
import './login.css'
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import userImg from '../../assets/icons/user.png'
import { CircularProgress } from '@material-ui/core';
import iSocialMediaLogo from '../../assets/logo/iSocialMediaLogo.png'

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

    const guestEmail = process.env.REACT_APP_GUEST_EMAIL
    const guestPwd = process.env.REACT_APP_GUEST_PWD
    const handleGuest = async (e) => {
        e.preventDefault();
        loginCall(
            {
                email: guestEmail,
                password: guestPwd
            },
            dispatch,
        );
    }

    const handleCreateAccount = () => {
        navigate('/register')
    }

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <img src={iSocialMediaLogo} alt="." className="loginUserImg" />
                    <h3 className="loginLogo">iSocial Media</h3>
                    <span className="loginDesc"></span>
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
                            disabled={isFetching}>{isFetching ? <CircularProgress color="white" size="20px" /> : "Log In"}
                        </button>

                        <button className="createAccountButton" onClick={handleCreateAccount}>{isFetching ? <CircularProgress color="white" size="20px" /> : <span className='
                        loginNewAccTxt'>Create a New Account</span>}
                        </button>

                        <button className="guestBtn" onClick={handleGuest} >{isFetching ? <CircularProgress color="white" size="20px" /> : <span className='
                        loginNewAccTxt guestTxt'>Enter as a guest (No account required)</span>}</button>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Login
