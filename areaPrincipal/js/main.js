/*
*    main.js
*    Mastering Data Visualization with D3.js
*    5.2 - Looping with intervals
*/

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

  // Tooltip
const tip = d3.tip()
.attr('class', 'd3-tip')
.html(d => {
  let text = `<strong>Área:</strong> <span style='color:#CC3454;text-transform:capitalize'>${d.area}</span><br>`
  text += `<strong>Cantidad:</strong> <span style='color:#CC3454;text-transform:capitalize'>${d.cantidad}</span><br>`
  return text
})
g.call(tip)

  
// X label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("fill","#2A2A2F")
  .text("Área")
  

// Y label
g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .attr("fill","#2A2A2F")
  .text("Cantidad de Grupos")
  

d3.csv("data/areaPrincipal.csv").then(data => {
  data.forEach(d => {
    d.cantidad = Number(d.cantidad)
    d.color = d.color;
  })


  

  const x = d3.scaleBand()
    .domain(data.map(d => d.area))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)
  
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.cantidad)])
    .range([HEIGHT, 0])

  const xAxisCall = d3.axisBottom(x)
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(xAxisCall)
    .attr("color","#52525A")
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "center")
      .attr("transform", "rotate(0)")
      .attr("font-family", "Avenir LT Std")

  const yAxisCall = d3.axisLeft(y)
    .ticks(10)
    .tickFormat(d => d + "")
  g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall)

  const rects = g.selectAll("rect")
    .data(data)
  
  rects.enter().append("rect")
    .attr("y", d => y(d.cantidad))
    .attr("x", (d) => x(d.area))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d.cantidad))
    .attr("fill", d => d.color)
    .attr("rx","5px")

		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		.merge(rects)



    
 

  

  d3.interval(() => {
    console.log("Hello World")
  }, 1000)

  
})







