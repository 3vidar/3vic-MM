Module.register("MMM-Motion-Camera", {
  defaults: {
      inactivityTimeout: 30 // Sekunden
  },

  start: function() {
      Log.info("Starting module: " + this.name);
      this.screenOn = true;
      this.sendSocketNotification("INIT_MOTION_DETECTION", this.config.inactivityTimeout);
  },

  socketNotificationReceived: function(notification, payload) {
      if (notification === "SCREEN_ON") {
          this.show();
          this.screenOn = true;
      } else if (notification === "SCREEN_OFF") {
          this.hide();
          this.screenOn = false;
      }
  }
});

