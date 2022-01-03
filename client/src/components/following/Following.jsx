import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'; import defaultAvtar from '../../assets/Person images/defaultAvtar.jpg';
import { axiosInstance } from '../../config';
import Spinner from '../spinner/Spinner'


const Following = ({ user }) => {

    const [followings, setFollowings] = useState([])

    useEffect(() => {
        const getFollowings = async () => {
            try {
                const followingsList = await axiosInstance.get("/users/followings/" + user?._id);

                setFollowings(followingsList.data);
                // console.log(followingsList.data.length);

            } catch (error) {
                console.log(error);
            }
        }
        getFollowings();

    }, [user])

    return (
        <>
            <h3>Followings List</h3>
            <div className="rightBarFollowers">
                {
                    followings.length === 0 && (
                        <div className="followersSpinnerContainer">
                            <Spinner />
                        </div>
                    )
                }
                {
                    followings.map(friend => {
                        return (
                            <Link className="friendUsername followLink" to={"/profile/" + friend.username}>
                                <div className="rightBarFollowing">
                                    <img src={friend.profilePicture ? friend.profilePicture : defaultAvtar} alt="." className="rightBarFollowingImg" />
                                    <span className="rightBarFollowingName">{friend.username}</span>
                                </div>
                            </Link>
                        )

                    })
                }
            </div>
        </>
    )
}

export default Following
