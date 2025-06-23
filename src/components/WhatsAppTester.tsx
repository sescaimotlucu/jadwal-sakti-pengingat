
import React, { useState } from 'react';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { MessageCircle, Send, Wifi, Edit, Save, Trash2, Plus } from 'lucide-react';

interface MessageTemplate {
  id: string;
  name: string;
  message: string;
}

const WhatsAppTester = () => {
  const [phoneNumber, setPhoneNumber] = useState('6288137216822'); // Updated to your number
  const [message, setMessage] = useState('');
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: '1',
      name: 'Pengingat Posyandu',
      message: 'Pengingat Posyandu besok jam 7 pagi!'
    },
    {
      id: '2',
      name: 'Rapat RT',
      message: 'Jangan lupa rapat RT hari Minggu jam 19:00 di balai warga'
    }
  ]);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [newTemplateName, setNewTemplateName] = useState('');
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

  const handleSaveTemplate = (templateId: string, newMessage: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, message: newMessage } : t
    ));
    setEditingTemplate(null);
    toast.success('Template berhasil diperbarui');
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast.success('Template berhasil dihapus');
  };

  const handleAddTemplate = () => {
    if (!newTemplateName || !message) {
      toast.error('Mohon isi nama template dan pesan');
      return;
    }

    const newTemplate: MessageTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      message: message
    };

    setTemplates(prev => [...prev, newTemplate]);
    setNewTemplateName('');
    setMessage('');
    setShowAddTemplate(false);
    toast.success('Template baru berhasil ditambahkan');
  };

  return (
    <div className="space-y-6">
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

            {showAddTemplate && (
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <Input
                  placeholder="Nama template"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                />
                <Button onClick={handleAddTemplate} size="sm" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Template
                </Button>
              </div>
            )}
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

      {/* Message Templates */}
      <Card className="w-full max-w-md mx-auto font-poppins">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Template Pesan
          </CardTitle>
          <CardDescription>
            Kelola template pesan untuk pengingat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {templates.map((template) => (
            <div key={template.id} className="p-3 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">{template.name}</h4>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Gunakan
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingTemplate(
                      editingTemplate === template.id ? null : template.id
                    )}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              {editingTemplate === template.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={template.message}
                    onChange={(e) => {
                      setTemplates(prev => prev.map(t => 
                        t.id === template.id ? { ...t, message: e.target.value } : t
                      ));
                    }}
                    rows={2}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSaveTemplate(template.id, template.message)}
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Simpan
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-gray-600">{template.message}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppTester;
