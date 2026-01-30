// WhatsAppTipLine component
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppTipLine = (): React.JSX.Element => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="https://wa.me/1234567890?text=Haber%20İhbar"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-colors duration-200"
      >
        <MessageCircle className="h-6 w-6 mr-2" />
        <span className="font-medium">Haber İhbar</span>
      </a>
    </div>
  );
};

export default WhatsAppTipLine;