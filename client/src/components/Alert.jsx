import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAlert } from '../store/AlertContext.js';

const Alert = ({ type = 'success', message }) => {
    const { hideAlert } = useAlert();
    const [visible, setVisible] = useState(true);
    const [show, setShow] = useState('show');

    // Hide alert after 4 seconds
    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible((visible) => !visible);
            setShow((show) => (show === 'show' ? 'hide' : 'show'));
            setTimeout(() => {
                hideAlert();
            }, 500);
        }, 4000);

        return () => {
            clearTimeout(timeout);
        };
    }, [message, setShow, setVisible, hideAlert, show, visible, type]);

    // Hide alert on close button click
    const hideHandler = () => {
        setVisible(false);
        setShow('hide');
        setTimeout(() => {
            hideAlert();
        }, 500);
    };

    // Framer motion animation
    const divmotion = { initial: { y: '200%' }, animate: { y: 0 }, exit: { y: '200%', transition: { duration: 0.5 } }, transition: { duration: 0.5 }, }

    return (
        <>
            {visible && (
                <motion.div key={(visible === true ? 'show' : 'hide')} {...divmotion} className={`alert alert-${type} alert-dismissible fade show`} role="alert"
                    style={{
                        color: "black", display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        flexDirection: 'row', position: 'fixed', bottom: '80px', right: '10px', zIndex: '1000', minWidth: '250px', gap: '20px'
                    }}>
                    <div>

                        {message}
                    </div>
                    <button type="button" className="btn btn-outline-primary close" onClick={() => hideHandler()} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </motion.div>
            )}
        </>
    );
};

export default Alert;
