# Backend Gallery App

This is the backend repository for the Cloud Snap application. It is built with Node.js and provides API endpoints for handling media uploads and retrievals using AWS S3. This backend also manages user authentication and data storage using MongoDB.

## Features

- RESTful API for media operations
- User authentication
- Media storage and retrieval using AWS S3
- MongoDB for data storage

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **AWS S3**

## Installation

To set up the repository and run the backend server locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kishankool/backend_gallery_app.git
   cd backend_gallery_app

   ```

2. **_Install dependencies_**

   npm install

3. **_Set up environment variables:_**
   Create a .env file in the root directory and add the following environment variables:

   PORT=your_port_number
   MONGO_URL=your_mongodb_connection_string
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET_NAME=your_aws_s3_bucket_name

4. **_Set up AWS S3:_**
   Ensure you have an AWS S3 bucket set up with the appropriate permissions for your access keys.

5. **_Start the server:_**
   node index.js

API Endpoints
Here are the primary API endpoints provided by this backend:

POST /api/media/upload: Upload media files to AWS S3
GET /api/media: Retrieve all media files for a user

License
This project is licensed under the MIT License. See the LICENSE file for details.

For any questions or issues, please open an issue on GitHub or contact the maintainer.

Happy coding!
