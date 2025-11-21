# Individuell examination: Strajk bowling

React + Typescript 

Strajk Bowling är en mobilanpassad React-app där gäster bokar datum, tid, antal spelare och skostorlekar för en bowlingkväll.
Appen pratar med Strajks backend, visar en personlig bekräftelse med totalpris och hanterar automatiskt om servern tillfälligt nekar bokningen.

## Översikt
- `src/types.ts` - samlar alla TypeScript-typer för bokningsformuläret och API-responset.
- `src/api/booking.ts` -- hämtar API-nyckeln, skickar bokningen till backend och normaliserar svaret.
- `src/App.tsx` - huvudkomponenten som växlar mellan bokning, laddning och bekräftelse och menyn.
- `src/components/BookingForm.*` - bokningsformuläret med validering av datum/tid, spelare och skor.
- `src/components/ConfirmationView.*` - visar pris, bokningsnummer m.m.
- `src/components/MenuOverlay.*` -hamburgermenyn och overlay.
- `src/components/LoadingScreen.*` - fullscreen loader som visas medan vi väntar på API.
- `src/index.css` och `src/App.css` - global stilar och app-skalet.
