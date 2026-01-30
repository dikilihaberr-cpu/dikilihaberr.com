// Footer component
'use client'

import React from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'

const Footer = (): React.JSX.Element => {
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & Açıklama */}
          <div>
            <h3 className="text-2xl font-bold mb-3">DikiliHaber</h3>
            <p className="text-blue-100 text-sm">Dikili'nin en güncel ve güvenilir haber kaynağı. Her gün sizin için en önemli haberleri derleyip sunuyoruz.</p>
          </div>

          {/* Kategoriler */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kategoriler</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><Link href="/category/gundem" className="hover:text-white">Gündem</Link></li>
              <li><Link href="/category/siyaset" className="hover:text-white">Siyaset</Link></li>
              <li><Link href="/category/ekonomi" className="hover:text-white">Ekonomi</Link></li>
              <li><Link href="/category/spor" className="hover:text-white">Spor</Link></li>
            </ul>
          </div>

          {/* Bize Ulaşın */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Bize Ulaşın</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" /> 
                <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@dikilihaber.com'}`} className="hover:text-white">
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@dikilihaber.com'}
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" /> 
                <a href="tel:+902326710021" className="hover:text-white">
                  {process.env.NEXT_PUBLIC_CONTACT_PHONE || '0232 671 0021'}
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" /> 
                {process.env.NEXT_PUBLIC_CONTACT_ADDRESS || 'Dikili, İzmir'}
              </li>
            </ul>
          </div>

          {/* Sosyal Medya */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Bizi Takip Edin</h4>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.instagram.com/dikilihaberr/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-blue-100 hover:text-white transition">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.youtube.com/@dikilihaberr" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-blue-100 hover:text-white transition">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="https://www.facebook.com/people/Dikili-Haberr/61585581113939/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-blue-100 hover:text-white transition">
                <Facebook className="h-6 w-6" />
              </a>
              {process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN && (
                <a href={process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-blue-100 hover:text-white transition">
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-400 my-8"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-blue-100 text-sm">
          <p>&copy; 2026 DikiliHaber. Tüm hakları saklıdır.</p>
          <ul className="flex space-x-6 mt-4 md:mt-0">
            <li>
              <Link href="/privacy" className="hover:text-white" aria-label="Gizlilik Politikası">
                Gizlilik Politikası
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white" aria-label="Kullanım Şartları">
                Kullanım Şartları
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white" aria-label="İletişim">
                İletişim
              </Link>
            </li>
          </ul>
        </div>

        {/* En alt: Telefon ve sosyal medya */}
        <div className="border-t border-blue-400/50 mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-blue-100 text-sm">
          <a href="tel:+902326710021" className="flex items-center hover:text-white transition">
            <Phone className="h-4 w-4 mr-2 shrink-0" />
            0232 671 0021
          </a>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/dikilihaberr/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://www.youtube.com/@dikilihaberr" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-white transition">
              <Youtube className="h-5 w-5" />
            </a>
            <a href="https://www.facebook.com/people/Dikili-Haberr/61585581113939/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white transition">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer