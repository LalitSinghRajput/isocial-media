import React, { useContext, useState } from 'react'
import './topbar.css'

import { RiCloseLine, RiMenu3Line } from 'react-icons/ri';

import { Link } from 'react-router-dom'
import loginUser from '../../assets/icons/loginUser.png'
import homepage from '../../assets/icons/homepage.png'

import defaultProfile from '../../assets/Person images/defaultAvtar.jpg'
// import chatIcon from '../../assets/icons/chatIcon.png'
import updateAccount from '../../assets/icons/updateAccount.png'
import logoutIcon from '../../assets/icons/logoutIcon.png'
import deleteIcon from '../../assets/icons/deleteIcon.png'

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { axiosInstance } from '../../config';


const Topbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            const res = await axiosInstance.get("/auth/logout");
            localStorage.clear('user');

            if (res.status !== 200) {
                const error = new Error(res.error);
                throw error;
            }

            navigate('/login', { replace: true });

            window.location.reload();

        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteAccount = async () => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete your account permanently?");

            // remove user id from the friends user is following the
            console.log("Users followings")
            console.log(user.followings);
            // const followingsList = user.followings;
            if (confirmDelete) {
                const res = await axiosInstance.delete("/users/" + user._id, { data: { userId: user._id } }, { headers: {}, Credentials: "include" });

                localStorage.removeItem("user");

                navigate('/register', { replace: true });
                window.location.reload();
                alert('Successfully deleted');

                if (res.status !== 200) {
                    const error = new Error(res.error);
                    throw error;
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="topbar_container">
            <div className="topbarLeft">

                <Link to='/'> <span className="logo">iSocial Media </span></Link>
            </div>
            <div className="topbarCenter">
                <div className="items">
                    <img src={homepage} className="menuIcon" alt="" />
                    <Link to={`/`} className="itemLink">
                        <p className="menuText">Home</p>
                    </Link>
                </div>

                <div className="items" >
                    <img src={loginUser} className="menuIcon" alt="" />
                    <Link to={`/profile/${user.username}`} className="itemLink">
                        <p className="menuText">Profile</p>
                    </Link>
                </div>
                {/* <div className="items" >
                    <img src={chatIcon} className="menuIcon" alt="" />
                    <Link to={`/profile/${user.username}/messenger`} className="itemLink">
                        <p className="menuText">Chat</p>
                    </Link>
                </div> */}

                <div className="items">
                    <img src={updateAccount} className="menuIcon" alt="" />
                    <Link to={`/profile/${user.username}/updateProfile`} className="itemLink">
                        <p className="menuText">Update Account</p>
                    </Link>
                </div>
                <div className="items">
                    <img src={logoutIcon} className="menuIcon" alt="" />
                    <button className="topBarbtn" onClick={handleLogout}>
                        <p className="menuText">Logout</p>
                    </button>
                </div>
                <div className="items">
                    <img src={deleteIcon} className="menuIcon" alt="" />
                    <button className="topBarbtn" onClick={handleDeleteAccount}>
                        <p className="menuText">Delete Account</p>
                    </button>
                </div>

            </div>
            <div className="topbarRight">
                {
                    user && (
                        <Link to={`/profile/${user.username}`}>
                            <img src={user.profilePicture ? user.profilePicture : defaultProfile} alt="." className="topbarImg" />
                        </Link>)
                }

            </div>

            {toggleMenu
                ? <div className="topbarRightIcon"> <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} /></div>
                : <div className="topbarRightIcon"> <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} /></div>
            }

            {/* for moblie view */}
            {/* this means if toggle mode is true than display this */}

            {
                toggleMenu && (
                    <div className="menuBarContainer scale-up-center">
                        <div className="menu">
                            <div className="menuItems">
                                <div className="items">
                                    <img src={homepage} className="menuIcon" alt="" />
                                    <Link to={`/`} className="itemLink">
                                        <p className="menuText">Home</p>
                                    </Link>
                                </div>
                                <div className="items" >
                                    <img src={loginUser} className="menuIcon" alt="" />
                                    <Link to={`profile/${user.username}`} className="itemLink">
                                        <p className="menuText">Profile</p>
                                    </Link>
                                </div>
                                {/* 
                                <div className="items" >
                                    <img src={chatIcon} className="menuIcon" alt="" />
                                    <Link to={`/profile/${user.username}/messenger`} className="itemLink">
                                        <p className="menuText">Chat</p>
                                    </Link>
                                </div> */}
                                <div className="items">
                                    <img src={updateAccount} className="menuIcon" alt="" />
                                    <Link to={`/profile/${user.username}/updateProfile`} className="itemLink">
                                        <p className="menuText">Update Account</p>
                                    </Link>
                                </div>
                                <div className="items">
                                    <img src={logoutIcon} className="menuIcon" alt="" />
                                    <button className="topBarbtn" onClick={handleLogout}>
                                        <p className="menuText">Logout</p>
                                    </button>
                                </div>
                                <div className="items">
                                    <img src={deleteIcon} className="menuIcon" alt="" />
                                    <button className="topBarbtn" onClick={handleDeleteAccount}>
                                        <p className="menuText">Delete Account</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default Topbar
