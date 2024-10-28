const NodeHelper = require("node_helper");
const { spawn } = require("child_process");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
        this.motionDetectionProcess = null;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "INIT_MOTION_DETECTION") {
            this.startMotionDetection(payload);
        }
    },

    startMotionDetection: function(timeout) {
        if (this.motionDetectionProcess) {
            this.motionDetectionProcess.kill();
        }

        this.motionDetectionProcess = spawn("python3", ["/mnt/data/motion_detection.py", timeout]);

        this.motionDetectionProcess.stdout.on("data", (data) => {
            const message = data.toString().trim();
            if (message === "MOTION_DETECTED") {
                this.sendSocketNotification("SCREEN_ON");
            } else if (message === "NO_MOTION") {
                this.sendSocketNotification("SCREEN_OFF");
            }
        });

        this.motionDetectionProcess.on("close", (code) => {
            console.log("Motion detection process exited with code " + code);
        });
    }
});
