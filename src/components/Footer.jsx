import { Link } from 'react-router-dom'
import { Scale, Github, Twitter, Mail, ExternalLink } from 'lucide-react'

const footerLinks = {
  platform: [
    { name: 'About CLEAR', href: '/about' },
    { name: 'Research', href: '/research' },
    { name: 'Tools', href: '/tools' },
    { name: 'Legislation', href: '/legislation' },
  ],
  resources: [
    { name: 'Education', href: '/education' },
    { name: 'Post-Labor Economics', href: '/post-labor' },
    { name: 'Join Coalition', href: '/coalition' },
    { name: 'PlainSpeak Tool', href: '/tools/plainspeak' },
  ],
  external: [
    { name: 'David Shapiro\'s PLE', href: 'https://daveshap.substack.com', external: true },
    { name: 'Complexity Index Data', href: '#', external: true },
    { name: 'Model Legislation', href: '/legislation', external: false },
    { name: 'API Documentation', href: '#', external: true },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">CLEAR</span>
            </Link>
            <p className="text-slate-400 text-sm mb-4 max-w-sm">
              Coalition for Legal & Administrative Reform. Making law accessible, 
              preparing for the post-labor transition, building economic agency for all.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="mailto:contact@clear-coalition.org" className="text-slate-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">External</h3>
            <ul className="space-y-2">
              {footerLinks.external.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CLEAR Coalition. Open source under MIT License.
          </p>
          <p className="text-sm text-slate-500">
            Post-Labor Economics framework by{' '}
            <a
              href="https://daveshap.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              David Shapiro
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
