import React, { useState } from 'react'
import './sidebar.css'

import Online from '../../components/online/Online';
import FriendSuggestion from '../../components/friendsSuggestion/FriendSuggestion'

import collapse from '../../assets/icons/collapse.png';
import expand from '../../assets/icons/expand.png';

const Sidebar = ({ user }) => {

    const [toggleMenu, setToggleMenu] = useState(false);

    return (
        <>
            <div className={toggleMenu ? "sidebarCollapse " : "sidebar  "} >
                <div className={toggleMenu ? "collapseContainer " : "expand_collapse_container"}>
                    {toggleMenu
                        ? <img src={expand} className="expand_coallapseImg " alt="" onClick={() => setToggleMenu(false)} />
                        : <img src={collapse} className="expand_coallapseImg  " alt="" onClick={() => setToggleMenu(true)} />
                    }

                </div>
                <div className={toggleMenu ? "sidebarWrapperHide " : "sidebarWrapper"} >

                    <div className="sidebarTitlecontainer">
                        <span className="sidebarTitle">Online Friends</span>
                    </div>
                    <Online />

                    <hr className="sidebarHr" />

                    <div className="sidebarTitlecontainer">
                        <span className="sidebarTitle">Suggestions for you</span>
                    </div>
                    <FriendSuggestion user={user} />

                </div>
            </div >
        </>
    )
}

export default Sidebar
