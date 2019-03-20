from flask import request, Flask, render_template
# CORS python package is standardized code that will allow webpages from other
# domains to access resources of this application server
# - read -- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
from flask_cors import CORS

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
    """Read the contents of the song file and send it to the webpage /
    javascript that requested it
    """

    """
    As we discussed last time, the HTTP request that we get from javascript
    in the browser now has an extra parameter on it and will look like this:
        localhost:8080/song?songName=01-SW-042017.mp3
    The ? in the URL is a character that marks the beginning of the 'query
    string' section.  After the ? there will be key / value pairs that represent
    'variables' and their values.  'songName' is the key and '01-SW-042017.mp3' is the
    value.  Simple info about URL structure:
        http://www.ronstauffer.com/blog/understanding-a-url/
    """
    # Flask has a requests object parses the query string out for us already
    # into the "args" attribute.  We just need to get the right parameter.
    song_name = request.args.get('songName')

    # Now that we have the song name, we will use it to match a song in our
    # directory of songs.  We are assuming the song name will match a song in
    # the folder.  If it does not match, then we will get an error
    song_path = 'static/source_audio/%s' % song_name
    content = ''
    with open(song_path, 'rb') as fp:
        content = fp.read()
    return content

if __name__ == '__main__':
    app.run(port=8000)
    # """rb=> read bitwize; fp=> file pointer"""
