import React, { useState, useEffect } from 'react'
import classes from '../cssmodules/HomePage.module.css';
import { useNavigate } from 'react-router';

import { getVideoDetails } from '../store/HelperFunctions';

const HomePage = () => {
    const navigate = useNavigate(); // navigate function to navigate to different pages
    const [videoId, setVideoId] = useState(''); // videoId state to store the videoId entered by the user initially empty
    const [history, setHistory] = useState([]); // history state to store the history of videoIds entered by the user initially empty

    useEffect(() => {
        // Function to get history video details from local storage and fetch their details
        const getHistoryVideoDetails = async () => {
            const historyIDS = JSON.parse(localStorage.getItem('history')) || [];  // Get the history of video IDs from local storage
            const historyDetailsPromises = historyIDS.map((item) => getVideoDetails(item));  // Map over the history IDs to create an array of promises
            const historyDetailsNew = await Promise.all(historyDetailsPromises);    // Wait for all promises to resolve and store the details in historyDetailsNew
            const validHistoryDetails = historyDetailsNew.filter(detail => detail); // Filter out any null values (in case fetching some video details failed)
            setHistory(validHistoryDetails); // Update the history state with the fetched video details
        };
        getHistoryVideoDetails(); // Call the function to get history video details
    }, []);

    // submitHandler function to handle the submit event when the user clicks on the submit button
    const submitHandler = () => {
        if (videoId.trim() === '') return; // if not VideoId Return
        navigate(`/${videoId}`);  // navigate to video page
    }
    return (
        <div className={classes.container}>
            <div className={classes.innerContainer}>
                <div class="input-group mb-3">
                    <input type="text" className="form-control shadow-none" placeholder="Enter video ID" aria-label="Recipient's username" aria-describedby="basic-addon2"
                        value={videoId} list="datalistOptions" onChange={(e) => setVideoId(e.target.value)} />
                    <datalist id="datalistOptions">
                        {history.map((data, index) => (<option key={index} value={data.id} />))}
                    </datalist>

                    <span className="input-group-text" id="basic-addon2" onClick={submitHandler}>Submit</span>
                </div>
            </div>

            <div>
                <div className={`container-fluid ${classes.innerContainer2}`} >
                    <h4>Recent Videos</h4>
                    <div className="row">
                        {history.map((data, index) => {
                            return <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4"  >
                                <div className="card">
                                    <img src={data.snippet.thumbnails.default.url} className="card-img-top" alt="thumbnail" />
                                    <div className="card-body">
                                        <h5 className="card-title">{data.id}</h5>

                                        <h5 className={`card-title ${classes.title}`} onClick={() => navigate(`/${data.id}`)} >{data.snippet.title?.substring(0, 40)}</h5>
                                    </div>
                                </div>
                            </div>
                        })}
                        {history.length === 0 && <div className="text-center">No recent videos</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage