import React, { useEffect, useState } from 'react'
import './conversation.css';
import { axiosInstance } from '../../config';
import defaultAvtar from '../../assets/Person images/defaultAvtar.jpg';

const Conversation = ({ conversation, currentUser }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const friendId = conversation.members.find((m) => m !== currentUser._id);

        const getUser = async () => {
            try {
                const res = await axiosInstance.get("/users?userId=" + friendId);

                // console.log(res);
                setUser(res.data)

            } catch (error) {
                console.log(error);
            }
        };
        getUser();

    }, [currentUser, conversation])

    return (
        <div className='conversation'>
            <img src={user?.profilePicture ? user.profilePicture : defaultAvtar} alt="" className='conversationImg' />
            <span className="conversationName">{user ? user.username : ""}</span>
        </div>
    )
}

export default Conversation
