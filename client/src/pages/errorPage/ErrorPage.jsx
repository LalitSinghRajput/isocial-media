import React, { useEffect, useRef } from 'react'
import './errorPage.css'
import Lottie from 'lottie-web';
import Topbar from '../../components/topbar/Topbar';

const ErrorPage = () => {

    const container = useRef(null);

    useEffect(() => {
        Lottie.loadAnimation({
            container: container.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../../assets/error_404.json')
        })
    }, [])

    const handleGoBack = () => {
        window.history.back()
    }


    return (
        <>
            <Topbar />
            <div className="go_back_container">
                <button type="submit" className="loginBtn go_back" onClick={handleGoBack}> Go Back</button>
            </div>
            <div className="errorContainer">
                <div className="Errormsg" ref={container}></div>
            </div>
        </>
    )
}

export default ErrorPage
