import axios from 'axios';

const formatISTDate = (timestamp) => {
    const istDate = new Date(timestamp); // Convert the timestamp to a date object

    // Format the date and time
    const optionsDate = {
        day: 'numeric',
        month: 'long',
        year: '2-digit',
    };

    // Format the time
    const optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };

    let formattedDate = istDate.toLocaleString('en-IN', optionsDate);
    formattedDate = formattedDate.slice(0, -2) + "'" + formattedDate.slice(-2);
    const formattedTime = istDate.toLocaleString('en-IN', optionsTime);

    return { date: formattedDate, time: formattedTime };
}

const createLinkMarkup = (text) => {
    const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    const linkifiedText = text?.replace(urlPattern, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
    return { __html: linkifiedText };
};

const getVideoDetails = async (videoId) => {
    const link = "https://www.googleapis.com/youtube/v3/videos";
    const params = {
        part: "snippet",
        id: videoId,
        key: process.env.REACT_APP_YT_API_KEY_1,
    };
    try {
        const response = await axios.get(link, { params: params });
        const data = response.data.items[0];
        return data;
    } catch (error) {
        console.log(error);
    }
}

const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result;
            resolve(base64String);
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            reject(new Error('No file provided'));
        }
    });
};

export { formatISTDate, getVideoDetails, handleImageUpload, createLinkMarkup };