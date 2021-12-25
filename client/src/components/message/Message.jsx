import React, { useState, useEffect } from 'react'
import './message.css'

import { format } from 'timeago.js'
import { axiosInstance } from '../../config';
import defaultAvtar from '../../assets/Person images/defaultAvtar.jpg';

const Message = ({ message, own, currentUser }) => {

    const [user, setUser] = useState({});
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    // console.log(message.sender);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axiosInstance.get("/users?userId=" + message?.sender);

                // console.log(res.data);
                setUser(res.data)

            } catch (error) {
                console.log(error);
            }
        };
        getUser();

    }, [currentUser, message.sender])

    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <div className="userInfo">
                    <img src={user.profilePicture ? PF + user.profilePicture : defaultAvtar} alt="" className="messageImg" />
                    <div className="usernameTxt">{user.username}</div>

                </div>
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">
                {format(message.createdAt)}
            </div>

        </div>
    )
}



export default Message
