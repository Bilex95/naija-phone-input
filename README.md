# naija-phone-input

**The problem:** most signup forms reject perfectly valid Nigerian phone numbers. Users type `0803 123 4567`, `+2348031234567`, or `234-803-123-4567` — all the same number — and get "invalid phone number" for having the audacity to use spaces.

**The solution:** a phone field that accepts every reasonable way a Nigerian writes their number, normalizes it to E.164 (`+2348031234567`) behind the scenes, validates the actual network prefix, and tells the user *what's wrong* instead of just turning red.

## Use it

Open `index.html`. Try: `08031234567`, `+234 803 123 4567`, `0703-123-4567`, and some invalid ones like `0203...` or a 9-digit number. Watch the messages.

## How it's built

Vanilla JS with a normalize-then-validate pipeline: strip formatting → resolve the `0`/`+234`/`234` prefix forms to one canonical shape → check length → check the network prefix against known MTN/Glo/Airtel/9mobile ranges. Errors are announced to screen readers via `aria-live`, and validation runs on blur (not on every keystroke) so users aren't scolded mid-typing.

## Contribute

- Add a network badge (MTN/Glo/Airtel/9mobile) shown when the number is valid
- Extend the prefix table — new ranges get allocated; the current table is a solid start, not gospel
- Add a `<form>` submit handler demo that posts the normalized E.164 value

---

Scaffolded by an automated weekly pipeline, then refined by hand — see the factory repo for how it works.
