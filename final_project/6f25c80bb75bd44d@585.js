// https://observablehq.com/@jscfilho/projeto-final-de-vd-2019@585
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Projeto Final de VD - 2019`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`#### Título: Desenvolvimento humano e economia no Brasil`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
O que é o IDHM? O Índice de Desenvolvimento Humano Municipal compreende indicadores de três dimensões do desenvolvimento humano: longevidade, educação e renda. O índice varia de 0 a 1. Quanto mais próximo de 1, maior o desenvolvimento humano. 

Em 2010, o IDHM no Brasil foi considerado Alto (0,727) com 33,9% dos municípios brasileiros nesta faixa de desenvolvimento humano.

As faixas de desenvolvimento humano são calculadas tendo como base o Índice de Desenvolvimento Humano (IDHM) dos 5.565 municípios pesquisados pelo Censo do IBGE.
`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<code></code> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.0/css/bootstrap.min.css" integrity="sha384-PDle/QlgIONtM1aqA2Qemk5gPOE7wFq8+Em+G/hmo5Iq0CCmYZLv3fVRDJ4MMwEA" crossorigin="anonymous">
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
  main.variable(observer()).define(["md"], function(md){return(
md`O gráfico de barras abaixo detalha os valores do IDHM vistos no mapa acima. Nesse gráfico podemos observar as três dimensões do desenvolvimento humano: 
- Educação
- Longevidade
- Renda

Melhores índicies reportados:
- Melhor Educação(0.742): Distrito Federal
- Melhor Longevidade(0.873): Distrito Federal
- Melhor Renda(0.863): Distrito Federal

Piores índices reportados:
- Pior Educação(0.436): Amazonas
- Pior Longevidade(0.739): Alagoas
- Pior Renda(0.531): Maranhão

`
)});
  main.variable(observer("chart_detailed_idhm")).define("chart_detailed_idhm", ["d3","DOM","d_idhm_width","d_idhm_height","d_idhm_data","d_idhm_x0","d_idhm_groupKey","d_idhm_keys","d_idhm_x1","d_idhm_y","d_idhm_color","d_idhm_xAxis","d_idhm_yAxis","d_idhm_legend"], function(d3,DOM,d_idhm_width,d_idhm_height,d_idhm_data,d_idhm_x0,d_idhm_groupKey,d_idhm_keys,d_idhm_x1,d_idhm_y,d_idhm_color,d_idhm_xAxis,d_idhm_yAxis,d_idhm_legend)
{
  const svg = d3.select(DOM.svg(d_idhm_width, d_idhm_height));

  svg.append("g")
    .selectAll("g")
    .data(d_idhm_data)
    .join("g")
      .attr("transform", d => `translate(${d_idhm_x0(d[d_idhm_groupKey])},0)`)
    .selectAll("rect")
    .data(d => d_idhm_keys.map(key => ({key, value: d[key]})))
    .join("rect")
      .attr("x", d => d_idhm_x1(d.key))
      .attr("y", d => d_idhm_y(d.value))
      .attr("width", d_idhm_x1.bandwidth())
      .attr("height", d => d_idhm_y(0) - d_idhm_y(d.value))
      .attr("fill", d => d_idhm_color(d.key));

  svg.append("g")
      .call(d_idhm_xAxis);

  svg.append("g")
      .call(d_idhm_yAxis);

  svg.append("g")
      .call(d_idhm_legend);

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`# Balanço econômico dos estados`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`No gráfico abaixo temos uma visão geral sobre o balanço econômico geral por estado. A cor do círculo indica se aquele estado arrecadou mais do que gastou ou o contrário. Já o raio indica o tamanho do superavit ou do déficit.

Ao passar o mouse sobre um estado, podemos ver exatamente o tanto que aquele estado arrecadou em impostos e o montante gasto por o mesmo. 
`
)});
  main.variable(observer("chart33")).define("chart33", ["bc_pack","bc_data","d3","bc_width","bc_height","DOM","bc_color"], function(bc_pack,bc_data,d3,bc_width,bc_height,DOM,bc_color)
{

    const root = bc_pack(bc_data);

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, bc_width, bc_height])
        .attr("font-size", 8)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle");
  
  svg.append("circle").attr("cx",80).attr("cy",50).attr("r", 6).style("fill", "#08306b").attr("fill-opacity", 0.7)
  svg.append("circle").attr("cx",80).attr("cy",80).attr("r", 6).style("fill", "#a31919").attr("fill-opacity", 0.7)
  svg.append("text").attr("x", 50).attr("y", 50).text("Superavit").style("font-size", "10px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 50).attr("y", 80).text("Déficit").style("font-size", "10px").attr("alignment-baseline","middle")

    const leaf = svg.selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

    leaf.append("circle")
        .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
        .attr("r", d => (d.r))
        .attr("fill-opacity", 0.7)
        .attr("fill", d => bc_color(d.data.group));

    leaf.append("text")
        //.attr("clip-path", d => d.clipUid)
        .selectAll("tspan")
        .data(d => `${d.data["name"]}`)
        .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
        .text(d => d);

    leaf.append("title")
        .attr("font-size", 30)
        .text(d => `Estado: ${d.data["name"]}\n`+
                   `Impostos: R$ ${Math.floor(d.data["TAXES"]*1000000)}\n`+
                   `Gastos: R$ ${Math.floor(d.data["MUN_EXPENDIT"]*1000000)}\n`+
                   `Líquido: R$ ${Math.floor(d.value)*1000000}`);
  
  // svg.append("g")
  //     .call(bubble_legend);

    return svg.node();
  }
);
  main.variable(observer()).define(["md"], function(md){return(
md`# Indústria`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`O gráfico de barras abaixo possibilita visualisar concentração industrial por estado. São Paulo é disparadamente o estado com maior atividade industrial. Esse fator contribui bastante para a arrecadação de impostos.`
)});
  main.variable(observer("chart_industrial")).define("chart_industrial", ["d3","DOM","industrial_width","industrial_height","industrial_data","industrial_x0","industrial_groupKey","industrial_keys","industrial_x1","industrial_y","industrial_color","industrial_xAxis","industrial_yAxis","industrial_legend"], function(d3,DOM,industrial_width,industrial_height,industrial_data,industrial_x0,industrial_groupKey,industrial_keys,industrial_x1,industrial_y,industrial_color,industrial_xAxis,industrial_yAxis,industrial_legend)
{
  const svg = d3.select(DOM.svg(industrial_width, industrial_height));

  svg.append("g")
    .selectAll("g")
    .data(industrial_data)
    .join("g")
      .attr("transform", d => `translate(${industrial_x0(d[industrial_groupKey])},0)`)
    .selectAll("rect")
    .data(d => industrial_keys.map(key => ({key, value: d[key]})))
    .join("rect")
      .attr("x", d => industrial_x1(d.key))
      .attr("y", d => industrial_y(d.value))
      .attr("width", industrial_x1.bandwidth())
      .attr("height", d => industrial_y(0) - industrial_y(d.value))
      .attr("fill", d => industrial_color(d.key));

  svg.append("g")
      .call(industrial_xAxis);

  svg.append("g")
      .call(industrial_yAxis);

  svg.append("g")
      .call(industrial_legend);

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`# Agricultura`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`O gráfico de barras abaixo possibilita visualisar a quantidade de riqueza vinda da atividade agrícola por estado. São Paulo também é o estado com maior produção agrícola, seguido por o estado de Mato Grosso.`
)});
  main.variable(observer("chart_agro")).define("chart_agro", ["d3","DOM","agro_width","agro_height","agro_data","agro_x0","agro_groupKey","agro_keys","agro_x1","agro_y","agro_color","agro_xAxis","agro_yAxis","agro_legend"], function(d3,DOM,agro_width,agro_height,agro_data,agro_x0,agro_groupKey,agro_keys,agro_x1,agro_y,agro_color,agro_xAxis,agro_yAxis,agro_legend)
{
  const svg = d3.select(DOM.svg(agro_width, agro_height));

  svg.append("g")
    .selectAll("g")
    .data(agro_data)
    .join("g")
      .attr("transform", d => `translate(${agro_x0(d[agro_groupKey])},0)`)
    .selectAll("rect")
    .data(d => agro_keys.map(key => ({key, value: d[key]})))
    .join("rect")
      .attr("x", d => agro_x1(d.key))
      .attr("y", d => agro_y(d.value))
      .attr("width", agro_x1.bandwidth())
      .attr("height", d => agro_y(0) - agro_y(d.value))
      .attr("fill", d => agro_color(d.key));

  svg.append("g")
      .call(agro_xAxis);

  svg.append("g")
      .call(agro_yAxis);

  svg.append("g")
      .call(agro_legend);

  return svg.node();
}
);
  main.variable(observer("agro_legend")).define("agro_legend", ["width","agro_color"], function(width,agro_color){return(
svg => {
  const g = svg
      .attr("transform", `translate(${width},0)`)
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g")
    .data(agro_color.domain().slice().reverse())
    .join("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

  g.append("rect")
      .attr("x", -19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", agro_color);

  g.append("text")
      .attr("x", -24)
      .attr("y", 9.5)
      .attr("dy", "0.35em")
      .text(d => d);
}
)});
  main.variable(observer("agro_x0")).define("agro_x0", ["d3","agro_data","agro_groupKey","agro_margin","width"], function(d3,agro_data,agro_groupKey,agro_margin,width){return(
d3.scaleBand()
    .domain(agro_data.map(d => d[agro_groupKey]))
    .rangeRound([agro_margin.left, width - agro_margin.right])
    .paddingInner(0.1)
)});
  main.variable(observer("agro_x1")).define("agro_x1", ["d3","agro_keys","agro_x0"], function(d3,agro_keys,agro_x0){return(
d3.scaleBand()
    .domain(agro_keys)
    .rangeRound([0, agro_x0.bandwidth()])
    .padding(0.05)
)});
  main.variable(observer("agro_y")).define("agro_y", ["d3","agro_height","agro_margin"], function(d3,agro_height,agro_margin){return(
d3.scaleLinear()
    .domain([0, 53141105]).nice()
    .rangeRound([agro_height - agro_margin.bottom, agro_margin.top])
)});
  main.variable(observer("agro_color")).define("agro_color", ["d3"], function(d3){return(
d3.scaleOrdinal()
    .range(["#a05d56"])
)});
  main.variable(observer("agro_xAxis")).define("agro_xAxis", ["agro_height","agro_margin","d3","agro_x0"], function(agro_height,agro_margin,d3,agro_x0){return(
g => g
    .attr("transform", `translate(0,${agro_height - agro_margin.bottom})`)
    .call(d3.axisBottom(agro_x0).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer("agro_yAxis")).define("agro_yAxis", ["agro_margin","d3","agro_y","agro_data"], function(agro_margin,d3,agro_y,agro_data){return(
g => g
    .attr("transform", `translate(${agro_margin.left},0)`)
    .call(d3.axisLeft(agro_y).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(agro_data.y))
)});
  main.variable(observer("agro_data")).define("agro_data", ["d3"], function(d3){return(
Object.assign(d3.csv("https://gist.githubusercontent.com/jscfilho/4f6516e22882e1fb5b63db332780997b/raw/d126c7b417e9be7970004e692a0ff20d7f45b05d/agro.csv"))
)});
  main.variable(observer("agro_groupKey")).define("agro_groupKey", ["agro_data"], function(agro_data){return(
agro_data.columns[0]
)});
  main.variable(observer("agro_keys")).define("agro_keys", ["agro_data"], function(agro_data){return(
agro_data.columns.slice(1)
)});
  main.variable(observer("agro_margin")).define("agro_margin", function(){return(
{top: 10, right: 10, bottom: 20, left: 40}
)});
  main.variable(observer("agro_height")).define("agro_height", function(){return(
500
)});
  main.variable(observer("agro_width")).define("agro_width", function(){return(
1200
)});
  main.variable(observer("industrial_legend")).define("industrial_legend", ["width","industrial_color"], function(width,industrial_color){return(
svg => {
  const g = svg
      .attr("transform", `translate(${width},0)`)
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g")
    .data(industrial_color.domain().slice().reverse())
    .join("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

  g.append("rect")
      .attr("x", -19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", industrial_color);

  g.append("text")
      .attr("x", -24)
      .attr("y", 9.5)
      .attr("dy", "0.35em")
      .text(d => d);
}
)});
  main.variable(observer("industrial_x0")).define("industrial_x0", ["d3","industrial_data","industrial_groupKey","industrial_margin","width"], function(d3,industrial_data,industrial_groupKey,industrial_margin,width){return(
d3.scaleBand()
    .domain(industrial_data.map(d => d[industrial_groupKey]))
    .rangeRound([industrial_margin.left, width - industrial_margin.right])
    .paddingInner(0.1)
)});
  main.variable(observer("industrial_x1")).define("industrial_x1", ["d3","industrial_keys","industrial_x0"], function(d3,industrial_keys,industrial_x0){return(
d3.scaleBand()
    .domain(industrial_keys)
    .rangeRound([0, industrial_x0.bandwidth()])
    .padding(0.05)
)});
  main.variable(observer("industrial_y")).define("industrial_y", ["d3","industrial_height","industrial_margin"], function(d3,industrial_height,industrial_margin){return(
d3.scaleLinear()
    .domain([0, 1551113]).nice()
    .rangeRound([industrial_height - industrial_margin.bottom, industrial_margin.top])
)});
  main.variable(observer("industrial_color")).define("industrial_color", ["d3"], function(d3){return(
d3.scaleOrdinal()
    .range(["#6b486b", "#a05d56"])
)});
  main.variable(observer("industrial_xAxis")).define("industrial_xAxis", ["industrial_height","industrial_margin","d3","industrial_x0"], function(industrial_height,industrial_margin,d3,industrial_x0){return(
g => g
    .attr("transform", `translate(0,${industrial_height - industrial_margin.bottom})`)
    .call(d3.axisBottom(industrial_x0).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer("industrial_yAxis")).define("industrial_yAxis", ["industrial_margin","d3","industrial_y","industrial_data"], function(industrial_margin,d3,industrial_y,industrial_data){return(
g => g
    .attr("transform", `translate(${industrial_margin.left},0)`)
    .call(d3.axisLeft(industrial_y).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(industrial_data.y))
)});
  main.variable(observer("industrial_data")).define("industrial_data", ["d3"], function(d3){return(
Object.assign(d3.csv("https://gist.githubusercontent.com/jscfilho/4f6516e22882e1fb5b63db332780997b/raw/d669ecd2363136fcf0ae910fdf23664605afc273/COMP_TOT_per_state.csv"))
)});
  main.variable(observer("industrial_groupKey")).define("industrial_groupKey", ["industrial_data"], function(industrial_data){return(
industrial_data.columns[0]
)});
  main.variable(observer("industrial_keys")).define("industrial_keys", ["industrial_data"], function(industrial_data){return(
industrial_data.columns.slice(1)
)});
  main.variable(observer("industrial_margin")).define("industrial_margin", function(){return(
{top: 10, right: 10, bottom: 20, left: 40}
)});
  main.variable(observer("industrial_height")).define("industrial_height", function(){return(
500
)});
  main.variable(observer("industrial_width")).define("industrial_width", function(){return(
1200
)});
  main.variable(observer("map")).define("map", ["buildvis","L"], function(buildvis,L)
{
  buildvis;
  let mapInstance = L.map('mapid').setView([-12,-54], 4)
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
  main.variable(observer("legend")).define("legend", ["L","blue_array","colorScale","map"], function(L,blue_array,colorScale,map)
{
  let legend_control = L.control({position: 'bottomright'});

	legend_control.onAdd = function (map) {

		let div = L.DomUtil.create('div', 'info legend'),
        labels = [],
        n = 9,
        from, to;
    
    let legend_texts = ["Médio", "Alto", "Muito Alto"];

		for (let i = 3; i < n; i++) {
			let c = blue_array[i];
      let fromto = colorScale.invertExtent(c);
      
			labels.push(
				'<i style="background:' + blue_array[i] + '"></i> ' +
        (fromto[0].toFixed(3)) + ((fromto[1].toFixed(3)) ? '&ndash;' + (fromto[1].toFixed(3)) : '+'));
        
        
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
      <h3>Índice de Desenvolvimento Humano - 2010</h3>
    </div>
    <div id="mapid" class='row'>
    </div>
   <p>Dados retirados do site <a href="https://www.kaggle.com/crisparada/brazilian-cities">Kaggle</a></p>
  </main>
 `
}
)});
  main.variable(observer("blue_array")).define("blue_array", ["d3"], function(d3){return(
d3.schemeBlues[9]
)});
  main.variable(observer("colorScale")).define("colorScale", ["d3","blue_array"], function(d3,blue_array){return(
d3.scaleQuantize()
    .domain([0.4, 0.82])
    .range(blue_array)
)});
  main.variable(observer("zoomToFeature")).define("zoomToFeature", ["map"], function(map){return(
function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds())
	}
)});
  main.variable(observer("info")).define("info", ["L","idhm_by_sigla","map"], function(L,idhm_by_sigla,map)
{
  // control that shows state info on hover
	let infoControl = L.control()

	infoControl.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	}

	infoControl.update = function (feat) {
			this._div.innerHTML = '<h5>IDH-M</h5>' +  (feat ?
				'<b>' + feat.properties["sigla"] + '</b><br />' + idhm_by_sigla.get(feat.properties["sigla"]) : 'Passe o mouse sobre um estado');
	}

	infoControl.addTo(map);
  return infoControl
}
);
  main.variable(observer("idhm_by_sigla")).define("idhm_by_sigla", ["d3"], function(d3){return(
d3.csv("https://gist.githubusercontent.com/jscfilho/4f6516e22882e1fb5b63db332780997b/raw/a75d1156bc01b347db666e1081faaa57b9b89040/idem_per_state.csv").then(function(data) {
    let stateMap = d3.map()
    data.forEach(function(d) {
      stateMap.set(d["sigla"],d["IDHM"])
    })
    return stateMap
  })
)});
  main.variable(observer("style")).define("style", ["colorScale","idhm_by_sigla"], function(colorScale,idhm_by_sigla){return(
function style(feature) {
		 return {
					weight: 1,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.6,
					fillColor: colorScale(idhm_by_sigla.get(feature.properties["sigla"]))
				};
	}
)});
  main.variable(observer("bairros")).define("bairros", ["d3"], function(d3){return(
d3.json("https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson")
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
  main.variable(observer("d_idhm_legend")).define("d_idhm_legend", ["width","d_idhm_color"], function(width,d_idhm_color){return(
svg => {
  const g = svg
      .attr("transform", `translate(${width},0)`)
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g")
    .data(d_idhm_color.domain().slice().reverse())
    .join("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

  g.append("rect")
      .attr("x", -19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", d_idhm_color);

  g.append("text")
      .attr("x", -24)
      .attr("y", 9.5)
      .attr("dy", "0.35em")
      .text(d => d);
}
)});
  main.variable(observer("d_idhm_x0")).define("d_idhm_x0", ["d3","d_idhm_data","d_idhm_groupKey","d_idhm_margin","width"], function(d3,d_idhm_data,d_idhm_groupKey,d_idhm_margin,width){return(
d3.scaleBand()
    .domain(d_idhm_data.map(d => d[d_idhm_groupKey]))
    .rangeRound([d_idhm_margin.left, width - d_idhm_margin.right])
    .paddingInner(0.1)
)});
  main.variable(observer("d_idhm_x1")).define("d_idhm_x1", ["d3","d_idhm_keys","d_idhm_x0"], function(d3,d_idhm_keys,d_idhm_x0){return(
d3.scaleBand()
    .domain(d_idhm_keys)
    .rangeRound([0, d_idhm_x0.bandwidth()])
    .padding(0.05)
)});
  main.variable(observer("d_idhm_y")).define("d_idhm_y", ["d3","d_idhm_height","d_idhm_margin"], function(d3,d_idhm_height,d_idhm_margin){return(
d3.scaleLinear()
    .domain([0, 1]).nice()
    .rangeRound([d_idhm_height - d_idhm_margin.bottom, d_idhm_margin.top])
)});
  main.variable(observer("d_idhm_color")).define("d_idhm_color", ["d3"], function(d3){return(
d3.scaleOrdinal()
    .range(["#98abc5","#6b486b", "#a05d56"])
)});
  main.variable(observer("d_idhm_xAxis")).define("d_idhm_xAxis", ["d_idhm_height","d_idhm_margin","d3","d_idhm_x0"], function(d_idhm_height,d_idhm_margin,d3,d_idhm_x0){return(
g => g
    .attr("transform", `translate(0,${d_idhm_height - d_idhm_margin.bottom})`)
    .call(d3.axisBottom(d_idhm_x0).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer("d_idhm_yAxis")).define("d_idhm_yAxis", ["d_idhm_margin","d3","d_idhm_y","d_idhm_data"], function(d_idhm_margin,d3,d_idhm_y,d_idhm_data){return(
g => g
    .attr("transform", `translate(${d_idhm_margin.left},0)`)
    .call(d3.axisLeft(d_idhm_y).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(d_idhm_data.y))
)});
  main.variable(observer("d_idhm_data")).define("d_idhm_data", ["d3"], function(d3){return(
Object.assign(d3.csv("https://gist.githubusercontent.com/jscfilho/4f6516e22882e1fb5b63db332780997b/raw/b0b3f76edb5e44fa2d01c8d2d133da628b3bbf2c/detailed_hdi_per_state.csv"))
)});
  main.variable(observer("d_idhm_groupKey")).define("d_idhm_groupKey", ["d_idhm_data"], function(d_idhm_data){return(
d_idhm_data.columns[0]
)});
  main.variable(observer("d_idhm_keys")).define("d_idhm_keys", ["d_idhm_data"], function(d_idhm_data){return(
d_idhm_data.columns.slice(1)
)});
  main.variable(observer("d_idhm_margin")).define("d_idhm_margin", function(){return(
{top: 10, right: 10, bottom: 20, left: 40}
)});
  main.variable(observer("d_idhm_height")).define("d_idhm_height", function(){return(
500
)});
  main.variable(observer("d_idhm_width")).define("d_idhm_width", function(){return(
1200
)});
  main.variable(observer("bc_data")).define("bc_data", ["d3"], function(d3){return(
Object.assign(d3.csv("https://gist.githubusercontent.com/jscfilho/4f6516e22882e1fb5b63db332780997b/raw/a1d151c797da2f26f17053dc00c8c7cef245c300/income_per_state.csv"))
)});
  main.variable(observer("bc_pack")).define("bc_pack", ["d3","bc_width","bc_height"], function(d3,bc_width,bc_height){return(
data => d3.pack().size([bc_width - 2, bc_height - 200]).padding(2)(d3.hierarchy({children: data}).sum(d => d.value))
)});
  main.variable(observer("bc_width")).define("bc_width", function(){return(
600
)});
  main.variable(observer("bc_height")).define("bc_height", ["bc_width"], function(bc_width){return(
bc_width
)});
  main.variable(observer("bc_color")).define("bc_color", function(){return(
function (g) { 
  if (g=="red") return "#a31919";
  return "#08306b";
}
)});
  return main;
}
