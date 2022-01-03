import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import defaultAvtar from '../../assets/Person images/defaultAvtar.jpg';
import { axiosInstance } from '../../config';
import Spinner from '../spinner/Spinner'

const Followers = ({ user }) => {

    const [followers, setFollowers] = useState([])
    const [emptyFollowers, setEmptyFollowers] = useState(false)

    useEffect(() => {
        const getFollowers = async () => {
            try {
                const followersList = await axiosInstance.get("/users/followers/" + user._id, { headers: {}, Credentials: "include" });

                // console.log(followersList.data);
                if (followersList.data.length === 0) {
                    setEmptyFollowers(true)
                }
                setFollowers(followersList.data);

            } catch (error) {
                console.log(error);
            }
        }
        getFollowers();

    }, [user, user._id])

    return (
        <>
            <h3>Followers List</h3>
            <div className="rightBarFollowers">
                {
                    !emptyFollowers &&
                    followers.length === 0 && (
                        <div className="followersSpinnerContainer">
                            <Spinner />
                        </div>
                    )
                }

                {
                    followers.map(friend => {
                        return (
                            <Link to={"/profile/" + friend.username} className="friendUsername followLink" >
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

export default Followers
