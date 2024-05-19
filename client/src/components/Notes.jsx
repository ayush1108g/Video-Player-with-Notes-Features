import React, { useState, useEffect } from 'react'
import classes from '../cssmodules/Notes.module.css';
import { useAlert } from '../store/AlertContext';
import { motion, useAnimationControls } from 'framer-motion';

import { handleImageUpload } from '../store/HelperFunctions';
import { CiCirclePlus } from "react-icons/ci";
import { ImCross } from "react-icons/im";
import { FaTimes } from 'react-icons/fa';
import Note from './Note';

import MySunEditor from '../Editor';

const Notes = ({ videoId, currentTime, setStartTime }) => {
    const alertCtx = useAlert();                                     // Alert context to show alerts
    const [addNote, setAddNote] = useState(false);                   // State to toggle between adding and cancelling note
    const [notesInput, setNotesInput] = useState('');                // State to store the input text for the note
    const [notes, setNotes] = useState([]);                          // State to store all the notes
    const [updateNotes, setUpdateNotes] = useState(false);           // State to update the notes
    const [imageArr, setImageArr] = useState([]);                    // State to store the images
    const [hoveredImageIndex, setHoveredImageIndex] = useState(null);// State to store the index of the hovered image
    const controls = useAnimationControls();                         // Framer motion controls for the add note container

    useEffect(() => {
        // fetch notes from the local storage
        const notes = JSON.parse(localStorage.getItem(videoId)) || [];
        setNotes(notes);
    }, [updateNotes, videoId])

    // Save notes to the local storage
    const saveNotesHandler = (notes) => {
        // Save the notes to the local storage
        try {
            localStorage.setItem(videoId, JSON.stringify(notes));
            setUpdateNotes(prev => !prev);
            return true;
        } catch (err) {
            setUpdateNotes(prev => !prev)
            alertCtx.showAlert('danger', 'Error Saving Notes Failed to save notes: Storage limit exceeded. ' + err.message);
            return false;
        }
    }

    // Add notes to the notes array
    const addnotesHandler = () => {
        if (notesInput.trim() === '') return alertCtx.showAlert('success', "Text Field can't be empty"); // If the input is empty, return
        // Create a new note object
        const newNote = {
            time: parseInt(currentTime),
            text: JSON.stringify(notesInput),
            timestamp: Date.now(),
            images: imageArr
        };
        const newNotes = [...notes, newNote];      // Add the new note to the notes array
        newNotes.sort((a, b) => a.time - b.time);  // Sort the notes array based on the time
        setNotesInput('');                         // Clear the input field
        setImageArr([]);                           // Clear the image array
        setNotes(newNotes);                        // Set the new notes array
        setAddNote(false);                         // Close the add note container
        if (saveNotesHandler(newNotes))            // Save the notes to the local storage
            alertCtx.showAlert('success', 'Notes Saved Successfully');
    }

    // Handle image upload
    const handleFileInputChange = async (event, setFunction) => {
        const files = event.target.files;   // Get the files from the input
        const maxFiles = 4;                 // Maximum number of images that can be uploaded (as too many images can slow down the site)
        if (files.length + imageArr.length > maxFiles) {
            // If the number of images exceeds the maximum limit, show an alert
            return alertCtx.showAlert('danger', `You can upload a maximum of ${maxFiles} images`);
        }
        let imgArr = [];
        // Add the images to the image array
        for (let i = 0; i < files.length; i++) {
            try {
                const base64String = await handleImageUpload(files[i]);
                imgArr.push(base64String);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
        setFunction(prev => [...prev, ...imgArr]);
        // Store imgArr in local storage or use it as needed
    };

    // Delete an image from the image array before saving the note
    const deleteImage = (index) => {
        const newImageArr = [...imageArr];  // Create a new image array
        newImageArr.splice(index, 1);       // Remove the image at the given index
        setImageArr(newImageArr);           // Set the new image array
    };

    // Handle the change in the note text
    const changeHandler = (content) => {
        setNotesInput(content);
    };

    // Format the current time in hours, minutes and seconds
    const currTimeStr = `${currentTime >= 3600 ? Math.floor(currentTime / 3600) + ' hours ' : ''}${Math.floor((currentTime % 3600) / 60)} min ${Math.floor(currentTime % 60)} sec`;

    // Animation variants for the add note container
    const animationVariants = {
        initial: { height: 0, opacity: 0 },
        animate: { height: 'auto', opacity: 1, display: 'flex' },
        exit: { height: 0, opacity: 0, display: 'none' },
        transition: { duration: 0.5 }
    };

    useEffect(() => {
        // Animate the add note container based on the addNote state value
        if (addNote) {
            controls.start('animate');
        } else {
            controls.start('exit');
        }
    }, [addNote, controls]);

    return (
        <div className={classes.container} >
            <div className={classes.innerContainer}>
                <div>
                    <h4>My Notes</h4>
                    <p>All your notes at a single place. Click on any timestamp to go to specific timestamp in the video.</p>
                    {addNote && <div className={classes.textContainer} style={{ fontSize: '14px' }}>
                        Add note at <span className={classes.timeStr}>{currTimeStr}</span>
                    </div>}
                </div>
                <div className={classes.buttonContainer}>
                    {!addNote ? <button className={classes.button} onClick={() => setAddNote(prev => !prev)}><CiCirclePlus size={20} />  &nbsp;Add Notes</button> :
                        <button className={classes.button} onClick={() => setAddNote(prev => !prev)}><ImCross size={15} color='red' />  &nbsp;Cancel Adding</button>
                    }
                </div>
            </div>
            <motion.div className={classes.addItemContainer} initial="initial" animate={controls} variants={animationVariants} >
                {addNote && <MySunEditor initialContent={notesInput} onChange={changeHandler} />}
                <div>
                    <input className={`form-control shadow-none ${classes.textContainer}`} accept="image/*" type="file" id="formFileMultiple" multiple onChange={(e) => handleFileInputChange(e, setImageArr)} />
                    {imageArr.map((img, index) => (
                        <div key={index} onMouseEnter={() => setHoveredImageIndex(index)} onMouseLeave={() => setHoveredImageIndex(null)}
                            style={{ position: 'relative', display: 'inline-block' }} >
                            <img src={img} alt="uploaded" className={classes.image} />
                            {hoveredImageIndex === index && (
                                <div className={classes.hoveredImageIcon} onClick={() => deleteImage(index)}>
                                    <FaTimes size={20} color="red" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <button className={classes.button} onClick={addnotesHandler}>Add</button>
            </motion.div>
            <hr />

            <div style={{ width: '100%' }}>
                {notes.map((note, index) => {
                    return <Note key={index} notes={notes} note={note} index={index} saveNotesHandler={saveNotesHandler} setStartTime={setStartTime} />
                })}
            </div>
        </div>
    )
}

export default Notes