 #include "SPI.h"
#include "TFT_eSPI.h"
#include <qrcode_espi.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

TFT_eSPI tft = TFT_eSPI();
QRcode_eSPI qrcode(&tft);

const char* ssid = "iPhone";
const char* password = "31415926pi";
const char* cardSSID = "4F:2F:5F:2F";
WiFiClientSecure client;
HTTPClient http;

String lastPayload = "";

unsigned long lastRequest = 0;
const unsigned long interval = 5000;

void setup() {
  Serial.begin(115200);

  tft.begin();
  tft.setRotation(1);
  tft.fillScreen(TFT_WHITE);
  qrcode.init();

  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConnected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  qrcode.create("https://www.youtube.com");

  client.setInsecure();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi lost. Reconnecting...");
    WiFi.begin(ssid, password);
    delay(1000);
    return;
  }



  if (millis() - lastRequest >= interval) {
    lastRequest = millis();

    // nfc scanner gives cardSSID

    // call to get the qr
    // give - card id
    String url = "https://backend-h6j3.onrender.com/api/v1/scan-card/";
    url += cardSSID; 


    // get all events happening at x time
    // probably call a backend api to check the time or smt cause we
    // dont have a clock module
    url += "?eventId=1"; // hardcoded for now

    http.begin(client, url);
    int httpCode = http.GET();

    if (httpCode == 200) {
      String payload = http.getString();
      tft.drawString(payload, 40, 120);

      if (payload.startsWith("WELCOME_")) {
        String name = payload.substring(8);
        tft.fillScreen(TFT_GREEN);
        tft.setTextColor(TFT_BLACK);
        tft.setTextSize(2);
        tft.drawString("HI, " + name, 40, 100);
        tft.drawString("ACCESS GRANTED", 40, 140);
        delay(5000); 
        tft.fillScreen(TFT_WHITE); 
      } else if (payload == "STATUS_OK") {
        tft.fillScreen(TFT_BLACK);  
        tft.drawString("WELCOME BACK!", 40, 120);
      } else if (payload == "INVALID_CARD_ID") {
        tft.fillScreen(TFT_RED);
        tft.drawString("SCAN ERROR", 40, 120);
      } else {
        // Assume payload is the Registration URL
        tft.fillScreen(TFT_WHITE);
        qrcode.create(payload);
      }
    }

    http.end();
  }

  delay(1); 
}