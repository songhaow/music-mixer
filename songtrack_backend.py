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

@app.route('/song')
def handle_song():
    song_name = request.args.get('songName')
    path = 'static/source_audio/'
    song_path = path + song_name  # static/source_audio/xxx.mp3

# this is to process the song and export ison file for beats & bpm
    song_info_json = beatsbpm_txt(song_name, path)
    """
    song_info_json = {
        "beat_file": beat_key,
        "beat_list": beats,
        "bpm": bpm,
    }
    """
    content = ''
    with open(song_path, 'rb') as fp:
        content = fp.read()

    song_info_json['song_content'] = content
    """
    song_info_json = {
        "beat_file": beat_key,
        "beat_list": beats,
        "bpm": bpm,
        "song_content": "abc...xyz",
    }
    """

    return song_info_json


if __name__ == '__main__':
    app.run(port=8080)
    # """rb=> read bitwize; fp=> file pointer"""
