import { useState } from 'react'
import { createBooking } from './api/booking'
import { BookingForm } from './components/BookingForm'
import { ConfirmationView } from './components/ConfirmationView'
import { LoadingScreen } from './components/LoadingScreen'
import { MenuOverlay } from './components/MenuOverlay'
import type { BookingFormValues, BookingRequest, BookingResponse } from './types'
import './App.css'

type Screen = 'booking' | 'confirmation'

function App() {
  // håller koll på vilken vy vi visar just nu
  const [screen, setScreen] = useState<Screen>('booking')
  // Minns om hamburgarmenyn är öppen eller stängd
  const [menuOpen, setMenuOpen] = useState(false)
  // Visar laddningsskärmen medan vi väntar på APIs svar
  const [loading, setLoading] = useState(false)
  // Sparar error från API eller formuläret
  const [error, setError] = useState<string | null>(null)
  // Om bokning går igenom sparar vi svaret här 
  const [booking, setBooking] = useState<BookingResponse | null>(null)

  const handleSubmit = async (values: BookingFormValues) => {
    // tar bort fel och visa laddare innan det gör en request
    setError(null)
    setLoading(true)
    try {
      const request: BookingRequest = {
        when: `${values.date}T${values.time}`,
        lanes: values.lanes,
        people: values.people,
        shoes: values.shoes,
      }

      const response = await createBooking(request)
      setBooking(response)
      setScreen('confirmation')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const resetBooking = () => {
    // Går tillbaka till bokningsvyn
    setScreen('booking')
  }

  return (
    <div className="app-shell">
      <header className="app-bar">
        <button className="navicon" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </button>
      </header>

      {screen === 'booking' && (
        <BookingForm onSubmit={handleSubmit} submitting={loading} errorMessage={error} />
      )}
      {screen === 'confirmation' && booking && <ConfirmationView booking={booking} onReset={resetBooking} />}

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      {loading && <LoadingScreen />}
    </div>
  )
}

export default App
