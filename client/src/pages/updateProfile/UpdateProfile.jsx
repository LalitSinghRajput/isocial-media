import React, { useContext, useRef } from 'react'
import './updateProfile.css';
import Topbar from '../../components/topbar/Topbar';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../config';
import userImg from '../../assets/icons/user.png'

const UpdateProfile = () => {

    const navigate = useNavigate();
    const { user } = useContext(AuthContext)

    const desc = useRef();
    const username = useRef();
    const city = useRef();
    const from = useRef();

    const submitHandle = async (e) => {
        e.preventDefault();

        const updatedProfile = {
            userId: user._id,
            desc: desc.current.value,
            username: username.current.value,
            city: city.current.value,
            from: from.current.value,
        }

        // update profile to server
        const updateProfile = async () => {
            try {
                await axiosInstance.put("/users/" + user._id, updatedProfile, { headers: {}, Credentials: "include" })

                // update user in localStorage
                const UpdatedUser = Object.assign(user, updatedProfile);
                localStorage.setItem("user", JSON.stringify(UpdatedUser))

                navigate('/profile/' + user.username);
            } catch (error) {
                console.log(error);
            }
        }
        updateProfile();
    }

    return (
        <div className="updateProfileContainer">
            <Topbar />
            <form onSubmit={submitHandle} className="updateProfileForm">

                <div className="updateProfileItemsContainer">
                    <img src={user.profilePicture ? user.profilePicture : userImg} className="updateProfileImg" alt="." />
                </div>

                <div className="updateProfileItemsContainer">
                    <div className="updateProfileInp">
                        <label htmlFor="">Username</label>
                    </div>
                    <div className="updateProfileInp">
                        <input
                            placeholder=""
                            className="updateProfInpField"
                            required
                            ref={username}
                        />
                    </div>
                </div>

                <div className="updateProfileItemsContainer">
                    <div className="updateProfileInp">
                        <label htmlFor="">Add Description</label>
                    </div>
                    <div className="updateProfileInp">
                        <textarea
                            placeholder=""
                            className="updateProftextArea"
                            ref={desc}
                        />
                    </div>
                </div>

                <div className="updateProfileItemsContainer">
                    <div className="updateProfileInp">
                        <label htmlFor="">From</label>
                    </div>
                    <div className="updateProfileInp">
                        <input
                            placeholder=""
                            className="updateProfInpField"
                            ref={from}
                        />
                    </div>
                </div>

                <div className="updateProfileItemsContainer">
                    <div className="updateProfileInp">
                        <label htmlFor="">City</label>
                    </div>
                    <div className="updateProfileInp">
                        <input
                            placeholder=""
                            className="updateProfInpField"
                            ref={city}
                        />
                    </div>
                </div>

                <div className="updateProfileItemsContainer">
                    <button
                        className="loginBtn updateProfileSubmitBtn"
                        type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateProfile
