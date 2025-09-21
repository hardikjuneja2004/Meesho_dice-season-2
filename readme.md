AI Product Image Enhancer (Meesho Clone - Dice Season 2)

ABOUT THE PROJECT

This project is a full-stack web application designed to help e-commerce sellers improve their product images using AI. It features a frontend interface where users can upload images, which are then processed by a backend server. The AI enhancement is designed to make product photos look more professional by improving colors, brightness, and contrast, sharpening details, removing shadows, and setting the background to pure white. The user can then preview and download the beautified images.

TECH STACK

Frontend: React, TypeScript, Axios, React-Dropzone.

Backend: Node.js, Express, Mongoose, Multer, Sharp.

Database: MongoDB.

APIs: OpenAI Images API.

FEATURES

Drag-and-drop image uploading functionality.

Supports multiple image file types, including PNG, JPG, JPEG, WebP, and GIF.

A multi-step workflow for each image: uploaded, submitting, submitted, processing, and completed.

A progress bar displays the status of uploads and enhancements.

The backend uses the Sharp library to convert images to PNG format with an alpha channel before processing.

AI-powered image beautification using a hardcoded prompt sent to the OpenAI API.

Ability to preview the enhanced image in a new browser tab.

Functionality to download the enhanced image.

Users can remove uploaded images from the queue.

The backend stores both original and beautified images in a MongoDB database.

GETTING STARTED

Prerequisites:

Node.js and npm

A running instance of MongoDB

An OpenAI API Key

Installation and Setup

Clone the Repository

git clone <repository-url>
cd <repository-directory>
Backend Setup

Navigate into the server directory.

Install the required npm packages.

npm install
Create a .env file in the server's root directory.

Add the following environment variables to the .env file:

MONGO_URI=<your_mongodb_connection_string>
OPENAI_API_KEY=<your_openai_api_key>
Start the backend server, which runs on port 5000.

node server.js
Frontend Setup

Navigate into the frontend/client directory.

Install the required npm packages.

npm install
Start the frontend development server.

npm run dev
The application will connect to the backend server at http://localhost:5000.
