# V2 changes and verification — 2026-10-10

## Changes
- Preserve the existing private Site and version-one local storage key.
- Persist guest, route, guest sequence, coins, stickers, room settings, decorations, placed items and birthday draft.
- Show feedback within the active dialog; correct room floor and repeat-guest copy.
- Birthday family story: birthday → restaurant → whole-house slide → checkout.
- Birthday scene with guests, retained decoration and persistent illustrated memory cards; wedding memories.
- Three room themes; four one-time purchases reusable across rooms; no negative balance.
- Whole-house six-floor slide, manual/automatic stars, two speeds, pause/resume, best score, reduced motion behavior.
- Opt-in Web Audio: stars, wind, turns, landing, placement, bubbles, ducks, parking, discoveries, camera, checkout. Master volume, separate narration; background suspension.
- Memory cards visibly lock during match resolution; wedding requires all participants; fitness target matches visible region and repeated presses are rate limited.

## Browser checks completed before publication
- Fresh startup with zero coins; no startup errors.
- Check in 701, change to ocean theme, unpack; reload retained guest, room theme and unpacked state.
- Finish birthday seating/candles; memory retained across reload.
- Incorrect restaurant meal displays specific missing foods inside dialog; correction continues story.
- Slow slide with audio enabled; pause/resume; collected 6/6; route advances to checkout.
- Three-heart checkout awards 50 coins after corrected service.
- Buy plant for 15; reload shows 35 coins and plant remains placed.

## Limits
- Browser interaction and audio startup checked; no physical iPad/Safari or human loudspeaker listening test.
- Data remains browser-local, not cross-device cloud storage. Old version did not save guest sessions, so previously lost sessions cannot be recovered.
