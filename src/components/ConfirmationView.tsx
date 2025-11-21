import type { BookingResponse } from '../types'
import './ConfirmationView.css'

interface ConfirmationViewProps {
  booking: BookingResponse
  onReset: () => void
}

export function ConfirmationView({ booking, onReset }: ConfirmationViewProps) {
  // Försök skapa ett Date-objekt, annars fall tillbaka till rå text
  const parsedDate = new Date(booking.when)
  const isValidDate = !Number.isNaN(parsedDate.getTime())

  const formatter = new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  const formattedDate = isValidDate ? formatter.format(parsedDate) : booking.when
  //Confirmation sida 
  return (
    <main className="confirmation-screen" id="confirmation">
      <div className="logo-stack">
        <div className="logo-mark" aria-hidden="true" />
      </div>
      <h1 className="hero-heading confirmation">See you soon!</h1>
      <section className="confirmation-card">
        <p className="section-title">Booking details</p>
        <div className="detail-block">
          <p className="detail-label">When</p>
          <p className="detail-value">{formattedDate}</p>
        </div>
        <div className="detail-block">
          <p className="detail-label">Who</p>
          <p className="detail-value">{booking.people} bowlers</p>
        </div>
        <div className="detail-block">
          <p className="detail-label">Lanes</p>
          <p className="detail-value">{booking.lanes}</p>
        </div>
        <div className="detail-block">
          <p className="detail-label">Booking number</p>
          <p className="detail-value">{booking.id}</p>
        </div>
        <div className="price-row">
          <div>
            <p className="detail-label">Total</p>
            <p className="price-value">{booking.price} sek</p>
          </div>
        </div>
        <button className="primary-button" onClick={onReset}>
          Sweet, let&apos;s go!
        </button>
      </section>
    </main>
  )
}

