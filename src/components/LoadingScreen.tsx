import './LoadingScreen.css'

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = 'Booking confirmation' }: LoadingScreenProps) {
  return (
    // Full screen overlay som visar att något händer... nånstans :) lite osäker om det behövs
    
    <div className="loading-overlay" aria-live="polite" role="status">
      <div className="loading-card">
        <span className="spinner" />
        <p>{message}</p>
      </div>
    </div>
  )
}

