import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Scale, ChevronDown, Settings, User, LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navigation = [
  { name: 'Tools', href: '/tools' },
  { name: 'Community', href: '/community' },
  { name: 'States', href: '/states' },
  { name: 'Tracker', href: '/tracker' },
  { name: 'Research', href: '/research' },
  { name: 'Coalition', href: '/coalition' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, profile, user, isConfigured } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
      <nav className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-semibold text-white">CLEAR</span>
              <span className="hidden sm:block text-xs text-slate-400">Coalition for Legal & Administrative Reform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-blue-400 bg-blue-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* CTA Button & Settings */}
          <div className="hidden lg:flex items-center gap-2">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </NavLink>
            
            {/* Auth buttons */}
            {isConfigured && (
              isAuthenticated ? (
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                    {(profile?.display_name || user?.email)?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden xl:block">
                    {profile?.display_name || 'Profile'}
                  </span>
                </NavLink>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign In</span>
                </Link>
              )
            )}
            
            <Link
              to="/coalition"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Join the Coalition
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <NavLink
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'text-blue-400 bg-blue-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <Settings className="w-4 h-4" /> Settings
              </NavLink>
              
              {/* Mobile Auth */}
              {isConfigured && (
                isAuthenticated ? (
                  <NavLink
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                        isActive
                          ? 'text-blue-400 bg-blue-500/10'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`
                    }
                  >
                    <User className="w-4 h-4" /> Profile
                  </NavLink>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <LogIn className="w-4 h-4" /> Sign In
                  </Link>
                )
              )}
              
              <Link
                to="/coalition"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 px-4 py-3 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-lg text-center transition-colors"
              >
                Join the Coalition
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
