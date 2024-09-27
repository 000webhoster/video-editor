const express = require('express');
const multer = require('multer');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for serving static files
app.use(express.static('public'));

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// Endpoint to handle video processing
app.post('/process', upload.single('video'), (req, res) => {
    const inputFilePath = path.join(__dirname, 'uploads', req.file.filename);
    const outputFilePath = path.join(__dirname, 'uploads', 'output.mp4');

    const command = `${ffmpegPath} -i ${inputFilePath} -vf "scale=3840:2160" ${outputFilePath}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Error processing video');
        }
        res.download(outputFilePath, 'output.mp4');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
