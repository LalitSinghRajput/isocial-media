import { axiosInstance } from '../../config';
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import userImg from '../../assets/icons/user.png'
import iSocialMediaLogo from '../../assets/logo/iSocialMediaLogo.png'

import './register.css'

const Register = () => {

    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();

    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();

        if (passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Password not match");
        }
        else {
            const userDetails = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            }

            try {
                const res = await axiosInstance.post("/auth/register", userDetails);

                if (res.status === 404 || !res) {
                    window.alert('Invalid Credentials')
                }
                else {
                    window.alert('Sign Up Successful')
                    navigate('/login')
                }

            } catch (error) {
                console.log(error)
                window.alert('Failed to Register')
            }
        }
    }

    const handleLogintoAccount = () => {
        navigate('/login');
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
                    <form className="loginBox" onSubmit={handleClick}>
                        <img src={userImg} alt="." className="loginUserImg" />
                        <input
                            placeholder="Username (atleast 4 character long )"
                            className="loginInput"
                            required
                            ref={username}
                        />
                        <input
                            placeholder="Email"
                            className="loginInput"
                            required
                            ref={email}
                            type="email"
                        />
                        <input
                            placeholder="Password (atleast 6 character long)"
                            className="loginInput"
                            required
                            ref={password}
                            type="password"
                            minLength="6"

                        />
                        <input
                            placeholder="Password Again"
                            className="loginInput"
                            required
                            ref={passwordAgain}
                            type="password"
                            minLength="6"

                        />
                        <button className="loginBtn" type="submit">Sign Up</button>
                        <button className="createAccountButton" onClick={handleLogintoAccount} >Login into Account</button>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default Register
