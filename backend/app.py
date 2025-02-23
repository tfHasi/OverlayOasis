from flask import Flask
from flask_cors import CORS
from config import Config
from routes.auth import auth_bp
from routes.upload import upload_bp
from routes.process import process_bp
import os
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS
    CORS(app, supports_credentials=True, origins=Config.CORS_ORIGINS)

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(process_bp)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)