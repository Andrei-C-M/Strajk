import { useEffect, useMemo, useState } from 'react'
import type { BookingFormValues } from '../types'
import './BookingForm.css'

interface BookingFormProps {
  onSubmit: (values: BookingFormValues) => Promise<void>
  errorMessage?: string | null
  submitting: boolean
}

const MAX_LANES = 4
const MAX_PLAYERS = MAX_LANES * 4

const defaultDate = () => {
  // Starta formuläret på dagens datum så användaren slipper välja

  const today = new Date()
  return today.toISOString().split('T')[0]
}

export function BookingForm({ onSubmit, errorMessage, submitting }: BookingFormProps) {
  const [date, setDate] = useState(defaultDate())
  const [time, setTime] = useState('19:00')
  const [lanes, setLanes] = useState(1)
  const [people, setPeople] = useState(3)
  const [shoeSizes, setShoeSizes] = useState<string[]>(() => Array(3).fill(''))
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    // Lägg till eller ta bort skorfält när antal spelare ändras
    setShoeSizes((prev) => {
      if (people > prev.length) {
        return [...prev, ...Array(people - prev.length).fill('')]
      }
      return prev.slice(0, people)
    })
  }, [people])

  const dateDisplay = useMemo(() => {
    const parsedDate = new Date(date)
    const formatter = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' })
    return formatter.format(parsedDate)
  }, [date])

  const handlePlayersChange = (value: number) => {

    // Begränsar värdet så att det håller sig mellan 1 och MAX_PLAYERS
    const nextValue = Math.min(Math.max(value, 1), MAX_PLAYERS)
    setPeople(nextValue)
  }

  const handleLaneChange = (value: number) => {
    const next = Math.min(Math.max(value, 1), MAX_LANES)
    setLanes(next)
  }

  const handleRemoveShoe = (index: number) => {
    if (people <= 1) return
    setShoeSizes((prev) => prev.filter((_, i) => i !== index))
    setPeople((prev) => prev - 1)
  }

  const handleAddShoe = () => {
    if (people >= MAX_PLAYERS) return
    setPeople((prev) => prev + 1)
  }

  const normalizedShoes = () =>

    // Plockar ut siffror ur textfältet om användaren skriver "Euro 44" eller liknande

    shoeSizes.map((shoe) => {
      const numeric = parseInt(shoe.replace(/\D/g, ''), 10)
      return Number.isNaN(numeric) ? null : numeric
    })

  const validateForm = (): boolean => {
    // Krav: minst en spelare

    if (people === 0) {
      setFormError('At least one bowler is required.')
      return false
    }

    // regel: 4 spelare per bana
    if (people > lanes * 4) {
      setFormError('Remember: max four players per lane.')
      return false
    }

    // Måste ha exakt lika många skorstorlekar som spelare
    const shoes = normalizedShoes()
    if (shoes.length !== people || shoes.some((size) => size === null)) {
      setFormError('Add shoe sizes for everyone.')
      return false
    }

    setFormError(null)
    return true
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateForm()) {
      return
    }

    const shoes = normalizedShoes() as number[]

    const payload: BookingFormValues = {
      date,
      time,
      lanes,
      people,
      shoes,
    }

    await onSubmit(payload)
  }

  return (
    <main className="booking-screen" id="booking">
      <div className="logo-stack">
        <div className="logo-mark" aria-hidden="true" />
        <p className="logo-text">Strajk Bowling</p>
      </div>
      <h1 className="hero-heading">Booking</h1>

      <section className="booking-card">
        <p className="section-title">When, What &amp; Who</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="input-block">
            <span className="label">Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </label>

          <label className="input-block">
            <span className="label">Time</span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </label>

          <label className="input-block">
            <span className="label">Number of awesome bowlers</span>
            <input
              type="number"
              min={1}
              max={MAX_PLAYERS}
              value={people}
              onChange={(e) => handlePlayersChange(Number(e.target.value))}
            />
          </label>

          <label className="input-block">
            <span className="label">Number of lanes</span>
            <input
              type="number"
              min={1}
              max={MAX_LANES}
              value={lanes}
              onChange={(e) => handleLaneChange(Number(e.target.value))}
            />
          </label>

          <p className="section-title">Shoes</p>

          <div className="shoe-list" id="shoes">
            {shoeSizes.map((value, index) => (
              <div className="shoe-row" key={`shoe-${index}`}>
                <label className="input-block">
                  <span className="label">Shoe size / Person {index + 1}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Euro 44"
                    value={value}
                    onChange={(e) =>
                      setShoeSizes((prev) => prev.map((shoe, idx) => (idx === index ? e.target.value : shoe)))
                    }
                    required
                  />
                </label>
                <button
                  type="button"
                  className="circle-button remove"
                  aria-label={`Remove shoe ${index + 1}`}
                  onClick={() => handleRemoveShoe(index)}
                  disabled={people <= 1}
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              className="circle-button add"
              aria-label="Add another player"
              onClick={handleAddShoe}
              disabled={people >= MAX_PLAYERS}
            >
              +
            </button>
          </div>

          <div className="cta-block">
            <p className="mini-hint">
              Your session: {dateDisplay}, {time}
            </p>
            {(formError || errorMessage) && <p className="error-text">{formError ?? errorMessage}</p>}
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'Sending...' : 'Striiiiiike!'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

