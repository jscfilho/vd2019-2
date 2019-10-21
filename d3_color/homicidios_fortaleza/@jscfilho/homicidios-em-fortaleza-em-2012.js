// https://observablehq.com/@jscfilho/homicidios-em-fortaleza-em-2012@84
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Homicídios em Fortaleza em 2012`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<code>css</code> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.0/css/bootstrap.min.css" integrity="sha384-PDle/QlgIONtM1aqA2Qemk5gPOE7wFq8+Em+G/hmo5Iq0CCmYZLv3fVRDJ4MMwEA" crossorigin="anonymous">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>`
)});
  main.variable(observer("buildvis")).define("buildvis", ["md","container"], function(md,container)
{
  let view = md`${container()}`
  
  return view
}
);
  main.variable(observer("map")).define("map", ["buildvis","L"], function(buildvis,L)
{
  buildvis;
  let mapInstance = L.map('mapid').setView([-3.792614,-38.515877], 12)
    L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
                attribution:  `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>,
 Map tiles by &copy; <a href="https://carto.com/attribution">CARTO</a>`,
                maxZoom: 18
                }).addTo(mapInstance)
  return mapInstance
}
);
  main.variable(observer("geojson")).define("geojson", ["L","info","map","bairros","style"], function(L,info,map,bairros,style)
{
  function highlightFeature(e) {
		let layer = e.target;
        //console.log(e.target)

		layer.setStyle({
					weight: 2,
					color: '#AAA',
					dashArray: '',
					fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}

		info.update(layer.feature);
	}
	let geoj;

	function resetHighlight(e) {
		geoj.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
					mouseover: highlightFeature,
					mouseout: resetHighlight,
					click: zoomToFeature
				});
	}
  geoj = L.geoJson(bairros, {
				style: style,
				onEachFeature: onEachFeature
		}).addTo(map)
  return geoj;
}
);
  main.variable(observer("legend")).define("legend", ["L","red_array","colorScale","red","d3","map"], function(L,red_array,colorScale,red,d3,map)
{
  let legend_control = L.control({position: 'bottomright'});

	legend_control.onAdd = function (map) {

		let div = L.DomUtil.create('div', 'info legend'),
        labels = [],
        n = red_array.length,
        from, to;

		for (let i = 0; i < n; i++) {
			let c = red_array[i]
            let fromto = colorScale.invertExtent(c);
			labels.push(
				'<i style="background:' + red[i] + '"></i> ' +
				d3.format("d")(fromto[0]) + (d3.format("d")(fromto[1]) ? '&ndash;' + d3.format("d")(fromto[1]) : '+'));
		}

		div.innerHTML = labels.join('<br>')
		return div
	}
  legend_control.addTo(map)
  return legend_control
}
);
  main.variable(observer("container")).define("container", function(){return(
function container() { 
  return `
<main role="main" class="container">
    <div class="row">
      <h3> Homicídios em Fortaleza em 2012</h3>
    </div>
    <div id="mapid" class='row'>
    </div>
   <p>Dados retirados do site da <a href="http://www.sspds.ce.gov.br/">SSPDS</a></p>
  </main>
 `
}
)});
  main.variable(observer("red_array")).define("red_array", ["d3"], function(d3){return(
d3.schemeReds[9]
)});
  main.variable(observer("colorScale")).define("colorScale", ["d3","red_array"], function(d3,red_array){return(
d3.scaleQuantize()
    .domain([0, 425.13])
    .range(red_array)
)});
  main.variable(observer("zoomToFeature")).define("zoomToFeature", ["map"], function(map){return(
function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds())
	}
)});
  main.variable(observer("info")).define("info", ["L","homicidesByName","map"], function(L,homicidesByName,map)
{
  // control that shows state info on hover
	let infoControl = L.control()

	infoControl.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	}

	infoControl.update = function (feat) {
			this._div.innerHTML = '<h5>Número de homicídios</h5>' +  (feat ?
				'<b>' + feat.properties.NOME + '</b><br />' + homicidesByName.get(feat.properties.NOME)[1] + ' homicídios/100.000 habitantes'
				: 'Passe o mouse sobre um bairro');
	}

	infoControl.addTo(map);
  return infoControl
}
);
  main.variable(observer("homicidesByName")).define("homicidesByName", ["d3"], function(d3){return(
d3.csv("https://gist.githubusercontent.com/emanueles/8ee225792454a78151d0842a10642a29/raw/9984e32effa99da3cea2ec87a7c9b7b231c71d3c/fortaleza_crimes_populacao.csv").then(function(data) {
    let bairrosMap = d3.map()
    data.forEach(function(d) {
      if(d.Populacao != -1)
        d.HomPop = ((d.Homicidios/d.Populacao)*100000).toFixed(2)
      else
        d.HomPop = 0
      
      bairrosMap.set(d.Bairro,[+d.Homicidios, d.HomPop])
    })
    return bairrosMap
  })
)});
  main.variable(observer("style")).define("style", ["colorScale","homicidesByName"], function(colorScale,homicidesByName){return(
function style(feature) {
		 return {
					weight: 1,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.6,
					fillColor: colorScale(homicidesByName.get(feature.properties.NOME)[1])
				};
	}
)});
  main.variable(observer("bairros")).define("bairros", ["d3"], function(d3){return(
d3.json("https://gist.githubusercontent.com/emanueles/f43681762385f250d533eabb35da6dac/raw/4d4541e92fb9ce69e692a7a3c291a4a538ae6b6a/FortalezaBairros.geojson")
)});
  main.variable(observer()).define(["html"], function(html){return(
html`Esta célula contém os estilos da Visualização
<style>
#mapid {
				width: 750px;
				height: 590px;
			}
			.info {
				padding: 6px 8px;
				font: 14px/16px Arial, Helvetica, sans-serif;
				background: white;
				background: rgba(255,255,255,0.8);
				box-shadow: 0 0 15px rgba(0,0,0,0.2);
				border-radius: 5px;
			}
			.info h4 {
				margin: 0 0 5px;
				color: #777;
			}

			.legend {
				text-align: left;
				line-height: 18px;
				color: #555;
			}
			.legend i {
				width: 18px;
				height: 18px;
				float: left;
				margin-right: 8px;
				opacity: 0.7;
			}
</style>`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("$")).define("$", ["require"], function(require){return(
require('jquery').then(jquery => {
  window.jquery = jquery;
  return require('popper@1.0.1/index.js').catch(() => jquery);
})
)});
  main.variable(observer("bootstrap")).define("bootstrap", ["require"], function(require){return(
require('bootstrap')
)});
  main.variable(observer("L")).define("L", ["require"], function(require){return(
require('leaflet@1.5.1')
)});
  return main;
}
