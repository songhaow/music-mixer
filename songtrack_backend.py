import json
from flask import request, Flask, render_template
# CORS python package is standardized code that will allow webpages from other
# domains to access resources of this application server
# - read -- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
from flask_cors import CORS
from song_process import beatsbpm_txt

TEMPLATES_FOLDER = 'static'
SOURCE_AUDIO_FOLDER = '../souce_audio'

app = Flask(__name__, template_folder=TEMPLATES_FOLDER)
# By applying CORS to the flask-python application object, we allow (by default)
# all websites domains to access content on this server
CORS(app)

@app.route('/')
def hello():
    return render_template('index.html')

# @app.route('/song')
# def handle_song():

# We are splitting the fetching of the tracks into two stages. One is to
# get the song characteristics (like bpm). The other one is to actually
# get the song content.
"""This function returns the song meta information (like bpm)
     :return: json information of the form
        song_info_json = {
            "beat_file": beat_key,
            "beat_list": beats,
            "bpm": bpm,
        }
"""
@app.route('/song-meta')
def handle_song_meta():
    song_name = request.args.get('songName')
    path = 'static/source_audio/'
    song_info_json = beatsbpm_txt(song_name, path)
    return json.dumps(song_info_json)

"""This function stays like the old /song end point used to be. It
    simply returns the song content.
"""
@app.route('/song-content')
def handle_song_content():
    song_name = request.args.get('songName')
    path = 'static/source_audio/'
    song_path = path + song_name  # static/source_audio/xxx.mp3
    content = ''
    with open(song_path, 'rb') as fp:
        content = fp.read()
    return content

if __name__ == '__main__':
    app.run(port=8000)
    # """rb=> read bitwize; fp=> file pointer"""
