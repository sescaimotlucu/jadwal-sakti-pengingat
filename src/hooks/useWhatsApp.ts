
import { useState } from 'react';
import { whatsappService, WhatsAppResponse } from '../services/whatsappService';

interface UseWhatsAppReturn {
  isLoading: boolean;
  sendMessage: (number: string, message: string) => Promise<WhatsAppResponse>;
  sendReminder: (
    phoneNumber: string,
    activity: string,
    date: string,
    time: string,
    type: 'H-2' | 'H-1' | 'Hari-H'
  ) => Promise<WhatsAppResponse>;
  testConnection: () => Promise<WhatsAppResponse>;
}

export const useWhatsApp = (): UseWhatsAppReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (number: string, message: string): Promise<WhatsAppResponse> => {
    setIsLoading(true);
    try {
      const result = await whatsappService.sendMessage({ number, message });
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const sendReminder = async (
    phoneNumber: string,
    activity: string,
    date: string,
    time: string,
    type: 'H-2' | 'H-1' | 'Hari-H'
  ): Promise<WhatsAppResponse> => {
    setIsLoading(true);
    try {
      const result = await whatsappService.sendReminder(phoneNumber, activity, date, time, type);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async (): Promise<WhatsAppResponse> => {
    setIsLoading(true);
    try {
      const result = await whatsappService.testConnection();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendMessage,
    sendReminder,
    testConnection
  };
};
