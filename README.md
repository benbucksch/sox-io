# sox-io
Play audio on speaker via sound card, record from microphone/aux in, or transform audio format

# soxPlay

Play audio on the speaker via the sound card


* Param `soxOption` {object} The options in `global` and `input` match sox commandline, see [man sox](https://linux.die.net/man/1/sox)
```
{
  device {string}  Audio hardware device to use. E.g. "hw:1,0"
  driver {string enum}  (Optional) Audio API from OS to use. E.g. "pulse" (PulseAudio), "alsa" (Linux), or "coreaudio" (Mac)
  global {
    ...
  }
  input {   format in which you will write audio data to the writable stream.
    type {string enum} "wav" or "raw" -- "wav" = Wave file (the other input parameters are then unnecessary)
    channels {integer} 1 = mono, 2 = stereo, ...
    bits {integer}  Resolution per sample. 8, 16 (normal), 24 (hifi), or 32
    rate {integer} Sample rate, e.g. 8000 (phone), 16000 (speech), 44100 (CD), 48000 (music quality), 96000 (hifi)
    encoding {string enum} "signed-integer", "unsigned-integer", or "float"
  }
}
```

* Returns `WritableStream` Write data to this stream, in the format defined by `soxOptions.input`


# soxRecord

Record audio from a microphone or aux in via the sound card

* Param `soxOption` {object} The options in `global`, `input` and `output` match sox commandline, see [man sox](https://linux.die.net/man/1/sox)
```
{
  device {string}  Audio hardware device to use. E.g. "hw:1,0"
  driver {string enum}  (Optional) Audio API from OS to use. E.g. "pulse" (PulseAudio), "alsa" (Linux), or "coreaudio" (Mac)
  global {
    ...
  }
  input {   How to record from the sound card
    channels {integer} 1 = mono, 2 = stereo, ...
    bits {integer}  Resolution per sample. 8, 16 (normal), 24 (hifi), or 32
    rate {integer} Sample rate, e.g. 8000 (phone), 16000 (speech), 44100 (CD), 48000 (music quality), 96000 (hifi)
  }
  output {   Which format you want to receive the audio in
    type {string enum} "wav" or "raw"
    encoding {string enum} "signed-integer", "unsigned-integer", or "float"
  }
}
```

* Returns `ReadableStream` Contains audio data, in the format defined by `soxOptions.input` and `soxOptions.output`

# soxIO

Transform audio from one format to another format.

* Param `soxOption` {object} The options in `global`, `input` and `output` match sox commandline, see [man sox](https://linux.die.net/man/1/sox)
```
{
  device {string}  Audio hardware device to use. E.g. "hw:1,0"
  driver {string enum}  (Optional) Audio API from OS to use. E.g. "pulse" (PulseAudio), "alsa" (Linux), or "coreaudio" (Mac)
  global {
    ...
  }
  input {   How to record from the sound card
    type {string enum} "wav" or "raw" -- "wav" = Wave file (the other input parameters are then unnecessary)
    channels {integer} 1 = mono, 2 = stereo, ...
    bits {integer}  Sesolution per sample. 8, 16 (normal), 24 (hifi), or 32
    rate {integer} Sample rate, e.g. 8000 (phone), 16000 (speech), 44100 (CD), 48000 (music quality), 96000 (hifi)
    encoding {string enum} "signed-integer", "unsigned-integer", or "float"
  }
  output {   Which format you want to receive the audio in
    type {string enum} "wav" or "raw"
    channels {integer} 1 = mono, 2 = stereo, ...
    bits {integer}  Resolution per sample. 8, 16 (normal), 24 (hifi), or 32
    rate {integer} Sample rate, e.g. 8000 (phone), 16000 (speech), 44100 (CD), 48000 (music quality), 96000 (hifi)
    encoding {string enum} "signed-integer", "unsigned-integer", or "float"
  }
}
```

* Returns {object}  TODO return a `TransformStream`
```
{
  inputWritableStream {ReadableStream}  Write data to this stream, in the format defined by `soxOptions.input`
  outputReadableStream {ReadableStream} Contains audio data, in the format defined by `soxOptions.input` and `soxOptions.output`
}
```
