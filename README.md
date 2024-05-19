# Video Player with Notes
## Site live on https://videoplayer-withnotes.netlify.app/

This application is a video player that allows users to take notes at specific timestamps. It supports adding images and using an HTML editor to format the notes. The notes are saved locally and can be accessed later. The project is built with React, Bootstrap, and Framer Motion, using React Router for navigation.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)

## Features

- **Video Player**: Play YouTube videos using the YouTube IFrame Player API.
- **Notes**: Add, edit, and delete notes linked to specific timestamps in the video.
- **Image Upload**: Upload and manage images within notes.
- **HTML Editor**: Use a rich text editor to format notes with HTML content.
- **History**: Automatically save and display the history of watched videos.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ayush1108g/Video-Player-with-Notes-Features.git
   cd video-player-with-notes
   cd client
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. **Home Page**: Enter a YouTube video ID and click "Submit" to play the video.
2. **Video Page**: Watch the video and add notes at specific timestamps.
3. **Notes**: Add text, images, and HTML content to notes. Notes are saved locally and displayed with timestamps.
4. **History**: View recently watched videos on the home page.

## Components

### `App.js`

The main application component that sets up the router and context providers.

### `Header.js`

The header component with a link to the home page.

### `RoutesComponent.js`

Defines the routes for the application.

### `HomePage.js`

The home page where users can enter a video ID and view recently watched videos.

### `VideoPage.js`

The page where users watch the video and add notes.

### `VideoPlayer.js`

The component that handles video playback using the YouTube IFrame Player API.

### `Notes.js`

The component for adding and displaying notes.

### `Note.js`

The component for individual notes, including editing and deleting functionalities.

### `Modal.js`

A component for displaying images in a modal.

### `Editor.js`

A rich text editor component for formatting notes with HTML content.

### `AlertContext.js`

Context for managing global alerts and notifications.

### `HelperFunctions.js`

A collection of helper functions used throughout the application.

## CSS Modules

Styled using CSS Modules for scoped styling.

## Context

- **`AlertContext.js`**: Provides a context for showing alerts.

## Helper Functions

- **`HelperFunctions.js`**: Contains utility functions for API calls, image uploads, and date formatting.

## Adding Notes

1. Navigate to the video page by entering a video ID on the home page.
2. Use the "Add Notes" button to open the note editor.
3. Enter your note using the rich text editor and optionally upload images.
4. Save the note to store it locally.

## Viewing Notes

1. Notes are displayed below the video player.
2. Click on the timestamp in the note to seek to the specific time in the video.
