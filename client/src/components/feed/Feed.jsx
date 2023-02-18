import React, { useState, useEffect, useContext } from 'react'
import { axiosInstance } from '../../config'
import { AuthContext } from '../../context/AuthContext';

import Post from '../post/Post';
import Share from '../share/Share';
import Spinner from '../spinner/Spinner'
import { FaArrowCircleUp } from "react-icons/fa";

import './feed.css';

const Feed = ({ username, isProfilePage }) => {

    // console.log(username)

    const [posts, setPosts] = useState([]);
    const [emptyPosts, setEmptyPosts] = useState(false)
    const { user } = useContext(AuthContext);
    const currUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {

            // const res = username
            //     ? await axiosInstance.get('/posts/profile/' + username)
            //     : await axiosInstance.get('/posts/timeline/' + user?._id);
            const userPost = await axiosInstance.get('/posts/profile/' + username);
            const timeLinePost = await axiosInstance.get('/users/getallposts');
            let res = userPost;
            if (!isProfilePage)
                res = { ...timeLinePost };

            // console.log(userPost);
            // console.log(timeLinePost.data);
            // console.log(res);

            if (res.data.length === 0) {
                setEmptyPosts(true)
            }

            // sort post according to latest
            setPosts(
                res.data.sort((p1, p2) => {
                    return new Date(p2?.createdAt) - new Date(p1?.createdAt);
                })
            );

        };
        fetchPosts();

    }, [username, user._id, isProfilePage]);

    const scrollToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    useEffect(() => {
        window.addEventListener("scroll", listenToScroll);
        return () =>
            window.removeEventListener("scroll", listenToScroll);
    }, [])

    const listenToScroll = () => {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };


    return (
        <div className="feed">
            <div className="feedWrapper">

                {(currUser?.username === username) && <Share />}

                {
                    !emptyPosts && posts.length === 0 &&
                    (<div className="spinnerContainer">
                        <Spinner />
                    </div>)
                }
                {
                    isVisible
                    &&
                    <FaArrowCircleUp className="scrollTop" id="scrollTop" onClick={scrollToTop} />
                }
                {/* timeline posts */}
                {
                    posts.map((p) => (
                        <Post
                            key={p._id}
                            post={p}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Feed
