// NewsCard component
'use client'

import React from 'react';
import SafeImage from '@/components/ui/SafeImage';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

interface NewsCardProps {
  title: string
  category: string
  publishedAt: string
  imageUrl: string
  slug?: string
  excerpt?: string
}

const NewsCard = ({ title, category, publishedAt, imageUrl, slug, excerpt }: NewsCardProps) => {
  const CardContent = () => (
    <div className="news-card group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative h-48 mb-4 overflow-hidden bg-gray-100">
        <SafeImage
          src={imageUrl || 'https://via.placeholder.com/400x300?text=Resim+Yok'}
          alt={title || 'Haber'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-accent text-white px-2 py-1 rounded text-xs font-medium">
            {category}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{publishedAt}</span>
          </div>
          {slug && (
            <div className="flex items-center text-primary group-hover:text-blue-700 font-medium text-sm transition-colors">
              Devamını Oku
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (slug) {
    return (
      <Link href={`/news/${slug}`} className="block cursor-pointer" aria-label={`${title} haberini oku`}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default NewsCard;