import React, { useContext, useRef } from 'react'
import './updateProfile.css';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../config';

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
        <div>
            <form onSubmit={submitHandle}>
                <div>
                    <label htmlFor="">Username</label>
                    <input
                        placeholder=""
                        className="loginInput"
                        required
                        ref={username}
                    />
                </div>

                <div>
                    <label htmlFor="">Add Description</label>
                    <input
                        placeholder=""
                        className="loginInput"
                        required
                        ref={desc}
                    />
                </div>

                <div>
                    <label htmlFor="">From</label>
                    <input
                        placeholder=""
                        className="loginInput"
                        required
                        ref={from}
                    />
                </div>

                <div>
                    <label htmlFor="">City</label>
                    <input
                        placeholder=""
                        className="loginInput"
                        required
                        ref={city}
                    />
                </div>

                <div>
                    <button
                        className="loginBtn"
                        type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateProfile
