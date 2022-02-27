# Pixel Stream
This is simple client server to supply images to matrices of different sizes. The hardware consists of 3 parts:

 - an LED matrix, either off-the-shelf or handmade using LED strips joined together to form a grid (WS2812, WS2815 etc)
 - a wifi enable microcontroller (ESP8266, such as Wemos D1 mini)
 - a server, either on your LAN or accessible over the internet


Software consists of 3 parts:

 - client firmware, which requests images and sets pixel RGB values
 - the server process which decodes images (jpg, gif, png) to raw pixel values and sends them to the client
 - an admin app, written in React to manage image upload, client configuration for multiple clients, and playlist curation