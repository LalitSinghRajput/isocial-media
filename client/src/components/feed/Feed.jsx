import React, { useState, useEffect, useContext } from 'react'
import { axiosInstance } from '../../config'
import { AuthContext } from '../../context/AuthContext';

import Post from '../post/Post';
import Share from '../share/Share';
import Spinner from '../spinner/Spinner'

import './feed.css';

const Feed = ({ username, isProfilePage }) => {

    // console.log(username)

    const [posts, setPosts] = useState([]);
    const [emptyPosts, setEmptyPosts] = useState(false)
    const { user } = useContext(AuthContext);
    const currUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null

    useEffect(() => {
        const fetchPosts = async () => {

            // const res = username
            //     ? await axiosInstance.get('/posts/profile/' + username)
            //     : await axiosInstance.get('/posts/timeline/' + user?._id);
            const userPost = await axiosInstance.get('/posts/profile/' + username);
            const timeLinePost = await axiosInstance.get('/posts/timeline/' + user?._id);
            let res = userPost;
            if (!isProfilePage)
                res = { ...timeLinePost };

            // console.log(userPost);
            // console.log(timeLinePost.data);
            console.log(res);

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
