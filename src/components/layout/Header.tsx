// Header component
import React from 'react'

const Header = (): React.JSX.Element => {
  return (
    <header className="bg-accent text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm">📢 Haberlerde Kalın! Şu anda en fazla okumakta olduğunuz haberler burada</p>
      </div>
    </header>
  )
}

export default Header