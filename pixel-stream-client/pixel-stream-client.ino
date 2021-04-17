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
#include <ESP8266mDNS.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

  
#include "JsonStreamingParser.h"
#include "JsonListener.h"
#include "ExampleParser.h"

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

char jsonURL[50] = "http://192.168.0.35:3000/image?size=4";
//strcat(jsonURL, SQUARE_SIZE);


const char *ssid = STASSID;
const char *password = STAPSK;


void getImage()
{

	HTTPClient http;

	// Send request
	http.begin(jsonURL);
	http.GET();

 JsonStreamingParser parser;
  ExampleListener listener;

  parser.setListener(&listener);

  WiFiClient& stream = http.getStream();
  int total;
  total = stream.available();

   
  Serial.print("total stream size: ");
  Serial.println(total);


  while (stream.available() > 0 ) { char jsonString = stream.read(); 
  //Serial.println(jsonString);
  // parser.parse(jsonString); 
   
  Serial.print("stream left: ");
  Serial.println(stream.available());
 }

  
  Serial.println("stream parsed");



	//	DynamicJsonDocument doc(2048);
//	const size_t capacity = JSON_ARRAY_SIZE(50);
//	DynamicJsonDocument doc(capacity);
//	deserializeJson(doc, http.getStream());
//	JsonArray outerArray = doc.as<JsonArray>();



 
	Serial.print("outerArray size: ");
	//Serial.println(listener.pixelValues[0]);

	// Read values
	//uint16_t count = 0;
	
	for (int i = 0; i < 3072; i++) {
		if (i % 3 == 0)
		{
			uint8_t red = (uint8_t)listener.pixelValues[i];
			uint8_t green = (uint8_t)listener.pixelValues[i + 1];
			uint8_t blue = (uint8_t)listener.pixelValues[i + 2];
			leds[i / 3] = CRGB(red, green, blue);

//
//			Serial.print("rgb: ");
//			Serial.print(red);
//			Serial.print(",");
//			Serial.print(green);
//			Serial.print(",");
//			Serial.println(blue);
		}
 //    Serial.print("count: ");
 //     Serial.println(count);
		//count++;
	}
     Serial.print("done, i: ");
//      Serial.println(i);
	http.end();
}

void setup(void)
{
	Serial.begin(115200);

	// tell FastLED about the LED strip configuration
	FastLED.addLeds<LED_TYPE, DATA_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
	//FastLED.addLeds<LED_TYPE,DATA_PIN,CLK_PIN,COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);

	// set master brightness control
	FastLED.setBrightness(BRIGHTNESS);

	// Connect to WiFi network
	WiFi.mode(WIFI_STA);
	WiFi.begin(ssid, password);
	Serial.println("");

	// Wait for connection
	while (WiFi.status() != WL_CONNECTED)
	{
		delay(500);
		Serial.print(".");
	}
	Serial.println("");
	Serial.print("Connected to ");
	Serial.println(ssid);
	Serial.print("IP address: ");
	Serial.println(WiFi.localIP());

	// Set up mDNS responder:
	// - first argument is the domain name, in this example
	//   the fully-qualified domain name is "esp8266.local"
	// - second argument is the IP address to advertise
	//   we send our IP address on the WiFi network
	if (!MDNS.begin("esp8266"))
	{
		Serial.println("Error setting up MDNS responder!");
		while (1)
		{
			delay(1000);
		}
	}
	Serial.println("mDNS responder started");

	getImage();
}

void loop(void)
{
	EVERY_N_SECONDS(2)
	{
	//	FastLED.show();
	}
	EVERY_N_SECONDS(10)
	{
		getImage();
	}

}
