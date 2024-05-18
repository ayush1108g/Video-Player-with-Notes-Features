import React from 'react'
import classes from '../cssmodules/Header.module.css';

const Header = () => {
    return (
        <div className={classes.container}>
            <div className={classes.text}>Video Player with Notes</div>
        </div>
    )
}

export default Header