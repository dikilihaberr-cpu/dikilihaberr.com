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
    <div className="news-card group bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <SafeImage
          src={imageUrl || 'https://via.placeholder.com/400x300?text=Resim+Yok'}
          alt={title || 'Haber'}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm bg-opacity-90">
            {category}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1 leading-relaxed">
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span className="font-medium">{publishedAt}</span>
          </div>
          {slug && (
            <div className="flex items-center text-primary group-hover:text-blue-700 font-semibold text-sm transition-colors">
              Devamını Oku
              <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
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