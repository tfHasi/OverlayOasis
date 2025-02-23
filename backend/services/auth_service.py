from flask import jsonify, session, request
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
    Handles the OAuth callback and stores user credentials in the session.
    Returns a JSON response with the user's profile information.
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
        # Get the full URL including query parameters
        authorization_response = request.url
        flow.fetch_token(authorization_response=authorization_response)

        # Rest of your code remains the same
        credentials = flow.credentials
        session["credentials"] = {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": credentials.scopes,
        }

        user_info_service = build("oauth2", "v2", credentials=credentials)
        user_info = user_info_service.userinfo().get().execute()

        return jsonify({"message": "Login successful", "user": user_info})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

def handle_logout():
    # Clear session
    pass

def get_profile():
    # Return user profile
    pass