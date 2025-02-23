# backend/services/auth_service.py
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from backend.config import Config

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
    # Fetch token and store credentials
    pass

def handle_logout():
    # Clear session
    pass

def get_profile():
    # Return user profile
    pass