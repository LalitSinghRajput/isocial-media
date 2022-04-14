import React, { useState, useEffect } from 'react'
import './chatOnline.css'
import { axiosInstance } from '../../config';
import defaultAvtar from '../../assets/Person images/defaultAvtar.jpg';

const ChatOnline = ({ onlineUsers, currentId, setCurrentChat }) => {

    const [friends, setFriends] = useState([])
    const [onlineFriends, setOnlineFriends] = useState([])

    useEffect(() => {
        const getFriends = async () => {
            const res = await axiosInstance.get("/users/followers/" + currentId);
            setFriends(res.data);
        }
        getFriends();
    }, [currentId])

    useEffect(() => {
        setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
    }, [friends, onlineUsers])

    const handleClick = async (user) => {
        try {
            const res = await axiosInstance.get(`/conversations/find/${currentId}/${user._id}`);
            setCurrentChat(res.data)

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="chatOnline">
            <h1>Online Friends</h1>
            {
                onlineFriends.map(o => (

                    <div className="chatOnlineFriend" onClick={() => handleClick}>
                        <div className="chatOnlineImgContainer">
                            <img src={o.profilePicture ? o.profilePicture : defaultAvtar} alt="" className="chatOnlineImg" />
                            <div className="chatOnlineBadge"></div>
                        </div>
                        <span className="chatOnlineName">
                            {o?.username}
                        </span>
                    </div>
                ))
            }
        </div>
    )
}

export default ChatOnline
