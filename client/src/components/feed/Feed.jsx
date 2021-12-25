import React, { useState, useEffect, useContext } from 'react'
import { axiosInstance } from '../../config'
import { AuthContext } from '../../context/AuthContext';

import Post from '../post/Post';
import Share from '../share/Share';

import './feed.css';

const Feed = ({ username }) => {

    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);
    // console.log(user)

    useEffect(() => {
        const fetchPosts = async () => {
            const res = username
                ? await axiosInstance.get('/posts/profile/' + username)
                : await axiosInstance.get('/posts/timeline/' + user?._id);

            // sort post according to latest
            setPosts(
                res.data.sort((p1, p2) => {
                    return (p1 !== null) && (p2 !== null) && new Date(p2.createdAt) - new Date(p1.createdAt);
                })
            );

        };
        fetchPosts();

    }, [username, user._id]);

    return (
        <div className="feed">
            <div className="feedWrapper">

                {(username === user?.username) && <Share />}

                {/* timeline posts */}
                {
                    posts.map((p) => (
                        (p !== null) &&
                        <Post
                            key={p._id}
                            post={p}
                            img={posts.img}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Feed
