// naija-phone-input — normalize first, judge second.
// Pipeline: strip formatting -> canonicalize prefix -> length check -> network prefix check.

const input = document.getElementById("phone");
const msg = document.getElementById("phone-msg");
const normalizedEl = document.getElementById("normalized");

// Known Nigerian mobile prefixes (the 3 digits after the leading 0).
// Not exhaustive forever — NCC allocates new ranges — but covers the majors.
const PREFIXES = new Set([
  // MTN
  "803", "806", "703", "706", "813", "816", "810", "814", "903", "906", "913", "916",
  // Glo
  "805", "807", "705", "815", "811", "905", "915",
  // Airtel
  "802", "808", "708", "812", "701", "902", "901", "904", "907", "912",
  // 9mobile
  "809", "817", "818", "908", "909",
]);

function normalize(raw) {
  // 1. Keep digits and a leading +
  let s = raw.trim().replace(/[^\d+]/g, "");
  if (s.startsWith("+")) s = s.slice(1);

  // 2. Resolve the three ways people write the country prefix
  if (s.startsWith("234")) s = "0" + s.slice(3);
  // now expect local format: 0XXXXXXXXXX (11 digits)

  return s;
}

function validate(raw) {
  if (!raw.trim()) return { ok: false, reason: "" }; // empty: say nothing yet

  const s = normalize(raw);

  if (!/^\d+$/.test(s)) {
    return { ok: false, reason: "Only digits, spaces, dashes and a leading + are allowed." };
  }
  if (!s.startsWith("0")) {
    return { ok: false, reason: "Start with 0 (e.g. 0803…) or the +234 country code." };
  }
  if (s.length !== 11) {
    const diff = 11 - s.length;
    return {
      ok: false,
      reason: diff > 0 ? `Too short — ${diff} digit${diff === 1 ? "" : "s"} missing.` : `Too long — remove ${-diff} digit${diff === -1 ? "" : "s"}.`,
    };
  }
  const prefix = s.slice(1, 4);
  if (!PREFIXES.has(prefix)) {
    return { ok: false, reason: `0${prefix} isn't a recognized Nigerian mobile prefix.` };
  }
  return { ok: true, e164: "+234" + s.slice(1) };
}

function render(result) {
  input.classList.toggle("ok", result.ok);
  input.classList.toggle("err", !result.ok && result.reason !== "");
  msg.className = result.ok ? "ok" : "err";
  msg.textContent = result.ok ? "Looks good ✓" : result.reason;
  normalizedEl.textContent = result.ok ? result.e164 : "—";
}

// Validate on blur (don't scold mid-typing)…
input.addEventListener("blur", () => render(validate(input.value)));
// …but once a field has an error, update live so the fix is instantly rewarded.
input.addEventListener("input", () => {
  if (input.classList.contains("err") || input.classList.contains("ok")) {
    render(validate(input.value));
  }
});
