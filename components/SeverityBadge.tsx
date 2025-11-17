interface SeverityBadgeProps {
  severity: 'low' | 'moderate' | 'high'
  size?: 'sm' | 'md' | 'lg'
}

export default function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const colors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  const labels = {
    low: 'Low Risk',
    moderate: 'Moderate Risk',
    high: 'High Risk',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${colors[severity]} ${sizes[size]}`}
    >
      {labels[severity]}
    </span>
  )
}