var _ = require('lodash')

module.exports = function(fc){
  var polys = _(fc).cloneDeep()
  polys.features = []
  _(fc.features).each(function(feature){
    if(feature.geometry.type === 'Polygon'){
      polys.features.push(feature)
    }
    else if(feature.geometry.type === 'MultiPolygon'){
      _(feature.geometry.coordinates).each(function(polyCoords){
        var poly = _(polyTemplate).cloneDeep()
        poly.geometry.coordinates = polyCoords
        poly.properties = feature.properties
        polys.features.push(poly)
      })
    }
    else if(feature.geometry.type === 'GeometryCollection'){
      _(feature.geometries).each(function(geometry){
        if(geometry.type === 'Polygon'){
          var poly = _(polyTemplate).cloneDeep()
          poly.geometry = geometry
          poly.properties = feature.properties
          polys.features.push(poly)
        }
        else if(geometry.type === 'MultiPolygon'){
          _(geometry.coordinates).each(function(polyCoords){
            var poly = _(polyTemplate).cloneDeep()
            poly.geometry = {
              type: 'Polygon',
              coordinates: []
            }
            poly.properties = feature.properties
            poly.geometry.coordinates = polyCoords
            polys.features.push(poly)
          })
        }
      })
    }
  })

  return polys
}

var polyTemplate = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: []
  }
}
