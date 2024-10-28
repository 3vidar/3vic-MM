# MMM-Motion-Camera

This is a module for the MagicMirror² that turns the monitor on or off based on motion detected by a USB camera.

## Features

With this module, you can use a USB camera to track motion. If no motion is detected, the display will turn off after a set time. If motion is detected, the display will turn on.

 I have unfortunately not been able to get this module to work properly. It initializes the camera, detects motion, and turns off the monitor after 30 seconds of inactivity (no motion). However, my problem is that the screen turning off and only turn on for a few seconds wenn motion is detected. If the monitor stays off for more than 20-30 seconds, no further motion is detected, and the monitor does not turn back on. If anyone has the time to support me, I would be very grateful.

## Using the Module

To use this module, follow these steps:

1. Clone this repository to the `modules` folder of your MagicMirror:

   ```sh
   git clone https://github.com/3vidar/3vic-MM.git
   ```

2. Add the following configuration block to the `modules` array in the `config/config.js` file to control the visibility of the built-in Clock and Calendar modules:

   ```javascript
   var config = {
     modules: [
       {
         module: "MMM-Motion-Camera",
         config: {
           timeout: 30 // Time in seconds before the screen turns off
         }
       }
     ]
   }
   ```

