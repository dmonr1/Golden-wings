import { createContext, useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const PageTransitionContext = createContext({
  isTransitioning: false,
  pendingPath: null,
  startPageTransition: () => {},
})

export function usePageTransition() {
  return useContext(PageTransitionContext)
}

export function PageTransitionProvider({ children }) {
  const navigate = useNavigate()

  const startPageTransition = useCallback(
    (to) => {
      if (!to) return
      navigate(to)
    },
    [navigate],
  )

  return (
    <PageTransitionContext.Provider
      value={{
        isTransitioning: false,
        pendingPath: null,
        startPageTransition,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  )
}
