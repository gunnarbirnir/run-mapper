#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Calculate haversine distance between two coordinates in kilometers
 */
function haversineDistance(coord1, coord2) {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate elevation gain and loss from elevation values
 */
function calculateElevationStats(elevations) {
  if (elevations.length < 2) {
    return { gain: 0, loss: 0 };
  }

  let totalGain = 0;
  let totalLoss = 0;

  for (let i = 0; i < elevations.length - 1; i++) {
    const diff = elevations[i + 1] - elevations[i];
    if (diff > 0) {
      totalGain += diff;
    } else {
      totalLoss += Math.abs(diff);
    }
  }

  return { gain: totalGain, loss: totalLoss };
}

/**
 * Generate a unique ID from the file path or content
 */
function generateId(filePath) {
  const basename = path.basename(filePath, '.gpx');
  // Create a hash from the basename for a consistent ID
  return crypto
    .createHash('md5')
    .update(basename)
    .digest('hex')
    .substring(0, 16);
}

/**
 * Parse GPX file and extract track points
 */
function parseGpx(gpxContent) {
  const trackPoints = [];
  
  // Regular expression to match trkpt elements with lat, lon, and ele
  // Matches: <trkpt lat="..." lon="..."> ... <ele>...</ele> ... </trkpt>
  const trkptRegex = /<trkpt\s+lat="([^"]+)"\s+lon="([^"]+)">([\s\S]*?)<\/trkpt>/g;
  
  let match;
  while ((match = trkptRegex.exec(gpxContent)) !== null) {
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[2]);
    const content = match[3];
    
    // Extract elevation from <ele> tag
    const eleMatch = content.match(/<ele>([^<]+)<\/ele>/);
    const elevation = eleMatch ? parseFloat(eleMatch[1]) : 0;
    
    // GPX uses lat/lon, but we need to convert to [lng, lat] for consistency
    trackPoints.push({
      lat,
      lon,
      elevation,
    });
  }
  
  return trackPoints;
}

/**
 * Calculate bounding box from track points
 */
function calculateBoundingBox(trackPoints) {
  if (trackPoints.length === 0) {
    return [0, 0, 0, 0];
  }
  
  let minLng = trackPoints[0].lon;
  let maxLng = trackPoints[0].lon;
  let minLat = trackPoints[0].lat;
  let maxLat = trackPoints[0].lat;
  
  for (const point of trackPoints) {
    minLng = Math.min(minLng, point.lon);
    maxLng = Math.max(maxLng, point.lon);
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
  }
  
  return [minLng, minLat, maxLng, maxLat];
}

/**
 * Transform GPX file to RunRoute format
 */
function transformGpxToRunRoute(gpxContent, filePath) {
  const trackPoints = parseGpx(gpxContent);
  
  if (trackPoints.length === 0) {
    throw new Error('No track points found in the GPX file');
  }
  
  // Extract coordinates and elevations
  const routePoints = [];
  let totalDistance = 0;
  let prevCoord = null;
  const elevations = [];
  
  trackPoints.forEach((point) => {
    // Convert to [lng, lat] format
    const coord = [point.lon, point.lat];
    const elevation = point.elevation !== undefined ? point.elevation : 0;
    
    if (prevCoord) {
      totalDistance += haversineDistance(prevCoord, coord);
    }
    
    routePoints.push({
      coordinates: coord,
      elevation: elevation,
    });
    
    elevations.push(elevation);
    prevCoord = coord;
  });
  
  // Calculate elevation stats
  const { gain, loss } = calculateElevationStats(elevations);
  
  // Generate ID
  const routeId = generateId(filePath);
  
  // Calculate bounding box
  const boundingBox = calculateBoundingBox(trackPoints);
  
  // Build RunRoute
  const runRoute = {
    id: routeId,
    distance: totalDistance,
    elevationGain: gain,
    elevationLoss: loss,
    boundingBox: boundingBox,
    points: routePoints,
  };
  
  return runRoute;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error(
      'Usage: node processGpx.js <input-gpx-file> [output-json-file]',
    );
    process.exit(1);
  }
  
  const inputFile = args[0];
  
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`);
    process.exit(1);
  }
  
  try {
    // Read input GPX file
    const gpxContent = fs.readFileSync(inputFile, 'utf8');
    
    // Transform to RunRoute format
    const runRoute = transformGpxToRunRoute(gpxContent, inputFile);
    
    // Use route-{routeId}.json as default output filename if not specified
    const outputFile = args[1] || `route-${runRoute.id}.json`;
    
    // Write output
    fs.writeFileSync(outputFile, JSON.stringify(runRoute, null, 2), 'utf8');
    
    console.log(`✓ Successfully transformed ${inputFile}`);
    console.log(`✓ Output written to ${outputFile}`);
    console.log(`\nRoute details:`);
    console.log(`  ID: ${runRoute.id}`);
    console.log(`  Distance: ${runRoute.distance.toFixed(2)} km`);
    console.log(`  Elevation Gain: ${runRoute.elevationGain.toFixed(1)} m`);
    console.log(`  Elevation Loss: ${runRoute.elevationLoss.toFixed(1)} m`);
    console.log(`  Route Points: ${runRoute.points.length}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  transformGpxToRunRoute,
  parseGpx,
  haversineDistance,
  calculateElevationStats,
  calculateBoundingBox,
};
