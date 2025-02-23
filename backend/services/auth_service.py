from flask import jsonify, session, request, redirect
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from config import Config

def handle_login():
    flow = Flow.from_client_config(
        client_config={
            "web": {
                "client_id": Config.GOOGLE_CLIENT_ID,
                "client_secret": Config.GOOGLE_CLIENT_SECRET,
                "auth_uri": Config.GOOGLE_AUTH_URI,
                "token_uri": Config.GOOGLE_TOKEN_URI,
                "redirect_uris": [Config.GOOGLE_REDIRECT_URI],
            }
        },
        scopes=["https://www.googleapis.com/auth/userinfo.email", "openid"],
        redirect_uri=Config.GOOGLE_REDIRECT_URI,
    )
    auth_url, _ = flow.authorization_url(prompt="consent")
    return jsonify({"auth_url": auth_url})

def handle_callback():
    """
    Handles the OAuth callback, stores user credentials in the session,
    and redirects to the frontend with user data.
    """
    try:
        # Fetch the token from the request URL
        flow = Flow.from_client_config(
            client_config={
                "web": {
                    "client_id": Config.GOOGLE_CLIENT_ID,
                    "client_secret": Config.GOOGLE_CLIENT_SECRET,
                    "auth_uri": Config.GOOGLE_AUTH_URI,
                    "token_uri": Config.GOOGLE_TOKEN_URI,
                    "redirect_uris": [Config.GOOGLE_REDIRECT_URI],
                }
            },
            scopes=["https://www.googleapis.com/auth/userinfo.email", "openid"],
            redirect_uri=Config.GOOGLE_REDIRECT_URI,
        )
        authorization_response = request.url
        flow.fetch_token(authorization_response=authorization_response)

        # Store credentials in the session
        credentials = flow.credentials
        session["credentials"] = {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": credentials.scopes,
        }

        # Fetch user info
        user_info_service = build("oauth2", "v2", credentials=credentials)
        user_info = user_info_service.userinfo().get().execute()

        # Redirect to the frontend with user data as query parameters
        frontend_url = "http://localhost:5173/profile"  # Replace with your frontend URL
        redirect_url = (
            f"{frontend_url}?"
            f"email={user_info['email']}&"
            f"id={user_info['id']}&"
            f"picture={user_info['picture']}&"
            f"verified_email={user_info['verified_email']}"
        )
        return redirect(redirect_url)

    except Exception as e:
        return jsonify({"error": str(e)}), 400
def handle_logout():
    """
    Clears the session and logs the user out.
    """
    try:
        # Clear the session
        session.pop("credentials", None)
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_profile():
    """
    Retrieves the user's profile information from the session.
    """
    try:
        # Check if the user is authenticated
        credentials = session.get("credentials")
        if not credentials:
            return jsonify({"error": "User not authenticated"}), 401

        # Rebuild the credentials object
        creds = Credentials(
            token=credentials["token"],
            refresh_token=credentials["refresh_token"],
            token_uri=credentials["token_uri"],
            client_id=credentials["client_id"],
            client_secret=credentials["client_secret"],
            scopes=credentials["scopes"],
        )

        # Refresh the token if it has expired
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())

        # Fetch the user's profile information
        user_info_service = build("oauth2", "v2", credentials=creds)
        user_info = user_info_service.userinfo().get().execute()

        return jsonify(user_info), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500