/** GeoJSON / Braelo listing coordinates are always [longitude, latitude]. */

export const GEOJSON_LNG_LAT = [74.284469, 31.4494997];

export function toLatLng(coordinates) {
  const pair = Array.isArray(coordinates)
    ? coordinates
    : coordinates?.coordinates;
  if (!Array.isArray(pair) || pair.length < 2) return null;
  const [lng, lat] = pair;
  return { lat, lng };
}

export function toGeoJsonPoint(lat, lng) {
  return {
    type: "Point",
    coordinates: [lng, lat],
  };
}

export function fallbackGeoJsonString() {
  return JSON.stringify({
    type: "Point",
    coordinates: GEOJSON_LNG_LAT,
  });
}
