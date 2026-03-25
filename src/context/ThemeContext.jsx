import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Try to load saved theme, fallback to defaults
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('bb_theme')
    return saved ? JSON.parse(saved) : {
      surface: '#131313',
      primary: '#F9BA82',
      bgImage: '',
    }
  })

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-surface', theme.surface)
    root.style.setProperty('--color-primary', theme.primary)
    
    // Si hay una imagen, la aplicamos. Si no, la limpiamos.
    if (theme.bgImage) {
      root.style.setProperty('--bg-image', `url(${theme.bgImage})`)
    } else {
      root.style.removeProperty('--bg-image')
    }

    // Save to local storage anytime it changes
    localStorage.setItem('bb_theme', JSON.stringify(theme))
  }, [theme])

  const updateTheme = (newSettings) => {
    setTheme(prev => ({ ...prev, ...newSettings }))
  }

  const resetTheme = () => {
    setTheme({
      surface: '#131313',
      primary: '#F9BA82',
      bgImage: '',
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
