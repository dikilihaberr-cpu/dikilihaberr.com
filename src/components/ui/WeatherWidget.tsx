"use client"

// WeatherWidget component
import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';

const WeatherWidget = (): React.JSX.Element => {
  const [weather, setWeather] = useState({
    temperature: 22,
    condition: 'Güneşli',
    location: 'Dikili, İzmir',
    humidity: 65,
    windSpeed: 12,
  });

  // Mock weather data - in real app, fetch from API
  useEffect(() => {
    // Simulate API call
    const mockWeather = {
      temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
      condition: ['Güneşli', 'Bulutlu', 'Yağmurlu'][Math.floor(Math.random() * 3)],
      location: 'Dikili, İzmir',
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
    };
    setWeather(mockWeather);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Güneşli':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'Bulutlu':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'Yağmurlu':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Hava Durumu</h3>
        <span className="text-blue-100 text-sm">Canlı</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getWeatherIcon(weather.condition)}
          <div className="ml-3">
            <div className="text-3xl font-bold">{weather.temperature}°C</div>
            <div className="text-blue-100 text-sm">{weather.condition}</div>
          </div>
        </div>
      </div>

      <div className="text-sm text-blue-100 space-y-1">
        <div className="flex items-center justify-between">
          <span>Konum:</span>
          <span className="font-medium">{weather.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Nem:</span>
          <span className="font-medium">{weather.humidity}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Rüzgar:</span>
          <span className="font-medium">{weather.windSpeed} km/h</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-blue-400">
        <div className="flex items-center text-xs text-blue-100">
          <Thermometer className="h-4 w-4 mr-1" />
          <span>Güncelleme: {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;