from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

def refresh_credentials(credentials):
    if credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())
    return credentials