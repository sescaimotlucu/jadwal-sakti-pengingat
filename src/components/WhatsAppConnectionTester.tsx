import React, { useState } from 'react';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { MessageCircle, Send, Wifi, Plus, Phone, CheckCircle } from 'lucide-react';
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
  const [phoneNumber, setPhoneNumber] = useState('6288137216822'); // Your number
  const [message, setMessage] = useState('');
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  
  const { isLoading, sendMessage, testConnection } = useWhatsApp();

  const handleSendMessage = async () => {
    if (!phoneNumber || !message) {
      toast.error('Mohon isi nomor telefon dan pesan');
      return;
    }

    console.log(`📤 Mengirim pesan ke: ${phoneNumber}`);
    const result = await sendMessage(phoneNumber, message);
    
    if (result.success) {
      toast.success(result.message);
      setMessage('');
    } else {
      toast.error(result.message);
    }
  };

  const handleTestConnection = async () => {
    console.log('🔍 Testing WhatsApp API connection...');
    const result = await testConnection();
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleQuickTest = async () => {
    const quickMessage = `🚀 *TEST CEPAT SISTEM*

Halo! Ini adalah test cepat dari Sistem Pengingat Jadwal.

✅ API WhatsApp: Aktif
📱 Target: +62 881-3721-682
🕐 Waktu: ${new Date().toLocaleString('id-ID')}

Sistem siap melayani pengingat otomatis! 🎉

_Quick Test - Sistem Pengingat Desa_`;

    console.log('⚡ Mengirim quick test message...');
    const result = await sendMessage('6288137216822', quickMessage);
    
    if (result.success) {
      toast.success('✅ Quick test berhasil dikirim ke +62 881-3721-682!');
    } else {
      toast.error('❌ Quick test gagal: ' + result.message);
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
    <Card className="w-full max-w-md mx-auto font-poppins border-2 border-emerald-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-yellow-50">
        <CardTitle className="flex items-center gap-2 text-emerald-800">
          <MessageCircle className="w-5 h-5" />
          WhatsApp Fonte API Tester
        </CardTitle>
        <CardDescription className="text-emerald-600">
          Test koneksi dan kirim pesan ke +62 881-3721-682
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {/* Status Info */}
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-lg border-2 border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-800 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="font-semibold">Target Nomor Aktif</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700">
            <Phone className="w-4 h-4" />
            <span className="font-mono">+62 881-3721-682</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handleTestConnection} 
            disabled={isLoading}
            variant="outline"
            className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <Wifi className="w-4 h-4 mr-2" />
            {isLoading ? 'Testing...' : 'Test API'}
          </Button>
          
          <Button 
            onClick={handleQuickTest} 
            disabled={isLoading}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? 'Kirim...' : 'Quick Test'}
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-700">Nomor WhatsApp Tujuan</label>
            <Input
              placeholder="Nomor WhatsApp (contoh: 6281234567890)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-2 border-emerald-200 focus:border-emerald-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-700">Pesan Test</label>
            <Textarea
              placeholder="Tulis pesan test..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="border-2 border-emerald-200 focus:border-emerald-500"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !phoneNumber || !message}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? 'Mengirim...' : 'Kirim Pesan'}
            </Button>
            
            <Button
              onClick={() => setShowAddTemplate(!showAddTemplate)}
              variant="outline"
              size="icon"
              className="border-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
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

        {/* API Info */}
        <div className="text-xs text-gray-600 mt-4 p-3 bg-gradient-to-r from-yellow-50 to-emerald-50 rounded-lg border-2 border-yellow-200">
          <p className="font-semibold mb-2 text-emerald-800">🔧 Konfigurasi Fonte API:</p>
          <ul className="list-disc list-inside space-y-1 text-emerald-700">
            <li>✅ API Key: Terkonfigurasi</li>
            <li>📱 Target: +62 881-3721-682</li>
            <li>🌐 Endpoint: api.fonteapi.com/v1</li>
            <li>🚀 Status: Siap untuk testing!</li>
          </ul>
        </div>

        {/* Templates */}
        {templates.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-700">Template Pesan</label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleUseTemplate(template)}
                  className="w-full text-left p-2 text-xs bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                >
                  <div className="font-medium text-emerald-800">{template.name}</div>
                  <div className="text-emerald-600 truncate">{template.message}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppConnectionTester;