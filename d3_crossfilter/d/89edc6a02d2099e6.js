// https://observablehq.com/@jscfilho/d3-com-crossfilter-e-dc-js@239
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# D3 com Crossfilter e DC.js`
)});
  main.variable(observer("dataset")).define("dataset", ["d3"], function(d3){return(
d3.csv("https://gist.githubusercontent.com/emanueles/d8df8d875edda71aa2e2365fae2ce225/raw/1e949d3da02ed6caa21fe3a7a12a4e5a611a4bab/stocks.csv").then(function(data){
  // formatando nossos dados
  let parseDate = d3.timeParse("%Y/%m/%d")
  data.forEach(function(d,i){
       d.date = parseDate(d.date)
       d.google = +d.google
       d.facebook = +d.facebook
   })
  return data
})
)});
  main.variable(observer("facts")).define("facts", ["crossfilter","dataset"], function(crossfilter,dataset){return(
crossfilter(dataset)
)});
  main.variable(observer("dateDim")).define("dateDim", ["facts"], function(facts){return(
facts.dimension( d => d.date)
)});
  main.variable(observer("googleDim")).define("googleDim", ["facts"], function(facts){return(
facts.dimension( d => d.google)
)});
  main.variable(observer("topTenGoogle")).define("topTenGoogle", ["googleDim"], function(googleDim){return(
googleDim.top(10)
)});
  main.variable(observer("bottomTenGoogle")).define("bottomTenGoogle", ["googleDim"], function(googleDim){return(
googleDim.bottom(10)
)});
  main.variable(observer("googleByDayGroup")).define("googleByDayGroup", ["dateDim"], function(dateDim){return(
dateDim.group().reduceSum(d => d.google)
)});
  main.variable(observer("fbByDayGroup")).define("fbByDayGroup", ["dateDim"], function(dateDim){return(
dateDim.group().reduceSum(d => d.facebook)
)});
  main.variable(observer("container")).define("container", function(){return(
function container(id, title) { 
  return `
<div class='container'>
<div class='content'>
<div class='container'>
<div class='row'>
    <div class='span12' id='${id}'>
      <h4>${title}</h4>
    </div>
  </div>
</div>
</div>
</div>`
}
)});
  main.variable(observer("buildvis")).define("buildvis", ["md","container","dc","d3","dateDim","googleByDayGroup"], function(md,container,dc,d3,dateDim,googleByDayGroup)
{
  let view = md`${container('chart','Valores das ações do Google')}`
  let lineChart = dc.lineChart(view.querySelector("#chart"))
  let xScale = d3.scaleTime()
                  .domain([dateDim.bottom(1)[0].date, dateDim.top(1)[0].date])
  lineChart.width(800)
           .height(400)
           .dimension(dateDim)
           .margins({top: 30, right: 50, bottom: 25, left: 40})
           .renderArea(false)
           .x(xScale)
           .xUnits(d3.timeDays)
           .renderHorizontalGridLines(true)
           .legend(dc.legend().x(680).y(10).itemHeight(13).gap(5))
           .brushOn(false)
           .group(googleByDayGroup, 'Google')
  dc.renderAll()
  return view      
}
);
  main.variable(observer("buildcomposite")).define("buildcomposite", ["md","container","dc","d3","dateDim","googleByDayGroup","fbByDayGroup"], function(md,container,dc,d3,dateDim,googleByDayGroup,fbByDayGroup)
{
  let view = md`${container('chart2', 'Valores das ações do Google e do Facebook')}`
  let compositeChart = dc.compositeChart(view.querySelector("#chart2"))
  let xScale = d3.scaleTime()
                  .domain([dateDim.bottom(1)[0].date, dateDim.top(1)[0].date])
  compositeChart.width(800)
              .height(400)
              .margins({top: 50, right: 50, bottom: 25, left: 40})
              .dimension(dateDim)
              .x(xScale)
              .xUnits(d3.timeDays)
              .renderHorizontalGridLines(true)
              .legend(dc.legend().x(700).y(5).itemHeight(13).gap(5))
              .brushOn(false)    
              .compose([
                  dc.lineChart(compositeChart)
                    .group(googleByDayGroup, 'Google')
                    .ordinalColors(['steelblue']),
                  dc.lineChart(compositeChart)
                    .group(fbByDayGroup, 'Facebook')
                    .ordinalColors(['darkorange'])])
  dc.renderAll()
  return view      
}
);
  main.variable(observer()).define(["html"], function(html){return(
html`Esta célula inclui o css do dc.
<style>
.dc-chart path.dc-symbol, .dc-legend g.dc-legend-item.fadeout {
  fill-opacity: 0.5;
  stroke-opacity: 0.5; }

.dc-chart rect.bar {
  stroke: none;
  cursor: pointer; }
  .dc-chart rect.bar:hover {
    fill-opacity: .5; }

.dc-chart rect.deselected {
  stroke: none;
  fill: #ccc; }

.dc-chart .pie-slice {
  fill: #fff;
  font-size: 12px;
  cursor: pointer; }
  .dc-chart .pie-slice.external {
    fill: #000; }
  .dc-chart .pie-slice :hover, .dc-chart .pie-slice.highlight {
    fill-opacity: .8; }

.dc-chart .pie-path {
  fill: none;
  stroke-width: 2px;
  stroke: #000;
  opacity: 0.4; }

.dc-chart .selected path, .dc-chart .selected circle {
  stroke-width: 3;
  stroke: #ccc;
  fill-opacity: 1; }

.dc-chart .deselected path, .dc-chart .deselected circle {
  stroke: none;
  fill-opacity: .5;
  fill: #ccc; }

.dc-chart .axis path, .dc-chart .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges; }

.dc-chart .axis text {
  font: 10px sans-serif; }

.dc-chart .grid-line, .dc-chart .axis .grid-line, .dc-chart .grid-line line, .dc-chart .axis .grid-line line {
  fill: none;
  stroke: #ccc;
  shape-rendering: crispEdges; }

.dc-chart .brush rect.selection {
  fill: #4682b4;
  fill-opacity: .125; }

.dc-chart .brush .custom-brush-handle {
  fill: #eee;
  stroke: #666;
  cursor: ew-resize; }

.dc-chart path.line {
  fill: none;
  stroke-width: 1.5px; }

.dc-chart path.area {
  fill-opacity: .3;
  stroke: none; }

.dc-chart path.highlight {
  stroke-width: 3;
  fill-opacity: 1;
  stroke-opacity: 1; }

.dc-chart g.state {
  cursor: pointer; }
  .dc-chart g.state :hover {
    fill-opacity: .8; }
  .dc-chart g.state path {
    stroke: #fff; }

.dc-chart g.deselected path {
  fill: #808080; }

.dc-chart g.deselected text {
  display: none; }

.dc-chart g.row rect {
  fill-opacity: 0.8;
  cursor: pointer; }
  .dc-chart g.row rect:hover {
    fill-opacity: 0.6; }

.dc-chart g.row text {
  fill: #fff;
  font-size: 12px;
  cursor: pointer; }

.dc-chart g.dc-tooltip path {
  fill: none;
  stroke: #808080;
  stroke-opacity: .8; }

.dc-chart g.county path {
  stroke: #fff;
  fill: none; }

.dc-chart g.debug rect {
  fill: #00f;
  fill-opacity: .2; }

.dc-chart g.axis text {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none; }

.dc-chart .node {
  font-size: 0.7em;
  cursor: pointer; }
  .dc-chart .node :hover {
    fill-opacity: .8; }

.dc-chart .bubble {
  stroke: none;
  fill-opacity: 0.6; }

.dc-chart .highlight {
  fill-opacity: 1;
  stroke-opacity: 1; }

.dc-chart .fadeout {
  fill-opacity: 0.2;
  stroke-opacity: 0.2; }

.dc-chart .box text {
  font: 10px sans-serif;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none; }

.dc-chart .box line {
  fill: #fff; }

.dc-chart .box rect, .dc-chart .box line, .dc-chart .box circle {
  stroke: #000;
  stroke-width: 1.5px; }

.dc-chart .box .center {
  stroke-dasharray: 3, 3; }

.dc-chart .box .data {
  stroke: none;
  stroke-width: 0px; }

.dc-chart .box .outlier {
  fill: none;
  stroke: #ccc; }

.dc-chart .box .outlierBold {
  fill: red;
  stroke: none; }

.dc-chart .box.deselected {
  opacity: 0.5; }
  .dc-chart .box.deselected .box {
    fill: #ccc; }

.dc-chart .symbol {
  stroke: none; }

.dc-chart .heatmap .box-group.deselected rect {
  stroke: none;
  fill-opacity: 0.5;
  fill: #ccc; }

.dc-chart .heatmap g.axis text {
  pointer-events: all;
  cursor: pointer; }

.dc-chart .empty-chart .pie-slice {
  cursor: default; }
  .dc-chart .empty-chart .pie-slice path {
    fill: #fee;
    cursor: default; }

.dc-data-count {
  float: right;
  margin-top: 15px;
  margin-right: 15px; }
  .dc-data-count .filter-count, .dc-data-count .total-count {
    color: #3182bd;
    font-weight: bold; }

.dc-legend {
  font-size: 11px; }
  .dc-legend .dc-legend-item {
    cursor: pointer; }

.dc-hard .number-display {
  float: none; }

div.dc-html-legend {
  overflow-y: auto;
  overflow-x: hidden;
  height: inherit;
  float: right;
  padding-right: 2px; }
  div.dc-html-legend .dc-legend-item-horizontal {
    display: inline-block;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer; }
    div.dc-html-legend .dc-legend-item-horizontal.selected {
      background-color: #3182bd;
      color: white; }
  div.dc-html-legend .dc-legend-item-vertical {
    display: block;
    margin-top: 5px;
    padding-top: 1px;
    padding-bottom: 1px;
    cursor: pointer; }
    div.dc-html-legend .dc-legend-item-vertical.selected {
      background-color: #3182bd;
      color: white; }
  div.dc-html-legend .dc-legend-item-color {
    display: table-cell;
    width: 12px;
    height: 12px; }
  div.dc-html-legend .dc-legend-item-label {
    line-height: 12px;
    display: table-cell;
    vertical-align: middle;
    padding-left: 3px;
    padding-right: 3px;
    font-size: 0.75em; }

.dc-html-legend-container {
  height: inherit; }
</style>`
)});
  main.variable(observer("dc")).define("dc", ["require"], function(require){return(
require("dc")
)});
  main.variable(observer("crossfilter")).define("crossfilter", ["require"], function(require){return(
require("crossfilter2")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3")
)});
  main.variable(observer("dataset2")).define("dataset2", ["d3"], function(d3){return(
d3.csv("https://gist.githubusercontent.com/emanueles/d8df8d875edda71aa2e2365fae2ce225/raw/1e949d3da02ed6caa21fe3a7a12a4e5a611a4bab/stocks.csv").then(function(data){
  // formatando nossos dados
  let parseDate = d3.timeParse("%Y/%m/%d")
  var first_g = 0
  var first_f = 0
  var f = true
  data.forEach(function(d,i){
       d.date = parseDate(d.date)
       if (f) {
         first_g = d.google
         first_f = d.facebook
         f = false
       }
       var p_v_g = ((d.google / first_g)*100) - 100
       var p_v_f = ((d.facebook / first_f)*100) - 100
       d.google = +p_v_g
       d.facebook = +p_v_f
   })
  return data
})
)});
  main.variable(observer("facts2")).define("facts2", ["crossfilter","dataset2"], function(crossfilter,dataset2){return(
crossfilter(dataset2)
)});
  main.variable(observer("dateDim2")).define("dateDim2", ["facts2"], function(facts2){return(
facts2.dimension( d => d.date)
)});
  main.variable(observer("googleDim2")).define("googleDim2", ["facts2"], function(facts2){return(
facts2.dimension( d => d.google)
)});
  main.variable(observer("topTenGoogle2")).define("topTenGoogle2", ["googleDim2"], function(googleDim2){return(
googleDim2.top(10)
)});
  main.variable(observer("bottomTenGoogle2")).define("bottomTenGoogle2", ["googleDim2"], function(googleDim2){return(
googleDim2.bottom(10)
)});
  main.variable(observer("googleByDayGroup2")).define("googleByDayGroup2", ["dateDim2"], function(dateDim2){return(
dateDim2.group().reduceSum(d => d.google)
)});
  main.variable(observer("fbByDayGroup2")).define("fbByDayGroup2", ["dateDim2"], function(dateDim2){return(
dateDim2.group().reduceSum(d => d.facebook)
)});
  main.variable(observer("buildcomposite2")).define("buildcomposite2", ["md","container","dc","d3","dateDim2","dateDim","googleByDayGroup2","fbByDayGroup2"], function(md,container,dc,d3,dateDim2,dateDim,googleByDayGroup2,fbByDayGroup2)
{
  let view = md`${container('chart3', 'Valores das ações do Google(%) e do Facebook(%)')}`
  let compositeChart = dc.compositeChart(view.querySelector("#chart3"))
  let xScale = d3.scaleTime()
                  .domain([dateDim2.bottom(1)[0].date, dateDim2.top(1)[0].date])
  compositeChart.width(800)
              .height(400)
              .margins({top: 50, right: 50, bottom: 25, left: 40})
              .dimension(dateDim)
              .x(xScale)
              .xUnits(d3.timeDays)
              .renderHorizontalGridLines(true)
              .legend(dc.legend().x(700).y(5).itemHeight(13).gap(5))
              .brushOn(false)    
              .compose([
                  dc.lineChart(compositeChart)
                    .group(googleByDayGroup2, 'Google')
                    .ordinalColors(['steelblue']),
                  dc.lineChart(compositeChart)
                    .group(fbByDayGroup2, 'Facebook')
                    .ordinalColors(['darkorange'])])
  dc.renderAll()
  return view      
}
);
  main.variable(observer("dataset_movies")).define("dataset_movies", ["d3"], function(d3){return(
d3.json("https://raw.githubusercontent.com/emanueles/datavis-course/master/assets/files/observable/movies.json").then(function(data){
  data.forEach(function(d,i){
   
   })
  return data
})
)});
  main.variable(observer("movies_facts")).define("movies_facts", ["crossfilter","dataset_movies"], function(crossfilter,dataset_movies){return(
crossfilter(dataset_movies)
)});
  main.variable(observer("year")).define("year", ["movies_facts"], function(movies_facts){return(
movies_facts.dimension( d => d.Year)
)});
  main.variable(observer("year_group")).define("year_group", ["year"], function(year){return(
year.group().reduceSum(d => d.Worldwide_Gross_M)
)});
  main.variable(observer("year_chart")).define("year_chart", ["md","container","dc","d3","year","year_group"], function(md,container,dc,d3,year,year_group)
{
  let view = md`${container('chart4','Worldwide Gross')}`
  let barChart = dc.barChart(view.querySelector("#chart4"))  
  let xScale = d3.scaleBand();
  
  barChart.width(600)
    .height(400)
    .margins({top: 50, right: 50, bottom: 25, left: 40})
    .dimension(year)
    .x(xScale)
    .xUnits(dc.units.ordinal)
    .barPadding(0.5)
    .xAxisLabel('Year')
    .yAxisLabel('Tickets')
    .group(year_group);
  barChart.margins().left = 80;
  
  dc.renderAll()
  return view      
}
);
  main.variable(observer("genre")).define("genre", ["movies_facts"], function(movies_facts){return(
movies_facts.dimension( d => d.Genre)
)});
  main.variable(observer("genre_group")).define("genre_group", ["genre"], function(genre){return(
genre.group().reduceSum(d => +d.Worldwide_Gross_M)
)});
  main.variable(observer("genre_chart")).define("genre_chart", ["md","container","dc","d3","genre","genre_group"], function(md,container,dc,d3,genre,genre_group)
{
  let view = md`${container('chart5','Worldwide Gross by genre')}`
  let barChart = dc.barChart(view.querySelector("#chart5"))  
  let xScale = d3.scaleBand();
  
  barChart.width(600)
    .height(400)
    .margins({top: 50, right: 50, bottom: 25, left: 40})
    .dimension(genre)
    .x(xScale)
    .xUnits(dc.units.ordinal)
    .barPadding(0.5)
    .xAxisLabel('Genre')
    .yAxisLabel('Tickets')
    .group(genre_group)
    .ordering(function(d) { return -d.value; });

  
  dc.renderAll()
  return view      
}
);
  return main;
}
