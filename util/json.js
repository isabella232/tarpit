module.exports = json

function json (o) {
  try {
    return JSON.parse(o)
  } catch (e) {}
}
