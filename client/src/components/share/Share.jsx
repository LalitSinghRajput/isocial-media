import React, { useContext, useRef, useState } from 'react'

import './share.css'

import defaultAvtar from '../../assets/Person images/defaultAvtar.jpg';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import done from '../../assets/icons/done.png'
import { PermMedia, EmojiEmotions, Label, CancelOutlined } from "@material-ui/icons"

import { AuthContext } from '../../context/AuthContext'
import { axiosInstance } from '../../config';
import { Link } from 'react-router-dom'

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase.js'

const Share = () => {

    const { user } = useContext(AuthContext)

    const desc = useRef();
    const [postFile, setPostFile] = useState(null)
    const [progress, setProgrss] = useState(0);

    // function to upload the file to firebase 
    const uploadFiles = async (file) => {
        if (!file) return

        const storageRef = ref(storage, `/files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        const newPost = {
            userId: user._id,
            desc: desc.current.value
        }

        uploadTask.on("state_changed", (snapshot) => {
            const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);

            setProgrss(progress)
        },
            (error) => {
                console.log(error);
                alert('Failed to upload Please try again later')
            },
            // when file successfully uploaded we get the url 
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(url => {
                        // console.log(url);
                        // set the url to the new post
                        newPost.img = url;

                        // upload the post to server
                        const uploadToServer = async () => {
                            try {
                                await axiosInstance.post("/posts", newPost)
                                window.location.reload();
                            } catch (error) {
                                console.log(error);
                            }
                        }
                        uploadToServer();
                    })
            }
        );
    }

    const submitHandle = async (e) => {
        e.preventDefault();

        const file = e.target[0].files[0];
        uploadFiles(file)
    }

    return (
        <div className="shareContainer">
            <div className="shareWrapper">
                <div className="shareTop">

                    <Link to={`/profile/${user.username}`}>
                        <img className="shareProfieImg" src={user.profilePicture ? user.profilePicture : defaultAvtar} alt="." />
                    </Link>

                    <input type="text" className="shareInput"
                        ref={desc} placeholder={`What's in your  mind ${user.username} ?`} />
                </div>
                <hr className="shareHr" />


                {postFile && (
                    <div className="shareImgContainer">
                        <img src={URL.createObjectURL(postFile)} alt="" className="shareImg" />
                        <CancelOutlined className="shareCancleImg" onClick={() => setPostFile(null)} />
                    </div>
                )}

                <form className="shareBottom" onSubmit={submitHandle} encType="multipart/form-data">
                    <div className="shareOptions">

                        <label htmlFor="file" className="shareOption">

                            <PermMedia htmlColor="tomato" className="shareIcon" />
                            <span className="photo_video">Photo or Video</span>

                            <input style={{ display: "none" }} type="file" name="filename" id="file" accept=".png,.jpg,.jpeg," onChange={(e) => setPostFile(e.target.files[0])} />

                        </label>
                        <div className="shareOption">
                            <Label htmlColor="blue" className="shareIcon" />
                            <span className="shareOptionText">Tag</span>
                        </div>

                        <div className="shareOption">
                            <EmojiEmotions
                                htmlColor="rgb(206, 185, 66)" className="shareIcon" />
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                    <button type="submit" className="shareBtn">
                        <span>Share</span>
                        {progress > 0 &&
                            <div className="shareProgressBarDiv">

                                <CircularProgressbarWithChildren value={progress}>
                                    {
                                        (progress < 100) ? (<div style={{ fontSize: 15, marginTop: -5 }}>
                                            <strong></strong></div>)
                                            : (<img className="addIcon" src={done} alt="." />)

                                    }
                                </CircularProgressbarWithChildren>
                            </div>
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Share
