//select/create boundary area and connect/import satellite data set(sentinel api) into gee

var S2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") 
.filterDate('2024-02-01','2024-02-28')
.filterBounds(AOI)
.median();
print(S2);

//COMPUTE NDVI
var NIR=S2.select('B8');
var RED=S2.select('B4');

var ndvi= NIR.subtract(RED).divide(NIR.add(RED)).rename('NDVI');
var NDVI=ndvi.clip(AOI);
var ndviparam = {min : -1 , max : 1 , palette : ['red','yellow','green']};
Map.addLayer(NDVI,ndviparam,'NDVI');




// RGB composite
var RGB = S2.select(['B4', 'B3', 'B2']); // Selecting Red, Green, and Blue bands
var RGBVis = {
  min: 0.0,
  max: 3000,
  bands: ['B4', 'B3', 'B2']
};

var ndviparam = {min : -1 , max : 1 , palette : ['red','yellow','green']};

// Adding layers to the map
Map.addLayer(NDVI, ndviparam, 'NDVI');
Map.addLayer(RGB, RGBVis, 'RGB');

// Export the NDVI and RGB composite
Export.image.toDrive({
  image: NDVI.toFloat(),
  description: 'NDVI_Panama_2024',
  folder: 'GEE_exports',
  fileNamePrefix: 'NDVI_Panama_2024',
  region: AOI,
  scale: 10, 
});

Export.image.toDrive({
  image: RGB.toFloat(),
  description: 'RGB_Panama_2024',
  folder: 'GEE_exports',
  fileNamePrefix: 'RGB_Panama_2024',
  region: AOI,
  scale: 10,
});