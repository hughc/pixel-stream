# Pixel Stream
This is simple client server to supply images to matrices of different sizes.

![screen](/images/screen-large.jpg)

## Hardware requirements
The hardware consists of 3 parts:

 - an LED matrix, either off-the-shelf or handmade using LED strips joined together to form a grid (WS2812, WS2815 etc)
 - a wifi enabled microcontroller (ESP8266, such as Wemos D1 mini)
 - a server, either on your LAN or accessible over the internet

Other components include a push button wired to the microcontroller to trigger a configuration portal, and a buck transformer to run the microcontroller if the strip runs at 12V (the ESP8266 runs at 5V).

To generate a clean matrix with square pixels, you need a diffuser screen. [This design](https://www.thingiverse.com/thing:4973163) can be used to 3D print arbitrary sized diffusers. 

## Software
The software consists of 3 parts:

 - client firmware, which requests images and uses the FastLED sets pixel RGB values (client-wifi-portal/src/client-wifi-portal.ino). This can be flashed using the platform.io VSCode extension.
 - the server process which decodes images (jpg, gif, png) to raw pixel values and sends them to the client (server)
 - a React admin app, to manage image upload, client configuration for multiple clients, and playlist curation (admin/src/App.js)


 ## firmware
 The firmware leverages the [FastLED](https://github.com/FastLED/FastLED) and [ESP2866 WifiManager](https://github.com/tzapu/WiFiManager) libraries. It requests images over http from the server component, and is returned some metadata such as brightness, the interval before the next image will be requested, and then a series of RGB values, corresponding to the size of the matrix. It listens for a button press on a defined pin at startup, and if detected launches a wifi configuration portal that allows the configuration of a 0connection to an existing wifi network as well as setting the address of the server to connect to. 


 Before compiling the client firmware, there are a couple of parameters you will likely want to change.
 
 - the LED type, a constant as defined in the FastLED library
 - the number of LEDs in the matrix (required to define the FastLED array)
 - a unique identifier for the client (used when making requests)

 Other potential configuration options are the digital pin assignments used to control the strip, and the button to trigger the configuration mode.

 ## server

 ## admin interface