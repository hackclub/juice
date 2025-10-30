function escapeAirtableString(str) {
  return String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function normalizeEmail(email) {
  const rawEmail = Array.isArray(email) ? email[0] : email;
  return String(rawEmail || '').trim().toLowerCase();
}

const simpleEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return simpleEmailRegex.test(email);
}

module.exports = {
  escapeAirtableString,
  normalizeEmail,
  isValidEmail,
};
