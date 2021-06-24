/*
  ESP8266 mDNS responder sample

  This is an example of an HTTP server that is accessible
  via http://esp8266.local URL thanks to mDNS responder.

  Instructions:
  - Update WiFi SSID and password as necessary.
  - Flash the sketch to the ESP8266 board
  - Install host software:
    - For Linux, install Avahi (http://avahi.org/).
    - For Windows, install Bonjour (http://www.apple.com/support/bonjour/).
    - For Mac OSX and iOS support is built in through Bonjour already.
  - Point your browser to http://esp8266.local, you should see a response.

*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "FastLED.h"

FASTLED_USING_NAMESPACE

// FastLED "100-lines-of-code" demo reel, showing just a few
// of the kinds of animation patterns you can quickly and easily
// compose using FastLED.
//
// This example also shows one easy way to define multiple
// animations patterns and have them automatically rotate.
//
// -Mark Kriegsman, December 2014

#if defined(FASTLED_VERSION) && (FASTLED_VERSION < 3001000)
#warning "Requires FastLED 3.1 or later; check github for latest code."
#endif

#ifndef STASSID
#define STASSID "HC-RR-N"
#define STAPSK "r0sc0E99"
#endif

#define DATA_PIN D3

//#define CLK_PIN   4
#define LED_TYPE WS2811
#define COLOR_ORDER GRB
#define SQUARE_SIZE "32"
#define NUM_LEDS 1024

CRGB leds[NUM_LEDS];

#define BRIGHTNESS 100

#define FRAMES_PER_SECOND 60

String jsonURL = "http://192.168.0.35:3000/image";
//strcat(jsonURL, SQUARE_SIZE);

const char *ssid = STASSID;
const char *password = STAPSK;

HTTPClient http;

uint8_t RGBValues[NUM_LEDS * 3]; // string array to store the result

void getImage()
{

  // Send request
  // http.begin(jsonURL);
  // http.GET();

  String serverPath = jsonURL + "?size=" + SQUARE_SIZE;

  Serial.print("serverPath: ");
  Serial.println(serverPath);
  // Your Domain name with URL path or IP address with path
  http.begin(serverPath.c_str());

  // Send HTTP GET request
  int httpResponseCode = http.GET();
  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
  String payload = http.getString();
  //   Serial.println(payload);

  // Free resources
  http.end();

  // Serial.print("total stream length: ");
  // Serial.println(payload.length());

  // Serial.println("remaining heap: ");
  // Serial.println(ESP.getFreeHeap(), DEC);
  //return;
  char *cstr = new char[payload.length() + 1];
  strcpy(cstr, payload.c_str());

  uint16_t foundValues = 0; // declaring i and assign  to 0
  char *pt;
  pt = strtok(cstr, ",");
  while (pt != NULL)
  {
    int a = atoi(pt);
    //   printf("%d: %d\n", i, a);
    RGBValues[foundValues] = (uint8_t)a;
    foundValues++;
    pt = strtok(NULL, ",");
  }

  delete cstr;

  Serial.print("stream parsed, found values: ");
  Serial.println(foundValues);
  Serial.print("remaining heap: ");
  Serial.println(ESP.getFreeHeap(), DEC);

  uint8_t red;
  uint8_t green;
  uint8_t blue;

  for (int whichRGB = 0; whichRGB < foundValues - 1; whichRGB++)
  {
    if (whichRGB % 3 == 0)
    {

    //  Serial.println(ESP.getFreeHeap(), DEC);

      red = RGBValues[whichRGB];
      green = RGBValues[whichRGB + 1];
      blue = RGBValues[whichRGB + 2];

      
    Serial.print(whichRGB);
    Serial.print(": ");
    Serial.print(red);
    Serial.print(",");
    Serial.print(green);
    Serial.print(",");
    Serial.println(blue);
    
      leds[whichRGB / 3] = CRGB(red, green, blue);
    }
  }
  Serial.println("done setting ");
  Serial.println("------------");
  Serial.println("");
  FastLED.show();
}

void setup(void)
{
  Serial.begin(115200);

  // tell FastLED about the LED strip configuration
  FastLED.addLeds<LED_TYPE, DATA_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  // FastLED.addLeds<LED_TYPE, DATA_PIN,CLK_PIN,COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);

  // set master brightness control
    FastLED.setBrightness(BRIGHTNESS);

  
  fill_solid(leds, NUM_LEDS, CRGB::Red);
  //  fill_solid(blocks, , CRGB::Black);
  FastLED.show();
    
  // Connect to WiFi network
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);

		fill_solid(leds, NUM_LEDS, CRGB::Yellow);
		//  fill_solid(blocks, , CRGB::Black);
		FastLED.show();
		Serial.print(">");
  }

  // allow reuse (if server supports it)
  http.setReuse(true);

	fill_solid(leds, NUM_LEDS, CRGB::Green);
	//  fill_solid(blocks, , CRGB::Black);
	FastLED.show();

	Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  getImage();
}

void loop(void)
{
  EVERY_N_SECONDS(2)
  {
 //  Serial.println("-- main loop 2 --");
 //   FastLED.show();
  }
  EVERY_N_SECONDS(10)
  {
    getImage();
//    Serial.println("-- main loop --");
    //  getImage();

//    Serial.print("remaining heap: ");
//    Serial.println(ESP.getFreeHeap(), DEC);
  }
}
