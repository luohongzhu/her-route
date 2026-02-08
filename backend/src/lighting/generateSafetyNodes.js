import ngeohash from "ngeohash";

function distanceMeters(a, b) {
  const METERS_PER_DEGREE = 111_000; // approx

  return Math.sqrt(
    Math.pow((a.lat - b.lat) * METERS_PER_DEGREE, 2) +
    Math.pow((a.lng - b.lng) * METERS_PER_DEGREE, 2)
  );
}

export function generateSafetyNodes(grid, lamps) {
    console.log("Grid sample:", grid.slice(0, 5));
  return grid.map(point => {
    const lampCount = lamps.filter(l =>
      distanceMeters(point, { lat: l.lat, lng: l.lon }) < 90
    ).length;

    const lightingScore = Math.min(lampCount / 5, 1);
    const safetyScore = lampCount === 0 ? 0.1 : lightingScore; // lighting-only MVP

    return {
      lat: point.lat,
      lng: point.lng,
      geohash: ngeohash.encode(point.lat, point.lng, 7), // ~150m precision
      lampCount,
      lightingScore,
      userVoteSum: 0,
      userVoteCount: 0,
      safetyScore
    };
  });
}
