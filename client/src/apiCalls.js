import { axiosInstance } from '../src/config'

export const loginCall = async (userCredentials, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        const res = await axiosInstance.post("/auth/login", userCredentials, headers);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });

        // console.log(res.data);

        if (res.status === 404 || !res) {
            window.alert('Invalid Credentials')
        }
        else {
            window.alert('Login Successful')
        }

    } catch (error) {
        window.alert('Failed to Login')
        dispatch({ type: "LOGIN_FAILURE", payload: error });
    }
}