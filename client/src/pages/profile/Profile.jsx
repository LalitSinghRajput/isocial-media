import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom';

import './profile.css'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

import addIcon from '../../assets/icons/addIcon.png'
import done from '../../assets/icons/done.png'
import 'react-circular-progressbar/dist/styles.css';

import Sidebar from '../../components/sidebar/Sidebar'
import Topbar from '../../components/topbar/Topbar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'

import { axiosInstance } from '../../config'
import defaultCoverPic from '../../assets/Person images/defaultProfileCover.png'
import defalutProfilePic from '../../assets/Person images/defaultAvtar.jpg';

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase.js'

const Profile = () => {

    const [user, setUser] = useState({})
    const [coverPic, setCoverPic] = useState(null)
    const [profilePic, setProfilePic] = useState(null)
    const [coverPicProgress, setCoverPicProgress] = useState(0);
    const [profilePicProgress, setProfilePicProgress] = useState(0);

    const currUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null
    const username = useParams().username;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get(`/users/?username=${username}`, { headers: {}, Credentials: "include" });

                if (!res.status === 200) {
                    const error = new Error(res.error);
                    throw error;
                }
                if (res.status === 403) {
                    localStorage.clear();
                    window.location.reload();
                }
                setUser(res.data);

            } catch (error) {
                console.log(error);
            }

        };
        fetchUser();

    }, [username]);

    // function to upload the file to firebase 
    const uploadFiles = async (file, imgType) => {
        if (!file) return

        const storageRef = ref(storage, `/files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed", (snapshot) => {
            if (imgType === "coverPicture") {
                const coverPicProgress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
                setCoverPicProgress(coverPicProgress)
            }
            else {
                const profilePicProgress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
                setProfilePicProgress(profilePicProgress)
            }

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
                        // set the url to the
                        user[`${imgType}`] = url;

                        const updatedUser = user;
                        updatedUser.userId = user._id;

                        // update profile to server
                        const updateProfile = async () => {
                            try {
                                await axiosInstance.put("/users/" + user._id, updatedUser, { headers: {}, Credentials: "include" })
                                // window.location.reload();
                                navigate('/profile/' + user.username);
                            } catch (error) {
                                console.log(error);
                            }
                        }
                        updateProfile()
                            .then(localStorage.setItem("user", JSON.stringify(updatedUser)), window.location.reload());
                    })
            }
        );
    }

    const coverPictureHandle = async (e) => {
        e.preventDefault();

        const fileName = e.target[0].files[0];
        setCoverPic(fileName);
        uploadFiles(fileName, "coverPicture")
    }

    const profilePictureHandle = async (e) => {
        e.preventDefault();

        const fileName = e.target[0].files[0];

        uploadFiles(fileName, "profilePicture")
    }


    return (
        <>
            <Topbar />
            <div className="profile">
                <Sidebar user={user} />
                <div className="profileRight">
                    <div className="profileRightTop">


                        <div className="profileCover">

                            <img className="profileCoverImg" src={user.coverPicture ? user.coverPicture : defaultCoverPic} alt="." />

                            {(username === currUser?.username) &&
                                (<form onSubmit={coverPictureHandle} className="coverForm">
                                    <div>
                                        <label>
                                            <img className="uploadIcon" src={addIcon} alt="." />
                                            <span className="photo_video"></span>
                                            <input
                                                style={{ display: "none" }}
                                                className="profileInp"
                                                id="coverFile"
                                                name="coverFile"
                                                type="file"
                                                accept=".png,.jpg,.jpeg,.mp4"
                                                onChange={(e) => setCoverPic(e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                    <div className="btnProgrssdiv">
                                        {coverPic && (<button
                                            className="uploadImgBtn shareBtn"
                                            type="submit">
                                            Upload
                                            {coverPicProgress > 0 &&
                                                <div className="progressBarDiv">

                                                    <CircularProgressbarWithChildren value={coverPicProgress}>
                                                        {
                                                            (coverPicProgress < 100) ? (<div style={{ fontSize: 15, marginTop: -5 }}>
                                                                <strong></strong></div>)
                                                                : (<img className="addIcon" src={done} alt="." />)

                                                        }
                                                    </CircularProgressbarWithChildren>

                                                </div>
                                            }
                                        </button>)
                                        }
                                    </div>

                                </form>
                                )}

                            <div className="userProfileContainer">

                                <img className="profileUserImg" src={user.profilePicture ? user.profilePicture : defalutProfilePic} alt="p1" />

                                {(username === currUser?.username) && (
                                    <form onSubmit={profilePictureHandle} className="userProfileForm">
                                        <div>
                                            <label>
                                                <img className="uploadIcon" src={addIcon} alt="." />
                                                <span className="photo_video"></span>
                                                <input
                                                    style={{ display: "none" }}
                                                    className="profileInp"
                                                    id="profileFile"
                                                    name="profileFile"
                                                    type="file"
                                                    accept=".png,.jpg,.jpeg,.mp4"
                                                    onChange={(e) => setProfilePic(e.target.files[0])}
                                                />
                                            </label>
                                        </div>
                                        <div className="profilebtnProgrssdiv">
                                            {profilePic && <button
                                                className="uploadImgBtn uploadProfilePicBtn shareBtn"
                                                type="submit">
                                                Upload
                                                {profilePicProgress > 0 &&
                                                    <div className="progressBarDiv">

                                                        <CircularProgressbarWithChildren value={profilePicProgress}>
                                                            {
                                                                (profilePicProgress < 100) ? (<div style={{ fontSize: 15, marginTop: -5 }}>
                                                                    <strong></strong></div>)
                                                                    : (<img className="addIcon" src={done} alt="." />)

                                                            }
                                                        </CircularProgressbarWithChildren>

                                                    </div>
                                                }
                                            </button>
                                            }
                                        </div>
                                    </form>
                                )}

                            </div>


                        </div>

                        <div className="profileInfo">
                            <span className="profileInfoName">{user.username}</span>
                            <span className="profileInfoDesc">{user.desc}</span>

                        </div>

                    </div>

                    <div className="profileRightBottom">
                        <Feed username={username} />
                        <Rightbar user={user} />
                    </div>

                </div>
            </div>
        </>
    )
}


export default Profile
