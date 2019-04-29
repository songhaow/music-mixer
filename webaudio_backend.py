from flask import request, Flask, render_template
# CORS python package is standardized code that will allow webpages from other
# domains to access resources of this application server
# - read -- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
from flask_cors import CORS

TEMPLATES_FOLDER = 'static'
SOURCE_AUDIO_FOLDER = '../audio'

app = Flask(__name__, template_folder=TEMPLATES_FOLDER)
# By applying CORS to the flask-python application object, we allow (by default)
# all websites domains to access content on this server
CORS(app)

@app.route('/')
def hello():
    return render_template('webaudio-004.html')

if __name__ == '__main__':
    app.run(port=8080)
    # """rb=> read bitwize; fp=> file pointer"""
