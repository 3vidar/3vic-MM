// NodeHelper: node_helper.js
const NodeHelper = require('node_helper');
const PythonShell = require('python-shell');

module.exports = NodeHelper.create({
  start: function () {
    this.started = false;
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "START_MOTION_DETECTION") {
      this.config = payload;
      this.startMotionDetection();
    }
  },

  startMotionDetection: function () {
    const pythonOptions = {
      mode: 'text',
      pythonOptions: ['-u'],
      scriptPath: 'modules/MMM-Motion-Camera',
      args: [this.config.timeout]
    };

    if (this.pythonShell) {
      this.pythonShell.end((err) => {
        if (err) console.error('Fehler beim Stoppen des Python-Skripts:', err);
      });
    }

    this.pythonShell = new PythonShell.PythonShell('motion_detection.py', pythonOptions);

    this.pythonShell.on('message', (message) => {
      if (message === 'MOTION_DETECTED') {
        this.sendSocketNotification('MOTION_DETECTED');
      } else if (message === 'NO_MOTION_DETECTED') {
        this.sendSocketNotification('NO_MOTION_DETECTED');
      }
    });

    this.pythonShell.on('error', (err) => {
      console.error('Fehler beim Ausführen des Motion-Skripts:', err);
    });

    this.pythonShell.on('close', () => {
      console.log('Python-Skript beendet, Bewegungserkennung wird neu gestartet');
      this.startMotionDetection();
    });
  },

  stop: function () {
    if (this.pythonShell) {
      this.pythonShell.end((err) => {
        if (err) console.error('Fehler beim Stoppen des Python-Skripts:', err);
      });
    }
  }
});
