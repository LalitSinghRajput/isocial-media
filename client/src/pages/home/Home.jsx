import React, { useContext } from 'react'

import Sidebar from '../../components/sidebar/Sidebar'
import Topbar from '../../components/topbar/Topbar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { AuthContext } from '../../context/AuthContext'

import './home.css'

const Home = ({ username }) => {
    const { user } = useContext(AuthContext);
    return (
        <>
            <Topbar />
            <div className="homeContainer">
                <Sidebar user={user} />
                <Feed username={username} />
                <Rightbar user={user} isProfilePage={true} />
            </div>

        </>
    )
}

export default Home
