import React, { useState, useEffect } from 'react'
import classes from '../cssmodules/VideoPage.module.css';

import { useParams } from 'react-router'
import VideoPlayer from '../components/VideoPlayer';
import Notes from '../components/Notes';
const VideoPage = () => {
    const { videoId } = useParams();
    const [currentTime, setCurrentTime] = useState(0);
    const [startTime, setStartTime] = useState(0);

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        const index = history.indexOf(videoId); // find videoId in local storage if videoId exists

        // if exists, remove it 
        if (index !== -1) {
            history.splice(index, 1);
        }
        // Add it to the top
        history.unshift(videoId);
        localStorage.setItem('history', JSON.stringify(history)); // store the history in local storage
    }, [videoId])

    console.log(videoId);
    return (
        <div className={classes.container}>
            <div>
                <VideoPlayer videoId={videoId} startTime={startTime} currentTime={currentTime} setCurrentTime={setCurrentTime} />
            </div>
            <div>
                <Notes videoId={videoId} currentTime={currentTime} setStartTime={setStartTime} />
            </div>
        </div>
    )
}

export default VideoPage