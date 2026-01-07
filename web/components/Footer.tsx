import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-pink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Contact */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">orlion</span>
                  <div className="w-8 h-8 bg-blue-light rounded"></div>
                </div>
                <span className="text-sm">studio</span>
              </div>
            </div>
            <p className="text-sm mb-2">hi@orlionstudio.com</p>
            <p className="text-xs mt-4">©ORLIONSTUDIO 2025. All rights reserved.</p>
          </div>

          {/* Navigation Links */}
          <div>
            <nav className="flex flex-col space-y-2">
              <Link href="/work" className="text-sm hover:underline">
                Work
              </Link>
              <Link href="/shop" className="text-sm hover:underline">
                Shop
              </Link>
              <Link href="/info" className="text-sm hover:underline">
                Info
              </Link>
              <Link href="/contact" className="text-sm hover:underline">
                Contact
              </Link>
            </nav>
          </div>

          {/* Legal Links and Social */}
          <div>
            <nav className="flex flex-col space-y-2 mb-4">
              <Link href="/faq" className="text-sm hover:underline">
                FAQ&apos;S
              </Link>
              <Link href="/terms" className="text-sm hover:underline">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="text-sm hover:underline">
                Privacy Policy
              </Link>
              <Link href="/imprint" className="text-sm hover:underline">
                Imprint
              </Link>
            </nav>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
                aria-label="Etsy"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.564 2.445c0-.59.479-1.069 1.069-1.069.59 0 1.069.479 1.069 1.069 0 .59-.479 1.069-1.069 1.069-.59 0-1.069-.479-1.069-1.069zm14.936.561v2.819h-2.819l2.819-2.819zm-16.392 5.808c-.59 0-1.069.479-1.069 1.069 0 .59.479 1.069 1.069 1.069.59 0 1.069-.479 1.069-1.069 0-.59-.479-1.069-1.069-1.069zm15.321 1.716c0-.59.479-1.069 1.069-1.069.59 0 1.069.479 1.069 1.069 0 .59-.479 1.069-1.069 1.069-.59 0-1.069-.479-1.069-1.069zm-9.795 2.277c0-.828-.671-1.5-1.5-1.5s-1.5.672-1.5 1.5.671 1.5 1.5 1.5 1.5-.672 1.5-1.5zm9.795 0c0-.828-.671-1.5-1.5-1.5s-1.5.672-1.5 1.5.671 1.5 1.5 1.5 1.5-.672 1.5-1.5zm-9.795 3.723c0-.828-.671-1.5-1.5-1.5s-1.5.672-1.5 1.5.671 1.5 1.5 1.5 1.5-.672 1.5-1.5z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
                aria-label="Behance"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.637 1.477 5.313 2.688l-2.337.916c-.551-1.003-1.451-1.604-2.976-1.604-2.024 0-3.592 1.192-3.592 3.115 0 2.012 1.514 3.118 3.437 3.118 1.394 0 2.392-.605 2.976-1.604l2.337.916c-.676 1.211-2.231 2.688-5.313 2.688zm-11.01-5.844c0-2.14-1.617-3.153-3.437-3.153h-3.143v10.354h3.143c1.866 0 3.437-1.013 3.437-3.201zm-3.143-1.568h1.619c1.176 0 1.925.568 1.925 1.513 0 .955-.749 1.512-1.925 1.512h-1.619v-3.025zm-6.58 7.188h-2.854v-10.354h2.854c1.866 0 3.437 1.013 3.437 3.201 0 2.188-1.571 3.153-3.437 3.153zm0-4.785c-1.176 0-1.925-.568-1.925-1.513 0-.944.749-1.512 1.925-1.512h1.619v3.025h-1.619z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

