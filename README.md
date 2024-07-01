# Video Upload and License Plate Recognition Backend

This project is a Node.js backend application that handles video uploads, extracts frames from the video, and uses a license plate recognition SDK to identify and authenticate vehicles.

## About

This backend application is designed to enhance security and streamline vehicle access management for various facilities such as gated communities, parking structures, or corporate campuses. It provides an automated solution for vehicle identification and authentication, eliminating the need for manual checks and improving overall efficiency.

### Use Case

The primary use case for this application is in scenarios where vehicle access needs to be monitored and controlled:

1. **Gated Communities**: Residents can upload videos of vehicles entering the community. The system automatically recognizes license plates and verifies if the vehicle belongs to a resident or registered visitor.

2. **Parking Structures**: For commercial or public parking areas, the system can quickly process incoming vehicles, identify frequent users, and potentially automate billing or access control.

3. **Corporate Campuses**: Companies can use this system to manage employee and visitor parking, ensuring only authorized vehicles are granted access to the premises.

4. **Event Venues**: For large events with dedicated parking, organizers can use this system to verify attendees' vehicles and manage parking allocations efficiently.

5. **Law Enforcement Support**: While not its primary purpose, the system could potentially assist law enforcement in identifying vehicles of interest in investigations.

### Key Benefits

- **Automated Recognition**: Eliminates the need for manual license plate checks, reducing human error and increasing efficiency.
- **Quick Processing**: Capable of handling multiple frames from a video, increasing the chances of accurate plate recognition.
- **User Authentication**: Integrates with a user database to quickly identify known vehicles and their associated information.
- **Flexible Implementation**: Can be adapted for various scenarios where vehicle identification is needed.
- **Enhanced Security**: Provides a log of vehicles entering a facility, which can be crucial for security purposes.

By automating the process of vehicle identification and authentication, this application significantly reduces the time and resources needed for manual checks, while also improving accuracy and security.




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
      
      
