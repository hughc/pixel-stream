#include "ExampleParser.h"
#include "JsonListener.h"

int pixelValues[3072];

uint16_t count = 0;

void ExampleListener::whitespace(char c) {
  Serial.println("whitespace");
}

void ExampleListener::startDocument() {
  Serial.println("start document");
}

void ExampleListener::key(String key) {
  Serial.println("key: " + key);
}

void ExampleListener::value(String value) {
  Serial.print("value: " );
  Serial.println(atoi(value.c_str()));

  pixelValues[count] = atoi(value.c_str());
  count++;
}

void ExampleListener::endArray() {
  Serial.println("end array. ");
}

void ExampleListener::endObject() {
  Serial.println("end object. ");
}

void ExampleListener::endDocument() {
  Serial.println("end document. ");
}

void ExampleListener::startArray() {
   Serial.println("start array. ");
}

void ExampleListener::startObject() {
   Serial.println("start object. ");
}
