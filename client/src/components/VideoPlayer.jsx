import React, { useEffect, useRef, useState } from 'react';
import { getVideoDetails } from '../store/HelperFunctions';

const VideoPlayer = ({ videoId, startTime, currentTime, setCurrentTime }) => {
    const playerRef = useRef(null);
    const [playerReady, setPlayerReady] = useState(false);
    const [videoDetails, setVideoDetails] = useState(null);
    const [readMore, setReadMore] = useState(false);

    useEffect(() => {
        const getdetails = async () => {

            const data = await getVideoDetails(videoId);
            console.log(data);
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
        if (playerReady && playerRef.current && playerRef.current.seekTo) {
            playerRef.current.seekTo(startTime);
        }
    }, [startTime, playerReady, videoId]);

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            // Start a timer to update the current time
            const interval = setInterval(() => {
                // if (playerReady)
                setCurrentTime(playerRef?.current?.getCurrentTime());
            }, 1000);

            // Clear the interval when the video stops playing
            return () => clearInterval(interval);
        }
    };
    console.log(currentTime);

    const createLinkMarkup = (text) => {
        const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        const linkifiedText = text?.replace(urlPattern, (url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
        return { __html: linkifiedText };
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 32px 0px 32px' }}>
            <div id="youtube-player" style={{ width: '100%', alignItems: 'center', height: '70vh', borderRadius: '8px', marginBottom: '10px' }}></div>
            <h4>{videoDetails?.snippet?.title}</h4>
            <p style={{ fontSize: '14px' }}>                 <span dangerouslySetInnerHTML={createLinkMarkup(readMore ? videoDetails?.snippet?.description?.substring(0, 100) : videoDetails?.snippet?.description)} />
                {videoDetails?.snippet?.description && (readMore ? <span onClick={() => setReadMore(false)} style={{ color: 'blue', cursor: 'pointer' }} >  Read More </span> : <span onClick={() => setReadMore(true)} style={{ color: 'blue', cursor: 'pointer' }} >  Show less</span>)}
            </p>
        </div >
    );
};

export default VideoPlayer;
