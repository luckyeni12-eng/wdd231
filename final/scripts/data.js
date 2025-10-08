// data.js
export async function fetchPlants() {
  try {
    const resp = await fetch('data/plants.json', {cache: "no-store"});
    if (!resp.ok) throw new Error(`Failed to load plants: ${resp.status}`);
    const json = await resp.json();
    // ensure it's an array
    if (!Array.isArray(json)) throw new Error('Invalid data format');
    return json;
  } catch (err) {
    console.error(err);
    // rethrow so callers can show user-friendly messages
    throw err;
  }
}