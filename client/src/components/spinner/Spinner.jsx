import React from 'react'
import './spinner.css'

import loader from '../../assets/icons/loader.gif'

const Spinner = () => {
    return (
        <>
            <img src={loader} alt="" className="spinner" />
        </>
    )
}

export default Spinner
