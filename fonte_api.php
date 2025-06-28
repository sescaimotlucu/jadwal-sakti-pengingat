<?php
/**
 * WhatsApp API Integration using Fonte API
 * Integrasi API WhatsApp menggunakan Fonte
 */

require_once 'config.php';
require_once 'functions.php';

class FonteAPI {
    private $apiUrl;
    private $token;
    
    public function __construct() {
        $this->apiUrl = FONTE_API_URL;
        $this->token = FONTE_API_TOKEN;
    }
    
    /**
     * Send WhatsApp message
     */
    public function sendMessage($phone, $message) {
        try {
            // Format phone number
            $formattedPhone = formatPhoneNumber($phone);
            
            // Prepare data
            $data = [
                'phone' => $formattedPhone,
                'message' => $message
            ];
            
            // Initialize cURL
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => $this->apiUrl,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($data),
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $this->token
                ],
                CURLOPT_TIMEOUT => 30,
                CURLOPT_SSL_VERIFYPEER => false
            ]);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);
            
            if ($error) {
                throw new Exception("cURL Error: " . $error);
            }
            
            $responseData = json_decode($response, true);
            
            // Log the activity
            $logMessage = "WhatsApp sent to {$formattedPhone}: " . ($httpCode == 200 ? 'SUCCESS' : 'FAILED');
            logActivity($logMessage);
            
            if ($httpCode == 200) {
                return createResponse(true, 'Pesan WhatsApp berhasil dikirim', $responseData);
            } else {
                return createResponse(false, 'Gagal mengirim pesan WhatsApp: ' . $response);
            }
            
        } catch (Exception $e) {
            $errorMsg = "WhatsApp API Error: " . $e->getMessage();
            logActivity($errorMsg);
            return createResponse(false, $errorMsg);
        }
    }
    
    /**
     * Send welcome message to new user
     */
    public function sendWelcomeMessage($phone, $nama) {
        $message = "🎉 *Selamat Datang!*\n\n";
        $message .= "Halo *{$nama}*, selamat datang di sistem!\n\n";
        $message .= "Anda telah berhasil login ke dalam sistem kami.\n";
        $message .= "Terima kasih telah bergabung dengan kami! 😊\n\n";
        $message .= "_Pesan otomatis dari Sistem Login_";
        
        return $this->sendMessage($phone, $message);
    }
    
    /**
     * Test API connection
     */
    public function testConnection() {
        try {
            $testData = [
                'phone' => '6281234567890',
                'message' => 'Test connection'
            ];
            
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => str_replace('/send', '/status', $this->apiUrl),
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    'Authorization: Bearer ' . $this->token
                ],
                CURLOPT_TIMEOUT => 10
            ]);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            return $httpCode == 200;
            
        } catch (Exception $e) {
            return false;
        }
    }
}

// Initialize API instance
$fonteAPI = new FonteAPI();
?>