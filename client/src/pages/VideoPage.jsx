import React, { useState, useEffect } from 'react'

import { useParams } from 'react-router'
import VideoPlayer from '../components/VideoPlayer';
import Notes from '../components/Notes';

const VideoPage = () => {
    const { videoId } = useParams();                    // get the videoId from the URL
    const [currentTime, setCurrentTime] = useState(0);  // state to store the current time of the video
    const [startTime, setStartTime] = useState(0);      // state to store the start time of the video

    useEffect(() => {
        // Get the history from local storage
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

    return (
        <div>
            <VideoPlayer videoId={videoId} startTime={startTime} currentTime={currentTime} setCurrentTime={setCurrentTime} />
            <Notes videoId={videoId} currentTime={currentTime} setStartTime={setStartTime} />
        </div>
    )
}

export default VideoPage