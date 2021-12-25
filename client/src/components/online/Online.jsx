import React from 'react'

import './online.css'
import defaultAvtar from '../../assets/Person images/defaultAvtar.jpg'

const Online = ({ user }) => {
    return (
        <div>
            <li className="rightbarFriend">
                <div className="rightbarProfileImgContainer">
                    <img src={user?.profilePicture ? user.profilePicture : defaultAvtar} alt="" className='conversationImg' />

                    <span className="rightbarOnline"></span>
                </div>
                <span className="conversationName">{user ? user.username : ""}</span>
            </li>
        </div>
    )
}

export default Online
