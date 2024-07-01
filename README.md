# Video Upload and License Plate Recognition Backend

This project is a Node.js backend application that handles video uploads, extracts frames from the video, and uses a license plate recognition SDK to identify and authenticate vehicles.

## Features

- Video upload handling
- Frame extraction from uploaded videos
- License plate recognition using an external API
- Vehicle authentication based on recognized license plates
- CORS-enabled API endpoints

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed (version 12.x or higher recommended)
- npm (Node Package Manager) installed
- FFmpeg installed on your system (for video processing)

## Installation

1. Clone the repository: `git clone https://github.com/ahmadswalih/indiannumber-detection-backend`
2. Navigate to the project directory: `cd indiannumber-detection-backend`
3. Install the dependencies: `npm i`
4. Create an `uploads` directory in the root of the project:`mkdir uploads`

## Configuration

1. Ensure that the license plate recognition SDK is running at `http://localhost:8080/v1/plate-reader/`. If it's hosted elsewhere, update the URL in `uploadController.js`.

2. If needed, modify the `userData` object in `uploadController.js` to include your verified license plates and associated user data.

## Usage

1. Start the server:`npm start`
2. The server will start running on `http://localhost:4000` (or the port specified in your environment variables).

3. Use the following endpoint to upload a video:
- POST `/upload`
- Include the video file in the request body with the key "video"
- Optionally include a "duration" parameter to specify how many seconds of the video to process

## API Endpoints

- `GET /`: Returns a "Hello World" message
- `POST /upload`: Handles video upload and processing

## Project Structure

- `index.js`: Main application file, sets up the Express server and middleware
- `uploadController.js`: Contains the logic for handling file uploads and processing
- `uploadRoute.js`: Defines the route for the upload functionality

## Dependencies

- express: Web application framework
- multer: Middleware for handling multipart/form-data
- axios: Promise-based HTTP client
- fluent-ffmpeg: FFmpeg command builder and runner
- cors: Cross-Origin Resource Sharing middleware
- form-data: Library to create readable "multipart/form-data" streams

## Contributing

Contributions to this project are welcome. Please ensure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
      
      
