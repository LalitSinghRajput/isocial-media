import React, { useContext, useEffect, useState } from 'react'
import Followers from '../followers/Followers';

import './rightbar.css';
import { axiosInstance } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import { Add, Remove } from '@material-ui/icons';
import Following from '../following/Following';

const Rightbar = ({ user }) => {

    const { user: currentUser, dispatch } = useContext(AuthContext);

    const currUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null

    const [followers, setFollowers] = useState([])
    const [followed, setFollowed] = useState(currUser?.followings?.includes(user._id))
    const [followings, setFollowings] = useState([])
    const [toggleFollower, setToggleFollower] = useState(false);
    const [toggleFollowing, setToggleFollowing] = useState(false);


    useEffect(() => {
        const getFollowers = async () => {
            try {
                const followersList = await axiosInstance.get("/users/followers/" + user?._id, { headers: {}, Credentials: "include" });

                setFollowers(followersList.data);

            } catch (error) {
                console.log(error);
            }
        }
        getFollowers();

    }, [user, user._id])

    useEffect(() => {
        const getFollowings = async () => {
            try {
                const followingsList = await axiosInstance.get("/users/followings/" + user?._id);
                // console.log(currentUser.id);

                setFollowings(followingsList.data);

            } catch (error) {
                console.log(error);
            }
        }
        getFollowings();


    }, [user])


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



    const ProfileRightBar = () => {
        return (
            <>
                {
                    (user && currentUser) && (user.username !== currentUser.username) && (
                        <button className="rightbarFollowingBtn" onClick={handleFollowClick}>

                            {followed ? "Unfollow" : "Follow"}
                            {followed ? <Remove /> : <Add />}


                        </button>
                    )

                }
                <p className="rightBarTitle">About {user.username}</p>
                <div className="rightbarInfo">
                    <div className="rightBarInfoItem">
                        <ul>
                            <li>
                                <span className="rightBarInfoKey">City:</span>
                                <span className="rightBarInfoKey">{user.city}</span>
                            </li>

                            <li>
                                <span className="rightBarInfoKey">From:</span>
                                <span className="rightBarInfoKey">{user.from}</span>
                            </li>

                            <li>
                                <span className="rightBarInfoKey">Relationship</span>
                                <span className="rightBarInfoKey">{user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "."}</span>
                            </li>
                        </ul>


                    </div>
                </div>

                <div className="rightBarFollowerSection">

                    <div className="rightBarFollowerFollwings">
                        <button className="followersBtn" onClick={() => setToggleFollower(!toggleFollower)}>
                            <span className="rightBarfollowerTitle">{followers.length} Followers</span>
                        </button>

                        <button className="followersBtn" onClick={() => setToggleFollowing(!toggleFollowing)}>
                            <span className="rightBarfollowerTitle">{followings.length} Followings</span>
                        </button>
                    </div>

                    {/* followers list of a user */}
                    {toggleFollower && <Followers user={user} />}

                    {/* followings list of a user */}
                    {toggleFollowing && <Following user={user} />}


                </div>
            </>
        )

    }

    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                <ProfileRightBar />
            </div>
        </div>
    )
}

export default Rightbar
