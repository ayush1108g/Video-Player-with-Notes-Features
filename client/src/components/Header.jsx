import React from 'react'
import classes from '../cssmodules/Header.module.css';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className={classes.container}>
            <Link className={classes.text} to="/">Video Player with Notes</Link>
        </div>
    )
}

export default Header