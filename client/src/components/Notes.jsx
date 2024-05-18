import React, { useState, useEffect } from 'react'
import classes from '../cssmodules/Notes.module.css';
import { useAlert } from '../store/AlertContext';
import { CiCirclePlus } from "react-icons/ci";
import Note from './Note';

const Notes = ({ videoId, currentTime, setStartTime }) => {
    const alertCtx = useAlert();
    const [addNote, setAddNote] = useState(false);
    const [notesInput, setNotesInput] = useState('');
    const [notes, setNotes] = useState([]);
    const [updateNotes, setUpdateNotes] = useState(false);

    useEffect(() => {
        // fetch notes from the local storage
        const notes = JSON.parse(localStorage.getItem(videoId)) || [];
        setNotes(notes);
    }, [updateNotes, videoId])

    // Save notes to the local storage
    const saveNotesHandler = (notes) => {
        localStorage.setItem(videoId, JSON.stringify(notes));
        setUpdateNotes(prev => !prev);
    }

    const addnotesHandler = () => {
        if (notesInput.trim() === '') return;
        const newNote = {
            time: parseInt(currentTime),
            text: notesInput,
            timestamp: Date.now(),
            isEditing: false,
        };
        const newNotes = [...notes, newNote];
        newNotes.sort((a, b) => a.time - b.time);
        console.log(newNotes);
        setNotesInput('');
        setNotes(newNotes);
        setAddNote(false);
        saveNotesHandler(newNotes);
        alertCtx.showAlert('success', 'Notes Saved Successfully');
    }
    const currTimeStr = `${currentTime >= 3600 ? Math.floor(currentTime / 3600) + ' hours ' : ''}${Math.floor((currentTime % 3600) / 60)} min ${Math.floor(currentTime % 60)} sec`;

    return (
        <div className={classes.container} >
            <div className={classes.innerContainer}>
                <div>
                    <h4>My Notes</h4>
                    <p>All your notes at a single place. Click on any timestamp to go to specific timestamp in the video.</p>
                </div>
                <div className={classes.buttonContainer}>
                    <button className={classes.button} onClick={() => setAddNote(prev => !prev)}><CiCirclePlus size={20} />  &nbsp;Add Notes</button>
                </div>
            </div>
            {addNote && (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                    <div className={classes.textContainer} style={{ fontSize: '14px' }}>Add note at <span style={{ color: 'blue', cursor: 'pointer' }}>{currTimeStr}</span></div>
                    <input className={classes.textContainer} style={{ minWidth: '50%' }} type="text" placeholder="Enter note" value={notesInput} onChange={(e) => setNotesInput(e.target.value)} />
                    <button className={classes.button} onClick={addnotesHandler}>Add</button>
                </div>
            )}
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