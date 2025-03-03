OverlayOasis
OverlayOasis is a web application that allows users to add text overlays to videos by providing an MP4 file and a CSV file containing language-translation text pairs. The application processes the input and generates multiple video outputs, each corresponding to a row in the CSV file.

Features
Upload a video (MP4) and a CSV file containing text overlay pairs.
Automatically generate videos with text overlays based on the CSV content.
Supports multiple languages and translations for overlays.
User authentication via Google Sign-In.
Frontend built with React + Vite for a seamless user experience.
Backend powered by Flask, utilizing Blueprints for structured file handling and overlay processing.
Tech Stack
Backend:
Flask (structured with Blueprints)
MoviePy & FFmpeg (for video processing)
Pandas (for CSV handling)
Flask-Login & OAuth (Google Authentication)
Frontend:
React + Vite
Google Authentication
Tailwind CSS (for styling)
How It Works
User Login: Authenticate with Google to access the platform.
Upload Files: Provide an MP4 video file and a CSV file with language-text pairs.
Processing:
The backend reads the CSV file, extracting text pairs.
For each row (excluding the header), a new video is generated with the corresponding text overlay.
Download Output: Users can download the generated videos.
Setup Instructions
1. Clone the Repository
sh
Copy
Edit
git clone https://github.com/your-username/OverlayOasis.git
cd OverlayOasis
2. Backend Setup (Flask)
Create a virtual environment

sh
Copy
Edit
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
Install dependencies

sh
Copy
Edit
pip install -r requirements.txt
Set up the .env file
Create a .env file in the root backend folder and configure it as follows:

ini
Copy
Edit
SECRET_KEY=your_secret_key
CORS_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://127.0.0.1:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/callback
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
UPLOAD_FOLDER=your_absolute_path_to_uploads
OUTPUT_FOLDER=your_absolute_path_to_outputs
FFMPEG_BINARY=your_absolute_path_to_ffmpeg
Important: Update UPLOAD_FOLDER, OUTPUT_FOLDER, and FFMPEG_BINARY to match your local paths.

Run the Flask server

sh
Copy
Edit
flask run
3. Frontend Setup (React + Vite)
Navigate to the frontend directory:
sh
Copy
Edit
cd frontend
Install dependencies:
sh
Copy
Edit
npm install
Start the development server:
sh
Copy
Edit
npm run dev
