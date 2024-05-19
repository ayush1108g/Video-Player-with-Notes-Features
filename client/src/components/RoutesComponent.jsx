import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom';

import HomePage from '../pages/HomePage'
import VideoPage from '../pages/VideoPage'

const RoutesComponent = () => {
    const location = useLocation()
    return (
        <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/:videoId" element={<VideoPage />} />
        </Routes>
    )
}

export default RoutesComponent;