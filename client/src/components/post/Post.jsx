import React, { useState, useEffect, useContext } from 'react'
import { axiosInstance } from '../../config';
import { format } from 'timeago.js';
import { AuthContext } from '../../context/AuthContext'

import './post.css'

import defaultAvtar from '../../assets/Person images/defaultAvtar.jpg';
import unlikedImg from '../../assets/icons/unlike.png';
import likeImg from '../../assets/icons/like.png';
import { Close, Delete, MoreVert } from "@material-ui/icons"

const Post = ({ post }) => {

    const [like, setLike] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(false)
    const [user, setUser] = useState({})
    const [toggleMenu, setToggleMenu] = useState(false);

    const { user: currentUser } = useContext(AuthContext)

    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser._id))
    }, [currentUser._id, post.likes])


    useEffect(() => {

        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get(`/users/?userId=${post.userId}`, { headers: {}, Credentials: "include" });

                // console.log(res);
                setUser(res.data);

            } catch (error) {
                console.log(error);
            }

        };
        fetchUser();

    }, [post.userId]);

    const likeHandler = () => {
        try {
            axiosInstance.put("/posts/" + post._id + "/like_dislike", { userId: currentUser._id })
        } catch (error) {
            console.log(error)
        }

        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
    }

    const deletePostHandle = () => {
        try {
            const confirmDelete = window.confirm('Are you sure you want to delete this post?');
            if (confirmDelete) {
                axiosInstance.delete("/posts/" + post._id, { data: { userId: currentUser._id } })
                // console.log(currentUser._id);
                window.location.reload();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="postContainer">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">

                        <a href={`#/profile/${user.username}`}>
                            <img className="postProfileimg" src={user.profilePicture ? user.profilePicture : defaultAvtar} alt="." />
                            <span className="postUsername">{user.username}</span>
                        </a>

                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    {(user?._id === currentUser?._id) &&
                        <div className="postTopRight">
                            {
                                (toggleMenu)
                                    ? <Close color="#fff" className="moreOptions" size={27} onClick={() => setToggleMenu(false)} />
                                    : <MoreVert color="#fff" className="moreOptions" size={27} onClick={() => setToggleMenu(true)} />
                            }

                            {(toggleMenu) && (
                                <div className="moreOptionsMenu scale-up-center">

                                    {/* <div className="moreOptionsDiv">
                                    <DeleteOutlineRounded onClick={deletePostHandle} /> Update Post
                                </div> */}
                                    <div className="moreOptionsDiv" onClick={deletePostHandle}>
                                        <Delete /> <span className="moreOptionsDeleteTitle">Delete Post</span>
                                    </div>

                                </div>

                            )}
                        </div>
                    }
                </div>
                <div className="postCenter">
                    <span className="postText">
                        {post?.desc}
                        <img className="postImg" src={post.img} onDoubleClick={likeHandler} alt="." />
                    </span>
                </div>
                <div className="postBottom">
                    <div className="postBtnLeft">
                        <img className="likeIcon" src={!isLiked ? unlikedImg : likeImg} alt="." onClick={likeHandler} />

                        <span className="postLikeCounter">{like} likes</span>
                    </div>
                    <div className="postBtnRight">
                        <span className="postCommentText">{post.comment} comments</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post
