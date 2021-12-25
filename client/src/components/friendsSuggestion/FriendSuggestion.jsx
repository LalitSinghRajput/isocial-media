import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'
import { axiosInstance } from '../../config';

import './friendSuggestion.css'

import { Add, Remove } from '@material-ui/icons';
import defaultAvtar from '../../assets/Person images/defaultAvtar.jpg';

const FriendSuggestion = () => {

    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null
    const [allusers, setAllusers] = useState([]);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const currUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null

    const [followed, setFollowed] = useState(currUser?.followings?.includes(user._id))

    const userFollowings = user?.followings;

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {

                const res = await axiosInstance.get('/users/getallusers', { headers: {}, Credentials: "include" });

                // console.log(res.data);
                setAllusers(res.data);

            } catch (error) {
                console.log(error);
            }
        };
        fetchAllUsers();

    }, []);

    const handleFollowClick = async () => {
        try {
            if (followed) {
                await axiosInstance.put("/users/" + user._id + "/unfollow", { userId: currentUser._id });

                dispatch({ type: "UNFOLLOW", payload: user._id })
            }
            else {
                await axiosInstance.put("/users/" + user._id + "/follow", { userId: currentUser._id })
                dispatch({ type: "FOLLOW", payload: user._id })

            }
            setFollowed(!followed)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="sidebarFriendList ">
                {
                    allusers.map(u => {
                        return (
                            (!userFollowings?.includes(u?._id)) && (user?._id !== u?._id) && (
                                <div className="rightbarFollowersection" key={u._id}>
                                    <Link to={"/profile/" + u.username} className="friendUsername" >
                                        <div className="sidebarFriend">
                                            <img className="sidebarFriendImg" src={u.profilePicture ? u.profilePicture : defaultAvtar} alt="" />
                                            <p className="sidebarFriendName">{u.username}</p>
                                        </div>
                                    </Link>
                                    <button className="rightbarFollowingBtn" onClick={handleFollowClick}>

                                        {followed ? "Unfollow" : "Follow"}
                                        {followed ? <Remove /> : <Add />}

                                    </button>
                                </div>
                            )
                        )
                    })
                }
            </div>
        </>
    )
}

export default FriendSuggestion
