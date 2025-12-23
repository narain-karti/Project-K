/*
 * ESP32-CAM WiFi Streaming Firmware for Project K
 * ================================================
 * 
 * This firmware creates a video streaming server on the ESP32-CAM.
 * 
 * Endpoints:
 *   /stream  - MJPEG video stream
 *   /capture - Single JPEG frame
 *   /status  - Camera status
 * 
 * Setup:
 * 1. Change YOUR_WIFI_NAME and YOUR_WIFI_PASSWORD
 * 2. Flash using Arduino IDE
 * 3. Open Serial Monitor to see IP address
 * 
 * Board: AI Thinker ESP32-CAM
 */

#include "esp_camera.h"
#include <WiFi.h>
#include "esp_http_server.h"

// ============================================
// ⚠️ CHANGE THESE VALUES ⚠️
// ============================================
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// ============================================
// AI-Thinker ESP32-CAM Pin Configuration
// ============================================
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

// Flash LED
#define FLASH_GPIO_NUM     4

httpd_handle_t stream_httpd = NULL;
httpd_handle_t capture_httpd = NULL;

// ============================================
// MJPEG Stream Handler
// ============================================
static esp_err_t stream_handler(httpd_req_t *req) {
    camera_fb_t *fb = NULL;
    esp_err_t res = ESP_OK;
    char part_buf[128];

    res = httpd_resp_set_type(req, "multipart/x-mixed-replace; boundary=frame");
    if (res != ESP_OK) {
        return res;
    }

    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    httpd_resp_set_hdr(req, "X-Framerate", "20");

    while (true) {
        fb = esp_camera_fb_get();
        if (!fb) {
            Serial.println("Camera capture failed");
            res = ESP_FAIL;
        } else {
            size_t hlen = snprintf(part_buf, 128,
                "--frame\r\n"
                "Content-Type: image/jpeg\r\n"
                "Content-Length: %u\r\n"
                "X-Timestamp: %lu\r\n\r\n",
                fb->len, millis());

            res = httpd_resp_send_chunk(req, part_buf, hlen);
            if (res == ESP_OK) {
                res = httpd_resp_send_chunk(req, (const char *)fb->buf, fb->len);
            }
            if (res == ESP_OK) {
                res = httpd_resp_send_chunk(req, "\r\n", 2);
            }
            esp_camera_fb_return(fb);
        }
        if (res != ESP_OK) {
            Serial.println("Stream ended");
            break;
        }
        delay(33); // ~30 FPS max
    }
    return res;
}

// ============================================
// Single Frame Capture Handler
// ============================================
static esp_err_t capture_handler(httpd_req_t *req) {
    camera_fb_t *fb = esp_camera_fb_get();
    
    if (!fb) {
        Serial.println("Camera capture failed");
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }

    httpd_resp_set_type(req, "image/jpeg");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    httpd_resp_set_hdr(req, "Content-Disposition", "inline; filename=capture.jpg");
    
    esp_err_t res = httpd_resp_send(req, (const char *)fb->buf, fb->len);
    esp_camera_fb_return(fb);
    
    return res;
}

// ============================================
// Status Handler
// ============================================
static esp_err_t status_handler(httpd_req_t *req) {
    char status[256];
    snprintf(status, 256,
        "{"
        "\"status\":\"running\","
        "\"ip\":\"%s\","
        "\"rssi\":%d,"
        "\"uptime\":%lu,"
        "\"free_heap\":%u"
        "}",
        WiFi.localIP().toString().c_str(),
        WiFi.RSSI(),
        millis() / 1000,
        ESP.getFreeHeap()
    );

    httpd_resp_set_type(req, "application/json");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    httpd_resp_send(req, status, strlen(status));
    
    return ESP_OK;
}

// ============================================
// Flash LED Control Handler
// ============================================
static esp_err_t flash_handler(httpd_req_t *req) {
    char buf[10];
    if (httpd_req_get_url_query_str(req, buf, sizeof(buf)) == ESP_OK) {
        if (strstr(buf, "on")) {
            digitalWrite(FLASH_GPIO_NUM, HIGH);
        } else if (strstr(buf, "off")) {
            digitalWrite(FLASH_GPIO_NUM, LOW);
        }
    }
    
    httpd_resp_set_type(req, "text/plain");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    httpd_resp_send(req, "OK", 2);
    
    return ESP_OK;
}

// ============================================
// Start Camera Server
// ============================================
void startCameraServer() {
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();
    config.server_port = 80;
    config.ctrl_port = 32768;
    config.max_open_sockets = 4;
    config.max_uri_handlers = 8;

    // Stream endpoint
    httpd_uri_t stream_uri = {
        .uri       = "/stream",
        .method    = HTTP_GET,
        .handler   = stream_handler,
        .user_ctx  = NULL
    };

    // Capture endpoint
    httpd_uri_t capture_uri = {
        .uri       = "/capture",
        .method    = HTTP_GET,
        .handler   = capture_handler,
        .user_ctx  = NULL
    };

    // Status endpoint
    httpd_uri_t status_uri = {
        .uri       = "/status",
        .method    = HTTP_GET,
        .handler   = status_handler,
        .user_ctx  = NULL
    };

    // Flash control endpoint
    httpd_uri_t flash_uri = {
        .uri       = "/flash",
        .method    = HTTP_GET,
        .handler   = flash_handler,
        .user_ctx  = NULL
    };

    Serial.println("Starting HTTP server...");
    if (httpd_start(&stream_httpd, &config) == ESP_OK) {
        httpd_register_uri_handler(stream_httpd, &stream_uri);
        httpd_register_uri_handler(stream_httpd, &capture_uri);
        httpd_register_uri_handler(stream_httpd, &status_uri);
        httpd_register_uri_handler(stream_httpd, &flash_uri);
        Serial.println("HTTP server started successfully");
    } else {
        Serial.println("Failed to start HTTP server!");
    }
}

// ============================================
// Setup
// ============================================
void setup() {
    Serial.begin(115200);
    Serial.setDebugOutput(true);
    Serial.println();
    Serial.println("=================================");
    Serial.println("  ESP32-CAM for Project K");
    Serial.println("=================================");

    // Initialize flash LED
    pinMode(FLASH_GPIO_NUM, OUTPUT);
    digitalWrite(FLASH_GPIO_NUM, LOW);

    // Camera configuration
    camera_config_t config;
    config.ledc_channel = LEDC_CHANNEL_0;
    config.ledc_timer = LEDC_TIMER_0;
    config.pin_d0 = Y2_GPIO_NUM;
    config.pin_d1 = Y3_GPIO_NUM;
    config.pin_d2 = Y4_GPIO_NUM;
    config.pin_d3 = Y5_GPIO_NUM;
    config.pin_d4 = Y6_GPIO_NUM;
    config.pin_d5 = Y7_GPIO_NUM;
    config.pin_d6 = Y8_GPIO_NUM;
    config.pin_d7 = Y9_GPIO_NUM;
    config.pin_xclk = XCLK_GPIO_NUM;
    config.pin_pclk = PCLK_GPIO_NUM;
    config.pin_vsync = VSYNC_GPIO_NUM;
    config.pin_href = HREF_GPIO_NUM;
    config.pin_sscb_sda = SIOD_GPIO_NUM;
    config.pin_sscb_scl = SIOC_GPIO_NUM;
    config.pin_pwdn = PWDN_GPIO_NUM;
    config.pin_reset = RESET_GPIO_NUM;
    config.xclk_freq_hz = 20000000;
    config.pixel_format = PIXFORMAT_JPEG;
    
    // Frame settings for quality vs speed tradeoff
    // FRAMESIZE_QVGA (320x240) - Fast, good for detection
    // FRAMESIZE_VGA (640x480) - Balanced
    // FRAMESIZE_SVGA (800x600) - Higher quality
    config.frame_size = FRAMESIZE_VGA;
    config.jpeg_quality = 12;  // 0-63, lower = higher quality
    config.fb_count = 2;       // Double buffering
    
    // Initialize camera
    esp_err_t err = esp_camera_init(&config);
    if (err != ESP_OK) {
        Serial.printf("❌ Camera init failed with error 0x%x\n", err);
        Serial.println("Please check camera connections and restart.");
        return;
    }
    Serial.println("✅ Camera initialized successfully");

    // Adjust camera sensor settings
    sensor_t *s = esp_camera_sensor_get();
    if (s) {
        s->set_brightness(s, 0);     // -2 to 2
        s->set_contrast(s, 0);       // -2 to 2
        s->set_saturation(s, 0);     // -2 to 2
        s->set_whitebal(s, 1);       // 0 = disable, 1 = enable
        s->set_awb_gain(s, 1);       // 0 = disable, 1 = enable
        s->set_wb_mode(s, 0);        // 0-4 for different modes
        s->set_exposure_ctrl(s, 1);  // 0 = disable, 1 = enable
        s->set_aec2(s, 1);           // 0 = disable, 1 = enable
        s->set_gain_ctrl(s, 1);      // 0 = disable, 1 = enable
        s->set_agc_gain(s, 0);       // 0-30
        s->set_gainceiling(s, (gainceiling_t)6);  // 0-6
        s->set_bpc(s, 1);            // 0 = disable, 1 = enable
        s->set_wpc(s, 1);            // 0 = disable, 1 = enable
        s->set_hmirror(s, 0);        // 0 = disable, 1 = enable
        s->set_vflip(s, 0);          // 0 = disable, 1 = enable
    }

    // Connect to WiFi
    Serial.printf("\nConnecting to WiFi: %s", ssid);
    WiFi.begin(ssid, password);
    WiFi.setSleep(false);  // Disable WiFi sleep for stable streaming
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 30) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("\n❌ WiFi connection failed!");
        Serial.println("Please check SSID and password, then restart.");
        return;
    }

    Serial.println("\n✅ WiFi connected!");
    Serial.println("");
    Serial.println("╔════════════════════════════════════════════════╗");
    Serial.println("║       ESP32-CAM Ready for Project K            ║");
    Serial.println("╠════════════════════════════════════════════════╣");
    Serial.printf( "║  IP Address: %-32s ║\n", WiFi.localIP().toString().c_str());
    Serial.println("╠════════════════════════════════════════════════╣");
    Serial.printf( "║  Stream:  http://%-24s/stream  ║\n", WiFi.localIP().toString().c_str());
    Serial.printf( "║  Capture: http://%-24s/capture ║\n", WiFi.localIP().toString().c_str());
    Serial.printf( "║  Status:  http://%-24s/status  ║\n", WiFi.localIP().toString().c_str());
    Serial.println("╚════════════════════════════════════════════════╝");
    Serial.println("");
    Serial.println("Copy this IP to your Python server's ESP32_IP variable!");

    // Start the camera server
    startCameraServer();
    
    // Flash LED twice to indicate ready
    for (int i = 0; i < 2; i++) {
        digitalWrite(FLASH_GPIO_NUM, HIGH);
        delay(100);
        digitalWrite(FLASH_GPIO_NUM, LOW);
        delay(100);
    }
}

// ============================================
// Loop
// ============================================
void loop() {
    // Print status every 30 seconds
    static unsigned long lastPrint = 0;
    if (millis() - lastPrint > 30000) {
        Serial.printf("📡 Status: IP=%s, RSSI=%ddBm, Heap=%u bytes\n",
            WiFi.localIP().toString().c_str(),
            WiFi.RSSI(),
            ESP.getFreeHeap()
        );
        lastPrint = millis();
    }
    
    // Check WiFi connection
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("⚠️ WiFi disconnected! Reconnecting...");
        WiFi.reconnect();
        delay(5000);
    }
    
    delay(1000);
}
