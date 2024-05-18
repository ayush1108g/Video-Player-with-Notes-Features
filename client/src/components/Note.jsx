import React, { useState } from 'react'
import { useAlert } from '../store/AlertContext';
import { formatISTDate } from '../store/HelperFunctions';
import classes from "../cssmodules/Note.module.css";

const NoteComponent = ({ notes, note, index, saveNotesHandler, setStartTime }) => {
    const alertCtx = useAlert();
    const [editNoteText, setNoteText] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const timeStr = `${note.time >= 3600 ? Math.floor(note.time / 3600) + ' hours ' : ''}${Math.floor((note.time % 3600) / 60)} min ${note.time % 60} sec`;

    // Delete the note
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
        if (!isEditing) setNoteText(note.text);
        setIsEditing(prev => !prev);
    }

    // Save the edited note
    const saveEditNoteHandler = () => {
        const newNotes = notes.map((note, i) => i === index ? { ...note, text: editNoteText, timestamp: Date.now(), } : note);
        saveNotesHandler(newNotes);
        setIsEditing(false)
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

    // Format the date and time
    const datetime = formatISTDate(note.timestamp);

    return <div key={index} className={classes.container}>
        <div>
            <div>{datetime.date + ' ' + datetime.time}</div>
            <div>Timestamp:<span className={classes.timeStr} onClick={() => navigateToTime(note.time)}> {timeStr} </span></div>
        </div>
        {!isEditing ? <>
            <div className={classes.textContainer}>{note.text}</div>
            <div className={classes.buttonContainer}>
                <button onClick={() => toggleEditing()} className={classes.button}>Edit</button>
                <button onClick={() => deleteNotesHandler(index)} className={classes.button}>Delete</button>
            </div>
        </> : <>
            <input className={classes.textContainer} style={{ border: '1px solid black' }} value={editNoteText} onChange={(e) => setNoteText(e.target.value)} />
            <div className={classes.buttonContainer} >
                <button onClick={() => toggleEditing()} className={classes.button}>Cancel</button>
                <button onClick={saveEditNoteHandler} className={classes.button}>Save</button>
            </div>
        </>}
        <hr />
    </div>
}

export default NoteComponent;