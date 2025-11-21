import './MenuOverlay.css'

interface MenuOverlayProps {
  open: boolean
  onClose: () => void
}

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {

  // Stänger menyn om användaren klickar utanför panelen
  const handleOverlayClick = () => {
    if (open) {
      onClose()
    }
  }

  return (
    <div className={`menu-overlay ${open ? 'menu-overlay--open' : ''}`} onClick={handleOverlayClick}>
      <div className="menu-panel" onClick={(event) => event.stopPropagation()}>
        
        {/* Enkel meny, klick stänger menyn */}
        <button className="menu-close" onClick={onClose} aria-label="Close menu">
          &times;
        </button>
        <nav>
          <p className="menu-label">Menu</p>
          <a href="#booking" onClick={onClose}>
            Book a lane
          </a>
          <a href="#shoes" onClick={onClose}>
            Shoe sizes
          </a>
          <a href="#confirmation" onClick={onClose}>
            Confirmation
          </a>
        </nav>
      </div>
    </div>
  )
}

