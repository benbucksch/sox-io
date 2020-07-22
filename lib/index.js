'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.soxIO = soxIO;
exports.soxPlay = soxPlay;
exports.soxRecord = soxRecord;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _hashToArray = require('hash-to-array');

var _hashToArray2 = _interopRequireDefault(_hashToArray);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param soxOptions {
 *   play {boolean} send to loudspeakers
 *   record {boolean} record from microphone
 *   device {string}  audio hardware device to use. E.g. "hw:1,0"
 *   driver {string enum}  audio API from OS to use. E.g. "pulse" (PulseAudio), "alsa" (Linux), or "coreaudio" (Mac)
 *   global {
 *     ...
 *   }
 *   input {
 *     type {string} "wav" or "raw"
 *     channels {integer} 1 = mono, 2 = stereo, ...
 *     bits {integer}  resolution per sample. 8, 16 (normal), 24 (hifi), or 32
 *     rate {integer} sample rate, e.g. 8000 (phone), 16000 (speech), 44100 (CD), 48000 (music quality), 96000 (hifi)
 *     encoding {string enum} "signed-integer", "unsigned-integer", or "float"
 *   }
 *   output {
 *     ... like input
 *   }
 * } The options in global, input and output match sox commandline, @see man sox
 */
function soxIO() {
  var soxOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (soxOptions.record && soxOptions.play) {
    throw new Error("Choose one of play or record or transform");
  }
  var args = ['-q'] // quiet
  // order matters
  .concat((0, _hashToArray2.default)(soxOptions.global || {})).concat(['--buffer', '32']).concat((0, _hashToArray2.default)(soxOptions.input || {})).concat(soxOptions.record ? ['-d'] : ['-']).concat((0, _hashToArray2.default)(soxOptions.output || {})).concat(soxOptions.play ? ['-d'] : ['-']);
  var spawnOptions = {
    env: _extends({}, process.env),
    stdio: [soxOptions.record ? 'ignore' : 'pipe', soxOptions.play ? 'ignore' : 'pipe', 'inherit'],
    encoding: 'binary'
  };
  // TODO use "-t drive devicename", e.g. "-t pulseaudio default"?
  // <http://manpages.ubuntu.com/manpages/bionic/man7/soxformat.7.html>
  if (soxOptions.device) {
    if (!soxOptions.driver) {
      if (_os2.default.platform() == "darwin") {
        soxOptions.driver = "coreaudio";
      } else if (_os2.default.platform() == "linux") {
        soxOptions.driver = "alsa"; // TODO pulse?
      } else {
        soxOptions.driver = "pulse";
      }
    }
    spawnOptions.env.AUDIODEV = soxOptions.device;
    spawnOptions.env.AUDIODRIVER = soxOptions.driver;
  }
  console.info("Running sox", args.join(" "), "with", spawnOptions.env.AUDIODRIVER, "device", spawnOptions.env.AUDIODEV || "(default)");
  var sox = _child_process2.default.spawn(soxOptions.soxPath || 'sox', args, spawnOptions);
  return { inputWritableStream: sox.stdin, outputReadableStream: sox.stdout };
}

/**
 * Plays audio to the speakers.
 * @param soxOptions @see soxIO()
 * @returns {WritableStream}
 *   Write data in the format defined by `soxOptions.input`
 */
function soxPlay(soxOptions, audioStream) {
  soxOptions.play = true;
  return soxIO(soxOptions).inputWritableStream;
}

/**
 * Records audio from the microphone or aux in.
 * @param soxOptions @see soxIO()
 * @returns {ReadableStream}
 *   Contains data in the format defined by `soxOptions.input`
 *   or `soxOptions.output`
 *   (use `soxOptions.input` where allowed by the hardware device,
 *   otherwise `soxOptions.output`, which will convert it in software.)
 */
function soxRecord(soxOptions) {
  soxOptions.record = true;
  return soxIO(soxOptions).outputReadableStream;
}