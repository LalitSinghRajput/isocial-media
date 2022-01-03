import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext'
import { axiosInstance } from '../../config';

import './friendSuggestion.css'
import defaultAvtar from '../../assets/Person images/defaultAvtar.jpg';

const FriendSuggestion = ({ user }) => {

    const currUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null
    const [allusers, setAllusers] = useState([]);
    // const { user:currentUser, dispatch } = useContext(AuthContext);
    // const [followed, setFollowed] = useState(currUser?.followings?.includes(user._id))

    const userFollowings = currUser?.followings;

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

    // const handleFollowClick = async (friend) => {
    //     console.log(friend);
    //     console.log("Sending follow request to " + friend?.username);
    //     setFollowed(userFollowings.includes(friend._id))
    //     try {
    //         if (followed) {
    //             await axiosInstance.put("/users/" + friend._id + "/unfollow", { userId: user._id });

    //             dispatch({ type: "UNFOLLOW", payload: user._id })
    //         }
    //         else {
    //             await axiosInstance.put("/users/" + friend._id + "/follow", { userId: user._id })
    //             dispatch({ type: "FOLLOW", payload: user._id })

    //         }
    //         setFollowed(userFollowings.includes(friend._id))
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

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
                                    {/* <div className="rightBarFollowBtnContainer"> */}

                                    {/* <button className="rightBarFollowBtn" onClick={() => handleFollowClick(u)}> */}

                                    {/* {setFollowed(userFollowings?.includes(u?._id))} */}
                                    {/* {followed ? "Unfollow" : "Follow"} */}
                                    {/* {userFollowings?.includes(u?._id) ? <span>Unfollow</span> : <span>Follow</span>} */}
                                    {/* {userFollowings?.includes(u?._id) ? <Remove /> : <Add />} */}

                                    {/* </button> */}
                                    {/* </div> */}
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
