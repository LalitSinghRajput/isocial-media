import React, { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    useEffect(() => {

        const { password, updatedAt, tokens, email, createdAt, ...other } = state.user ? state.user : {};
        // console.log(other);

        localStorage.setItem("user", isEmpty(other) ? null : JSON.stringify(other));
    }, [state.user])

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};