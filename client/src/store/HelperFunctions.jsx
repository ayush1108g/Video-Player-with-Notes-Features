import axios from 'axios';

const formatISTDate = (timestamp) => {
    const istDate = new Date(timestamp);

    const optionsDate = {
        day: 'numeric',
        month: 'long',
        year: '2-digit',
    };

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


const getVideoDetails = async (videoId) => {
    const link = "https://www.googleapis.com/youtube/v3/videos";
    const params = {
        part: "snippet",
        id: videoId,
        key: process.env.REACT_APP_YT_API_KEY_1,
    };
    try {
        const response = await axios.get(link, { params: params });
        console.log(response.data.items[0]);
        const data = response.data.items[0];
        return data;
    } catch (error) {
        console.log(error);
    }
}

export { formatISTDate, getVideoDetails };