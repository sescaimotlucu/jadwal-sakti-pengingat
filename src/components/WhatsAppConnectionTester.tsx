
import React, { useState } from 'react';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { MessageCircle, Send, Wifi, Plus } from 'lucide-react';
import AddTemplateForm from './AddTemplateForm';

interface MessageTemplate {
  id: string;
  name: string;
  message: string;
}

interface WhatsAppConnectionTesterProps {
  templates: MessageTemplate[];
  onAddTemplate: (name: string, message: string) => void;
}

const WhatsAppConnectionTester = ({ templates, onAddTemplate }: WhatsAppConnectionTesterProps) => {
  const [phoneNumber, setPhoneNumber] = useState('6288137216822'); // Updated to your number
  const [message, setMessage] = useState('');
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  
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

  const handleUseTemplate = (template: MessageTemplate) => {
    setMessage(template.message);
    toast.success(`Template "${template.name}" dimuat`);
  };

  const handleAddTemplate = (name: string, templateMessage: string) => {
    onAddTemplate(name, templateMessage);
    setMessage('');
    setShowAddTemplate(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto font-poppins">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          WhatsApp Fonte API Tester
        </CardTitle>
        <CardDescription>
          Test koneksi dan kirim pesan via Fonte API
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
          {isLoading ? 'Testing...' : 'Test Koneksi Fonte API'}
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
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !phoneNumber || !message}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? 'Mengirim...' : 'Kirim Pesan'}
            </Button>
            
            <Button
              onClick={() => setShowAddTemplate(!showAddTemplate)}
              variant="outline"
              size="icon"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <AddTemplateForm
            show={showAddTemplate}
            message={message}
            onAddTemplate={handleAddTemplate}
          />
        </div>

        <div className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="font-semibold mb-2 text-blue-800">Setup Fonte API:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>API Key sudah dikonfigurasi</li>
            <li>Nomor default: +62 881-3721-682</li>
            <li>Endpoint: api.fonteapi.com/v1</li>
            <li>Siap untuk testing!</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppConnectionTester;
