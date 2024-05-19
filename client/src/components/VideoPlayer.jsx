import React, { useEffect, useRef, useState } from 'react';
import classes from '../cssmodules/VideoPlayer.module.css';

import { getVideoDetails, createLinkMarkup } from '../store/HelperFunctions';

const VideoPlayer = ({ videoId, startTime, currentTime, setCurrentTime }) => {
    const playerRef = useRef(null);                             // Reference to the YouTube IFrame Player
    const [playerReady, setPlayerReady] = useState(false);      // State to check if the player is ready
    const [videoDetails, setVideoDetails] = useState(null);     // State to store the video details
    const [readMore, setReadMore] = useState(false);            // State to toggle between read more and read less

    useEffect(() => {
        // Fetch the video details from the YouTube API
        const getdetails = async () => {
            const data = await getVideoDetails(videoId);
            if (data) {
                setVideoDetails(data);
                if (data.snippet.description.length) setReadMore(true);
            }
        }
        getdetails();
    }, [videoId]);

    useEffect(() => {
        // Check if the YouTube IFrame Player API script has already been loaded
        if (window.YT && window.YT.Player) {
            initializePlayer();
        } else {
            // Load the YouTube IFrame Player API
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = initializePlayer;
        }
        // Clean up function
        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [videoId]);

    const initializePlayer = () => {
        // Initialize the YouTube IFrame Player with the videoId and start time
        playerRef.current = new window.YT.Player('youtube-player', {
            videoId: videoId,
            playerVars: {
                // autoplay: 1,
                start: startTime
            },
            events: {
                'onReady': () => setPlayerReady(true),
                'onStateChange': onPlayerStateChange
            }
        });
    };

    useEffect(() => {
        // Seek to the start time when the player is ready and the start time is not 0
        if (playerReady && playerRef.current && playerRef.current.seekTo) {
            playerRef.current.seekTo(startTime);
        }
    }, [startTime, playerReady, videoId]);

    const onPlayerStateChange = (event) => {
        // If the video is playing, start a timer to update the current time
        if (event.data === window.YT.PlayerState.PLAYING) {
            // Start a timer to update the current time
            const interval = setInterval(() => {
                setCurrentTime(playerRef?.current?.getCurrentTime());
            }, 1000);

            // Clear the interval when the video stops playing
            return () => clearInterval(interval);
        }
    };

    const toggleReadMore = () => {
        setReadMore(prev => !prev);
    };

    return (
        <div className={classes.container}>
            <div id="youtube-player" className={classes.player}></div>
            <h4>{videoDetails?.snippet?.title}</h4>
            <p style={{ fontSize: '14px' }}>
                <span dangerouslySetInnerHTML={createLinkMarkup(readMore ? videoDetails?.snippet?.description?.substring(0, 100) : videoDetails?.snippet?.description)} />
                {videoDetails?.snippet?.description && (
                    <span onClick={toggleReadMore} className={classes.readMore}>
                        {!readMore ? '  Show less' : '...  Read More'}
                    </span>
                )}
            </p>
        </div >
    );
};

export default VideoPlayer;
