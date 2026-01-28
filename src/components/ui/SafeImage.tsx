// SafeImage component with error handling
'use client'

import React, { useState, useEffect } from 'react'
import { ImageOff } from 'lucide-react'

interface SafeImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
  fallbackSrc?: string
}

const DEFAULT_FALLBACK = 'https://via.placeholder.com/400x300?text=Resim+Yüklenemedi'

// Error placeholder component - tekrarı önlemek için
const ErrorPlaceholder: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <div className={`w-full h-full flex items-center justify-center bg-gray-200 ${className}`} style={style}>
    <div className="text-center p-4">
      <ImageOff className="h-12 w-12 text-gray-400 mx-auto mb-2" />
      <p className="text-xs text-gray-500">Resim yüklenemedi</p>
    </div>
  </div>
)

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  sizes,
  priority = false,
  fallbackSrc = DEFAULT_FALLBACK,
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc)

  // Reset error state when src changes
  useEffect(() => {
    if (src && src !== imageSrc) {
      setImageError(false)
      setImageSrc(src)
    }
  }, [src, imageSrc])

  const handleImgError = () => {
    setImageError(true)
  }

  // If error occurred, show placeholder
  if (imageError) {
    return (
      <div className={`relative ${fill ? 'w-full h-full' : ''} ${className}`} style={!fill ? { width, height } : {}}>
        <ErrorPlaceholder />
      </div>
    )
  }

  // Use img tag with onError for proper error handling
  // Note: Next.js Image doesn't support onError, so we use img tag for error handling
  // For production, consider using Next.js Image with unoptimized prop or a different approach
  if (fill) {
    return (
      <div className="relative w-full h-full">
        {!imageError ? (
          <img
            src={imageSrc}
            alt={alt}
            className={`absolute inset-0 w-full h-full object-cover ${className}`}
            onError={handleImgError}
            loading={priority ? 'eager' : 'lazy'}
          />
        ) : (
          <ErrorPlaceholder className="absolute inset-0" />
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      {!imageError ? (
        <img
          src={imageSrc}
          alt={alt}
          width={width || 400}
          height={height || 300}
          className={className}
          onError={handleImgError}
          loading={priority ? 'eager' : 'lazy'}
        />
      ) : (
        <ErrorPlaceholder style={{ width: width || 400, height: height || 300 }} />
      )}
    </div>
  )
}

export default SafeImage
