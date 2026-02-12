// Reusable UI Components

export function Card({ children, className = '', hover = false }) {
  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-700 overflow-hidden ${hover ? 'hover:border-slate-600 transition-colors' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseStyles = 'font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-400 text-white',
    secondary: 'border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    amber: 'bg-amber-500/20 text-amber-400',
    red: 'bg-red-500/20 text-red-400',
  }
  
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function SectionHeader({ eyebrow, title, description, centered = false }) {
  return (
    <div className={`mb-12 ${centered ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'}`}>
      {eyebrow && (
        <p className="text-sm font-medium text-blue-400 mb-2">{eyebrow}</p>
      )}
      <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 font-serif">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-slate-400">{description}</p>
      )}
    </div>
  )
}

export function StatCard({ value, label, trend, icon: Icon }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        {Icon && <Icon className="w-5 h-5 text-slate-500" />}
        {trend && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="text-3xl font-semibold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  )
}

export function ProgressBar({ value, max = 100, color = 'blue', showLabel = true }) {
  const percentage = Math.min(100, (value / max) * 100)
  
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  }
  
  return (
    <div className="w-full">
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-slate-500">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  )
}

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex border-b border-slate-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === tab.id
              ? 'text-blue-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
      ))}
    </div>
  )
}

export function Alert({ children, variant = 'info', icon: Icon }) {
  const variants = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
  }
  
  return (
    <div className={`p-4 rounded-lg border ${variants[variant]}`}>
      <div className="flex items-start gap-3">
        {Icon && <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}
