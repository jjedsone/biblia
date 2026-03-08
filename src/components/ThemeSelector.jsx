import { useTheme } from '../context/ThemeContext'

const OPCOES = [
  { value: 'light', label: 'Claro' },
  { value: 'medium', label: 'Médio' },
  { value: 'dark', label: 'Escuro' },
]

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-selector" role="group" aria-label="Tema visual">
      {OPCOES.map((op) => (
        <button
          key={op.value}
          type="button"
          className={`theme-btn ${theme === op.value ? 'ativo' : ''}`}
          onClick={() => setTheme(op.value)}
          title={`Tema ${op.label}`}
          aria-pressed={theme === op.value}
        >
          <span className="theme-btn-icon" aria-hidden>
            {op.value === 'light' && '☀'}
            {op.value === 'medium' && '◐'}
            {op.value === 'dark' && '☽'}
          </span>
          <span className="theme-btn-label">{op.label}</span>
        </button>
      ))}
    </div>
  )
}
