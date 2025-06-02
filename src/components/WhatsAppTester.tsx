
import React, { useState } from 'react';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { MessageCircle, Send, Wifi } from 'lucide-react';

const WhatsAppTester = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const { isLoading, sendMessage, testConnection } = useWhatsApp();

  const handleSendMessage = async () => {
    if (!phoneNumber || !message) {
      toast.error('Mohon isi nomor telefon dan pesan');
      return;
    }

    const result = await sendMessage(phoneNumber, message);
    
    if (result.success) {
      toast.success(result.message);
      setMessage('');
    } else {
      toast.error(result.message);
    }
  };

  const handleTestConnection = async () => {
    const result = await testConnection();
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto font-poppins">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          WhatsApp Baileys Tester
        </CardTitle>
        <CardDescription>
          Test koneksi dan kirim pesan via Baileys API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleTestConnection} 
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          <Wifi className="w-4 h-4 mr-2" />
          {isLoading ? 'Testing...' : 'Test Koneksi'}
        </Button>
        
        <div className="space-y-3">
          <Input
            placeholder="Nomor WhatsApp (contoh: 6281234567890)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Textarea
            placeholder="Tulis pesan test..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !phoneNumber || !message}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? 'Mengirim...' : 'Kirim Pesan'}
          </Button>
        </div>

        <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="font-semibold mb-2">Setup Baileys Server:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Clone repo: github.com/WhiskeySockets/Baileys</li>
            <li>Install dependencies: npm install</li>
            <li>Jalankan server di port 5000</li>
            <li>Scan QR code untuk login WhatsApp</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppTester;
