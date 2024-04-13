var AOI = 
    /* color: #98ff00 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[81.79113201333112, 6.783449259898756],
          [81.79113201333112, 6.769982756227488],
          [81.80563739968366, 6.769982756227488],
          [81.80563739968366, 6.783449259898756]]], null, false);
          
// Initialize the Earth Engine API
//ee.initialize();

// area of interest (AOI)
var aoi = ee.Geometry.Rectangle([-74.05, 40.70, -73.85, 40.90]);

// time range for Sentinel data
var start_date = '2020-01-01';
var end_date = '2020-12-31';

// Access Sentinel data
var sentinel_collection = ee.ImageCollection('COPERNICUS/S2').filterBounds(aoi).filterDate(start_date, end_date);

// Preprocess the data
var composite = sentinel_collection.median().clip(aoi);

// Analyze land cover change
var pre_period = sentinel_collection.filterDate('2020-01-01', '2020-06-30').median();
var post_period = sentinel_collection.filterDate('2020-07-01', '2020-12-31').median();
var ndvi_pre = pre_period.normalizedDifference(['B8', 'B4']);
var ndvi_post = post_period.normalizedDifference(['B8', 'B4']);
var ndvi_change = ndvi_post.subtract(ndvi_pre);

// Estimate soil organic carbon (SOC) changes
var soc_change = ndvi_change.multiply(0.1);

// Calculate carbon credits
var total_soc_change = soc_change.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30
});
var total_soc_credits = total_soc_change.get('nd');

print("Total Soil Organic Carbon Credits (in tonnes of CO2e):", total_soc_credits);