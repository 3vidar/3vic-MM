/* MagicMirror Module: MMM-Motion-Camera */
Module.register("MMM-Motion-Camera", {
  defaults: {
    timeout: 30, // Zeit in Sekunden bis der Bildschirm ausgeschaltet wird
  },

  start: function () {
    this.motionDetected = false;
    this.screenIsOn = true;
    this.sendSocketNotification("START_MOTION_DETECTION", this.config);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "MOTION_DETECTED") {
    this.motionDetected = true;
    if (!this.screenIsOn) {
      const exec = require('child_process').exec;
      exec('caffeinate -u -t 1', (err) => {
        if (err) {
          console.error('Fehler beim Einschalten des Bildschirms:', err);
        } else {
          this.sendNotification("SCREEN_WAKEUP");
          console.log("Bildschirm eingeschaltet wegen Bewegung");
        }
      });
        this.sendNotification("SCREEN_WAKEUP");
          console.log("Bildschirm eingeschaltet wegen Bewegung");
          this.screenIsOn = true;
      }
      console.log("Bewegung erkannt");
    } else if (notification === "NO_MOTION_DETECTED") {
      this.motionDetected = false;
      console.log("Keine Bewegung erkannt");
      setTimeout(() => {
        if (!this.motionDetected && this.screenIsOn) {
          console.log('Bildschirm wird ausgeschaltet');
          console.log("Bildschirm ausschalten");
          this.screenIsOn = false;
          this.sendSocketNotification("START_MOTION_DETECTION", this.config); // Erneutes Starten der Bewegungserkennung nach dem Ausschalten des Bildschirms
        }
      }, this.config.timeout * 1000);
    }
  }
});
