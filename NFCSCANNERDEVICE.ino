#include <Wire.h>
#include <SPI.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <TFT_eSPI.h>
#include <XPT2046_Touchscreen.h>
#include <qrcode_espi.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

// ======================= PINS & CONFIGURATION =======================

// --- WIFI SETTINGS ---
const char* ssid = "iPhone";
const char* password = "31415926pi";

// --- PINS ---
#define TFT_BL 14          // Backlight
#define PASSIVE_BUZZER 19  // Buzzer
#define NFC_SDA 21         // NFC Data
#define NFC_SCL 22         // NFC Clock

// --- TOUCH PINS (VSPI) ---
#define XPT2046_IRQ 27   
#define XPT2046_MOSI 32
#define XPT2046_MISO 39
#define XPT2046_CLK 25
#define XPT2046_CS 33

// ======================= OBJECTS =======================

PN532_I2C pn532i2c(Wire);
PN532 nfc(pn532i2c);

SPIClass touchscreenSPI = SPIClass(VSPI);
XPT2046_Touchscreen touchscreen(XPT2046_CS, XPT2046_IRQ);
TFT_eSPI tft = TFT_eSPI(); 
QRcode_eSPI qrcode(&tft);

WiFiClientSecure client;
HTTPClient http;

TFT_eSPI_Button btnAction; 

// ======================= COLORS =======================
uint16_t C_PRIMARY; 

#define C_BG      0x10A2  // Dark Slate
#define C_CARD    0x2124  // Lighter Slate
#define C_SUCCESS 0x0566  // Emerald Green
#define C_ERROR   0xD104  // Crimson Red
#define C_TEXT    0xFFFF  // White
#define C_SUBTEXT 0xBDF7  // Light Grey

// --- CALIBRATION ---
float TLx = 3800; float TLy = 3800; 
float TRx = 200;  float TRy = 3800;
float BLx = 3800; float BLy = 200; 

float alpha_x, beta_x, delta_x;
float alpha_y, beta_y, delta_y;

// --- STATE MACHINE ---
enum AppState {
  STATE_IDLE,
  STATE_PROCESSING,
  STATE_RESULT_SHOW,
  STATE_UNREGISTERED,
  STATE_SHOWING_QR
};

// --- AUDIO TYPES ---
enum ToneType {
  TONE_SUCCESS,      // Happy ascending beep
  TONE_ACCESS_DENIED,// Sharp "Access Denied" beep
  TONE_NETWORK_ERR,  // Low "Sad" buzz
  TONE_ATTENTION     // Neutral ping for new user
};

AppState currentState = STATE_IDLE;
unsigned long resultTimer = 0; 
String qrPayload = "";         

// ======================= SETUP FUNCTIONS =======================

void calculateCalibrationMatrix() {
  float det = (TLx - BLx) * (TRy - BLy) - (TRx - BLx) * (TLy - BLy);
  if (det == 0) return;

  float A = 0 - 0;   float B = 320 - 0; 
  alpha_x = (A * (TRy - BLy) - B * (TLy - BLy)) / det;
  beta_x  = (B * (TLx - BLx) - A * (TRx - BLx)) / det;
  delta_x = 0 - alpha_x * BLx - beta_x * BLy;

  float C = 0 - 240; float D = 0 - 240; 
  alpha_y = (C * (TRy - BLy) - D * (TLy - BLy)) / det;
  beta_y  = (D * (TLx - BLx) - C * (TRx - BLx)) / det;
  delta_y = 240 - alpha_y * BLx - beta_y * BLy; 
}

TS_Point getSmoothedPoint() {
  long sumX = 0, sumY = 0, sumZ = 0;
  int samples = 0;
  for (int i = 0; i < 5; i++) {
    if (touchscreen.touched()) {
      TS_Point p = touchscreen.getPoint();
      sumX += p.x; sumY += p.y; sumZ += p.z;
      samples++;
    }
  }
  if (samples == 0) return TS_Point(0, 0, 0);
  return TS_Point(sumX/samples, sumY/samples, sumZ/samples);
}

// *** UPDATED AUDIO FUNCTION ***
void playTone(ToneType type) {
  switch (type) {
    case TONE_SUCCESS:
      // High, ascending (Happy)
      tone(PASSIVE_BUZZER, 2000, 100); delay(120);
      tone(PASSIVE_BUZZER, 3000, 100); delay(120);
      break;

    case TONE_ACCESS_DENIED:
      // Sharp, mid-tone double beep (Strict)
      tone(PASSIVE_BUZZER, 800, 150); delay(200);
      tone(PASSIVE_BUZZER, 800, 150); delay(150);
      break;

    case TONE_NETWORK_ERR:
      // Low, descending or flat buzz (Sad)
      tone(PASSIVE_BUZZER, 200, 400); delay(450);
      tone(PASSIVE_BUZZER, 150, 400); delay(450);
      break;
      
    case TONE_ATTENTION:
      // Single ping (Neutral)
      tone(PASSIVE_BUZZER, 1500, 200); delay(250);
      break;
  }
  noTone(PASSIVE_BUZZER);
}

// ======================= MODERN UI DRAWING =======================

void drawHeader(String title) {
  tft.fillRoundRect(0, 0, 320, 50, 0, C_PRIMARY); 
  tft.fillRect(0, 0, 320, 25, C_PRIMARY);         
  
  tft.setTextColor(C_TEXT, C_PRIMARY);
  tft.setTextDatum(MC_DATUM);                     
  tft.setTextFont(4);                             
  tft.drawString(title, 160, 25);
}

void drawCard(int x, int y, int w, int h) {
  // Shadow
  tft.fillRoundRect(x + 4, y + 4, w, h, 15, 0x0000); 
  // Main Card
  tft.fillRoundRect(x, y, w, h, 15, C_CARD);
  // Border
  tft.drawRoundRect(x, y, w, h, 15, C_PRIMARY);
}

// ======================= SCREENS =======================

void drawIdleScreen() {
  tft.fillScreen(C_BG);
  drawHeader("ADORIO");
  
  drawCard(40, 70, 240, 140);
  
  tft.fillCircle(160, 105, 28, C_PRIMARY);
  tft.setTextColor(C_TEXT, C_PRIMARY);
  tft.setTextFont(2);
  tft.setTextDatum(MC_DATUM);
  tft.drawString("NFC", 160, 105);

  tft.setTextColor(C_TEXT, C_CARD);
  tft.setTextFont(4); 
  tft.drawString("Ready to Scan", 160, 150);
  
  tft.setTextColor(C_SUBTEXT, C_CARD);
  tft.setTextFont(2); 
  tft.drawString("Tap card to check-in", 160, 180);
}

void drawProcessingScreen() {
  tft.fillScreen(C_BG);
  
  tft.drawCircle(160, 120, 40, C_PRIMARY);
  tft.drawCircle(160, 120, 35, C_PRIMARY);
  
  tft.setTextColor(C_TEXT, C_BG);
  tft.setTextDatum(MC_DATUM);
  tft.setTextFont(4);
  tft.drawString("Processing...", 160, 120);
}

void drawWelcomeScreen(String name) {
  tft.fillScreen(C_SUCCESS); 
  
  tft.fillCircle(160, 70, 35, C_TEXT);
  tft.setTextColor(C_SUCCESS, C_TEXT);
  tft.setTextFont(4);
  tft.setTextDatum(MC_DATUM);
  tft.drawString("OK", 160, 72);
  
  tft.setTextColor(C_TEXT, C_SUCCESS);
  tft.setTextFont(4);
  tft.drawString("ACCESS GRANTED", 160, 130);
  
  tft.setTextFont(4);
  tft.drawString(name, 160, 170);
}

void drawErrorScreen(String msg) {
  tft.fillScreen(C_ERROR); 
  
  tft.setTextColor(C_TEXT, C_ERROR);
  tft.setTextDatum(MC_DATUM);
  tft.setTextFont(4);
  tft.drawString("ERROR", 160, 80);
  
  tft.fillRoundRect(30, 110, 260, 80, 10, C_TEXT);
  tft.setTextColor(C_ERROR, C_TEXT);
  tft.setTextFont(2);
  tft.drawString(msg, 160, 150);
}

void drawUnregisteredScreen() {
  tft.fillScreen(C_BG);
  drawHeader("UNKNOWN CARD");
  
  tft.setTextColor(C_TEXT, C_BG);
  tft.setTextDatum(MC_DATUM);
  tft.setTextFont(4);
  tft.drawString("New User Detected", 160, 80);
  
  tft.setTextColor(C_SUBTEXT, C_BG);
  tft.setTextFont(2);
  tft.drawString("This card is not in the system.", 160, 110);
  tft.drawString("Tap below to register.", 160, 130);

  btnAction.initButton(&tft, 160, 185, 200, 50, C_PRIMARY, C_PRIMARY, C_TEXT, "Show QR", 1);
  btnAction.drawButton(false);
}

void drawQRScreen() {
  tft.fillScreen(C_TEXT); 
  
  tft.setTextColor(C_BG, C_TEXT);
  tft.setTextDatum(MC_DATUM);
  tft.setTextFont(4);
  tft.drawString("Scan to Register", 160, 30);
  
  qrcode.create(qrPayload); 
  
  tft.fillRoundRect(80, 210, 160, 25, 12, C_CARD);
  tft.setTextColor(C_TEXT, C_CARD);
  tft.setTextFont(2);
  tft.setTextDatum(MC_DATUM);
  tft.drawString("Tap to Close", 160, 223);
}

// ======================= SETUP =======================
void setup() {
  Serial.begin(115200);
  Serial.println("\n\n--- ADORIO SYSTEM BOOTING ---");

  pinMode(PASSIVE_BUZZER, OUTPUT);
  pinMode(TFT_BL, OUTPUT);
  digitalWrite(TFT_BL, HIGH);

  // 1. HARDWARE INIT
  Wire.begin(NFC_SDA, NFC_SCL);
  
  touchscreenSPI.begin(XPT2046_CLK, XPT2046_MISO, XPT2046_MOSI, XPT2046_CS);
  touchscreen.begin(touchscreenSPI);
  touchscreen.setRotation(1);

  tft.init();
  tft.setRotation(3);
  
  // Color Fix & Inversion
  C_PRIMARY = tft.color565(27, 179, 169); 
  tft.invertDisplay(true); 
  
  qrcode.init();
  calculateCalibrationMatrix();

  // 2. WIFI INIT
  tft.fillScreen(C_BG);
  tft.setTextColor(C_TEXT, C_BG);
  tft.setTextDatum(MC_DATUM);
  tft.setTextFont(2);
  
  tft.drawCircle(160, 120, 30, C_PRIMARY);
  tft.drawString("Connecting WiFi...", 160, 120);

  Serial.print("[WIFI] Connecting to "); Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\n[WIFI] Connected! IP: " + WiFi.localIP().toString());

  // 3. NFC INIT
  nfc.begin();
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("[NFC] ERROR: Reader not found!");
    drawErrorScreen("NFC Reader Missing!");
    playTone(TONE_NETWORK_ERR); // Play sad sound if hardware fails
    while(1);
  }
  Serial.print("[NFC] Found Chip PN5"); Serial.println((versiondata>>24) & 0xFF, HEX);
  
  nfc.setPassiveActivationRetries(0x02); 
  nfc.SAMConfig();
  client.setInsecure();

  // 4. START
  Serial.println("[SYSTEM] Ready.");
  playTone(TONE_SUCCESS);
  currentState = STATE_IDLE;
  drawIdleScreen();
}

// ======================= LOOP =======================
void loop() {
  bool pressed = false;
  int tx = 0, ty = 0;

  if (touchscreen.tirqTouched() && touchscreen.touched()) {
    TS_Point p = getSmoothedPoint();
    if (p.z > 600) {
      pressed = true;
      float calc_x = (alpha_x * p.x) + (beta_x * p.y) + delta_x;
      float calc_y = (alpha_y * p.x) + (beta_y * p.y) + delta_y;
      tx = (int)calc_x;
      ty = (int)calc_y;
      if(tx<0) tx=0; if(tx>320) tx=320;
      if(ty<0) ty=0; if(ty>240) ty=240;
    }
  }

  switch (currentState) {
    
    // ---------------- IDLE STATE ----------------
    case STATE_IDLE:
      {
        uint8_t uid[] = {0,0,0,0,0,0,0};
        uint8_t uidLength;
        if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, &uid[0], &uidLength)) {
          
          playTone(TONE_ATTENTION); // Small ping on detect
          currentState = STATE_PROCESSING;
          drawProcessingScreen();

          String cardID = "";
          for (uint8_t i = 0; i < uidLength; i++) {
            if (uid[i] < 0x10) cardID += "0";
            cardID += String(uid[i], HEX);
            if (i < uidLength - 1) cardID += ":";
          }
          cardID.toUpperCase();

          Serial.println("--------------------------------");
          Serial.print("[CARD] Detected! UID: "); Serial.println(cardID);

          String url = "https://backend-h6j3.onrender.com/api/v1/scan-card/" + cardID + "?eventId=1";
          Serial.print("[HTTP] Requesting: "); Serial.println(url);
          
          http.begin(client, url);
          int httpCode = http.GET();
          Serial.print("[HTTP] Response Code: "); Serial.println(httpCode);

          if (httpCode == 200) {
            String payload = http.getString();
            Serial.print("[HTTP] Payload: "); Serial.println(payload);
            
            if (payload.startsWith("WELCOME_")) {
              String userName = payload.substring(11);
              Serial.println("[STATUS] Access Granted: " + userName);
              drawWelcomeScreen(userName);
              playTone(TONE_SUCCESS); // <--- HAPPY SOUND
              currentState = STATE_RESULT_SHOW;
              resultTimer = millis();

            } else if (payload == "STATUS_OK") {
               Serial.println("[STATUS] Access Granted (Returning User)");
               drawWelcomeScreen("Welcome Back!");
               playTone(TONE_SUCCESS); // <--- HAPPY SOUND
               currentState = STATE_RESULT_SHOW;
               resultTimer = millis();

            } else if (payload.startsWith("ALREADY_")) {
               String userName = payload.substring(11);
               if(userName.length() == 0) userName = "Checked In";
               Serial.println("[STATUS] Already Registered: " + userName);
               drawWelcomeScreen(userName);
               playTone(TONE_SUCCESS); // <--- HAPPY SOUND
               currentState = STATE_RESULT_SHOW;
               resultTimer = millis();

            } else if (payload == "INVALID_CARD_ID") {
               Serial.println("[STATUS] Card Invalid/Unknown");
               drawErrorScreen("Card Invalid");
               playTone(TONE_ACCESS_DENIED); // <--- ACCESS DENIED SOUND
               currentState = STATE_RESULT_SHOW;
               resultTimer = millis();

            } else {
               Serial.println("[STATUS] New Card - Prompting Registration");
               playTone(TONE_ATTENTION); // <--- NEUTRAL/ATTENTION SOUND
               qrPayload = payload; 
               currentState = STATE_UNREGISTERED;
               drawUnregisteredScreen();
            }
          } else {
            Serial.print("[HTTP] Error! Code: "); Serial.println(httpCode);
            
            // Check specific network errors
            if(httpCode == -11 || httpCode == 500){
               drawErrorScreen("our server is asleep zzz. Wait 2 min pls");
               playTone(TONE_NETWORK_ERR); // <--- SAD/NETWORK SOUND
               currentState = STATE_RESULT_SHOW;
               resultTimer = millis();
            } else {
               drawErrorScreen("Error: " + String(httpCode));
               playTone(TONE_NETWORK_ERR); // <--- SAD/NETWORK SOUND
               currentState = STATE_RESULT_SHOW;
               resultTimer = millis();
            }
          }
          http.end();
          Serial.println("--------------------------------");
        }
      }
      break;

    // ---------------- SHOWING RESULT ----------------
    case STATE_RESULT_SHOW:
      if (millis() - resultTimer > 3000) {
        Serial.println("[UI] Returning to Idle...");
        currentState = STATE_IDLE;
        drawIdleScreen();
      }
      break;

    // ---------------- UNREGISTERED ----------------
    case STATE_UNREGISTERED:
      if (pressed && btnAction.contains(tx, ty)) btnAction.press(true);
      else btnAction.press(false);

      if (btnAction.justPressed()) {
        Serial.println("[UI] Button Pressed: Showing QR");
        btnAction.drawButton(true);
      }
      if (btnAction.justReleased()) {
        btnAction.drawButton(false);
        currentState = STATE_SHOWING_QR;
        drawQRScreen();
        delay(500); 
      }
      break;

    // ---------------- SHOWING QR ----------------
    case STATE_SHOWING_QR:
      if (pressed) {
        Serial.println("[UI] Screen Tapped: Closing QR");
        currentState = STATE_IDLE;
        drawIdleScreen();
        delay(500); 
      }
      break;
      
    default:
      break;
  }
}