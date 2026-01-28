'use client'

import { useEffect, useState } from 'react'
import { getActiveAds, incrementAdView, incrementAdClick, Ad } from '@/lib/supabase'
import SafeImage from '@/components/ui/SafeImage'
import { logger } from '@/lib/utils/logger'

interface AdBannerProps {
  position: 'sidebar' | 'header' | 'footer' | 'content'
  className?: string
}

export default function AdBanner({ position, className = '' }: AdBannerProps) {
  const [ads, setAds] = useState<Ad[]>([])
  const [currentAd, setCurrentAd] = useState<Ad | null>(null)

  useEffect(() => {
    loadAds()
  }, [position])

  const loadAds = async () => {
    try {
      const activeAds = await getActiveAds(position)
      setAds(activeAds)
      if (activeAds.length > 0) {
        // Rastgele bir reklam seç
        const randomAd = activeAds[Math.floor(Math.random() * activeAds.length)]
        setCurrentAd(randomAd)
        
        // View count'u artır
        if (randomAd.id) {
          await incrementAdView(randomAd.id)
        }
      }
    } catch (error) {
      logger.error('Error loading ads:', error)
    }
  }

  const handleClick = async () => {
    if (currentAd?.id) {
      await incrementAdClick(currentAd.id)
      if (currentAd.link_url) {
        window.open(currentAd.link_url, '_blank', 'noopener,noreferrer')
      }
    }
  }

  if (!currentAd) return null

  return (
    <div className={`ad-banner ${className}`}>
      <div
        className="relative cursor-pointer hover:opacity-90 transition-opacity"
        onClick={handleClick}
      >
        {currentAd.link_url ? (
          <a
            href={currentAd.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <SafeImage
              src={currentAd.image_url || 'https://via.placeholder.com/300x250?text=Reklam'}
              alt={currentAd.title || 'Reklam'}
              width={300}
              height={250}
              className="w-full h-auto rounded-lg"
            />
            {currentAd.title && (
              <div className="mt-2 text-xs text-gray-600 text-center">
                {currentAd.title}
              </div>
            )}
          </a>
        ) : (
          <div>
            <SafeImage
              src={currentAd.image_url || 'https://via.placeholder.com/300x250?text=Reklam'}
              alt={currentAd.title || 'Reklam'}
              width={300}
              height={250}
              className="w-full h-auto rounded-lg"
            />
            {currentAd.title && (
              <div className="mt-2 text-xs text-gray-600 text-center">
                {currentAd.title}
              </div>
            )}
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Reklam
        </div>
      </div>
    </div>
  )
}
