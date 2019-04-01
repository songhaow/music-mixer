"""
# out put will be in xxxxxx.txt
#! /usr/bin/env python
"""
import sys
from aubio import source, tempo
from numpy import median, diff
import json
#-------------------------------------------------------------
def calculate_song_bpm(path):
    """ Calculate the beats per minute (bpm) of a given file.
        path: path to the file
    """
    samplerate, win_s, hop_s = 44100, 1024, 512
    s = source(path, samplerate, hop_s)
    samplerate = s.samplerate
    o = tempo("specdiff", win_s, hop_s, samplerate)
    beats = []  # List of beats, in samples
    total_frames = 0 # Total number of frames read

    while True:
        samples, read = s()
        is_beat = o(samples)
        if is_beat:
            this_beat = o.get_last_s()
            beats.append(this_beat)
        total_frames += read
        if read < hop_s:
            break

        def beats_to_bpm(path,beats):
        # if enough beats are found, convert to periods then to bpm
            if len(beats) > 1:
                if len(beats) < 4:
                    print("few beats found in {:s}".format(path))
                bpms = 60./diff(beats) #bpms is an array
                meadianbpm = median(bpms) #meanvalue of bpm
                return meadianbpm
            else:
                print("not enough beats found in {:s}".format(path))
                return 0

    return beats_to_bpm(path, beats)
#-----------------------------------------------------------------
def calculate_song_beats(path):
      beat_list = []  # list of beats, in samples
      samplerate, win_s, hop_s = 44100, 1024, 512
      s = source(path, samplerate, hop_s)
      samplerate = s.samplerate
      o = tempo("default", win_s, hop_s, samplerate)
      # tempo detection delay, in samples
      # default to 4 blocks delay to catch up with
      delay = 4. * hop_s
      total_frames = 0 # total number of frames read
      while True:
          samples, read = s()
          is_beat = o(samples)
          if is_beat:
              this_beat = int(total_frames - delay + is_beat[0] * hop_s)
              beati= this_beat / float(samplerate)
              beat_list.append(beati)
          total_frames += read
          if read < hop_s: return beat_list
#--------------------------------------------------------------
def beatsbpm_txt(song_name, path):

    text_name = song_name.split(".")[0]
    song_path = path + song_name
    beat_key = text_name + ".txt"
    beat_key_fname = path + beat_key
    beats = calculate_song_beats(song_path)
    bpm = calculate_song_bpm(song_path)

#Can this data directly send to javscript code without export the local dirct?
    song_info_json = {
        "beat_file": beat_key,
        "beat_list": beats,
        "bpm": bpm
      }

    output_fp = open(beat_key_fname, "w")
    output_fp.write(json.dumps(song_info_json))
    output_fp.close()
