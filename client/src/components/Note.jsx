import React, { useState } from 'react'
import classes from "../cssmodules/Note.module.css";

import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

import { useAlert } from '../store/AlertContext';
import { formatISTDate, handleImageUpload } from '../store/HelperFunctions';
import ImageModal from './Modal';
import MySunEditor from '../Editor';

const NoteComponent = ({ notes, note, index, saveNotesHandler, setStartTime }) => {
    const alertCtx = useAlert();                            // Alert context to show alerts
    const [editNoteText, setNoteText] = useState('');       // State to store the edited note text
    const [editImages, setEditImages] = useState([]);       // State to store the edited images
    const [isEditing, setIsEditing] = useState(false);      // State to toggle between editing and viewing the note
    const [hoveredImageIndex, setHoveredImageIndex] = useState(null);// State to store the index of the hovered image

    // Format the time
    const timeStr = `${note.time >= 3600 ? Math.floor(note.time / 3600) + ' hours ' : ''}${Math.floor((note.time % 3600) / 60)} min ${note.time % 60} sec`;

    // Delete the note from the notes array
    const deleteNotesHandler = (index) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this note?');
        if (!isConfirmed) return;

        const newNotes = [...notes];
        newNotes.splice(index, 1);
        saveNotesHandler(newNotes);
        alertCtx.showAlert('danger', 'Note Deleted Successfully');
    }

    // Toggle between editing and viewing the note
    const toggleEditing = () => {
        if (!isEditing) {
            setNoteText(JSON.parse(note.text));
            setEditImages(note.images);
        }
        setIsEditing(prev => !prev);
    }

    // Save the edited note
    const saveEditNoteHandler = () => {
        const newNotes = notes.map((note, i) => i === index ? { ...note, text: JSON.stringify(editNoteText), timestamp: Date.now(), images: editImages } : note);
        setIsEditing(false)
        if (saveNotesHandler(newNotes))
            alertCtx.showAlert('success', 'Note Updated Successfully');
    }

    // Navigate to the time in the video player
    const navigateToTime = (time) => {
        // Seek to the time in the video player
        setStartTime(time !== 0 ? 0 : 1);
        setTimeout(() => {
            setStartTime(time);
        }, 1);
        window.scrollTo(0, 0);
    }

    // Delete the image from the edited images array
    const deleteImage = (index) => {
        const newImageArr = [...editImages];
        newImageArr.splice(index, 1);
        setEditImages(newImageArr);
    };


    const changeHandler = (content) => {
        const dhtml = content;
        const pdata = dhtml;
        console.log("pdata", pdata);
        setNoteText(pdata);
        console.log("data", pdata);
    };

    const handleFileInputChange = async (event, setFunction) => {
        const files = event.target.files;
        const maxFiles = 4; // Maximum number of images that can be uploaded (as too many images can slow down the site)
        if (files.length + editImages?.length > maxFiles) {
            return alertCtx.showAlert('danger', `You can upload a maximum of ${maxFiles} images`);
        }
        let imgArr = [];
        for (let i = 0; i < files.length; i++) {
            try {
                const base64String = await handleImageUpload(files[i]);
                imgArr.push(base64String);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        setFunction(prev => prev ? [...prev, ...imgArr] : [...imgArr]);
        // Store imgArr in local storage or use it as needed
        console.log(imgArr);
    };
    // Format the date and time
    const datetime = formatISTDate(note.timestamp);

    // Animation variants for the note
    const animationVariants = {
        initial: { height: 0, opacity: 0 },
        animate: { height: 'auto', opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: { duration: 0.5 }
    };

    return <div key={index} className={classes.container}>
        <div>
            <div>{datetime.date + ' ' + datetime.time}</div>
            <div>Timestamp:
                <span className={classes.timeStr} onClick={() => navigateToTime(note.time)}> {timeStr} </span>
            </div>
        </div>
        {!isEditing ? (
            <>
                <div className={classes.textContainer}
                    dangerouslySetInnerHTML={{ __html: JSON.parse(note.text), }} ></div>
                {note?.images?.length > 0 && <div className={classes.imageContainer}>
                    {note.images.map((img, index) => {
                        return <ImageModal key={index} imageUrl={img} className={classes.image} />
                    })}
                </div>}
                <div className={classes.buttonContainer}>
                    <button onClick={() => toggleEditing()} className={classes.button}>Edit Note</button>
                    <button onClick={() => deleteNotesHandler(index)} className={classes.button}>Delete Note</button>
                </div>
            </>
        ) : (
            <>
                {/* <input className={classes.textContainer} style={{ border: '1px solid black' }} value={editNoteText} onChange={(e) => setNoteText(e.target.value)} /> */}
                <MySunEditor initialContent={JSON.parse(note.text)} onChange={changeHandler} />
                <motion.div className="mb-3" {...animationVariants}>
                    <input className="form-control shadow-none" accept="image/*" type="file" id="formFileMultiple" multiple onChange={(e) => handleFileInputChange(e, setEditImages)} />
                </motion.div>
                {editImages?.length > 0 && <div className={classes.imageContainer}>
                    {editImages.map((img, index) => {
                        return (<>
                            <div key={index} onMouseEnter={() => setHoveredImageIndex(index)} onMouseLeave={() => setHoveredImageIndex(null)}
                                style={{ position: 'relative', display: 'inline-block' }} >
                                <ImageModal key={index} imageUrl={img} className={classes.image} />
                                {hoveredImageIndex === index && (
                                    <div style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }} onClick={() => deleteImage(index)}>
                                        <FaTimes size={20} color="red" />
                                    </div>
                                )}
                            </div>
                        </>)
                    })}
                </div>}
                <div className={classes.buttonContainer} >
                    <button onClick={() => toggleEditing()} className={classes.button}>Cancel</button>
                    <button onClick={saveEditNoteHandler} className={classes.button}>Save Note</button>
                </div>
            </>
        )}
        <hr />
    </div>
}

export default NoteComponent;