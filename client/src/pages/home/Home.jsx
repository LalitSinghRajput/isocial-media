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
            <div className="homeDiv">
                <div className="homeSidebar">
                    <Sidebar user={user} />
                </div>
                <div className="homeContainer">
                    <Feed username={user.username} />
                    <Rightbar user={user} isProfilePage={true} />
                </div>
            </div>

        </>
    )
}

export default Home
