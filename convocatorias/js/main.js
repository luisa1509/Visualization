/*
*    main.js
*    Mastering Data Visualization with D3.js
*    6.8 - Line graphs in D3
*/
		
const MARGIN = { LEFT: 20, RIGHT: 100, TOP: 50, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// time parser for x-scale
const parseTime = d3.timeParse("%Y")
// for tooltip
const bisectDate = d3.bisector(d => d.convocatoria).left

// scales
const x = d3.scaleTime().range([0, WIDTH])
const y = d3.scaleLinear().range([HEIGHT, 0])

// axis generators
const xAxisCall = d3.axisBottom()
const yAxisCall = d3.axisLeft()
	.ticks(10)
	.tickFormat(d => d + "")

// axis groups
const xAxis = g.append("g")
	.attr("class", "x axis")
	.attr("transform", `translate(0, ${HEIGHT})`)
const yAxis = g.append("g")
	.attr("class", "y axis")
    
// y-axis label
yAxis.append("text")
	.attr("class", "axis-title")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.attr("fill", "#5D6971")
	.text("Cantidad")

// line path generator
const line = d3.line()
	.x(d => x(d.convocatoria))
	.y(d => y(d.A))

const lineb = d3.line()
	.x(d => x(d.convocatoria))
	.y(d => y(d.B))

d3.json("data/convocatorias.json").then(data => {
	// clean data
	data.forEach(d => {
		d.convocatoria = parseTime(d.convocatoria)
		d.A = Number(d.A)
		d.B = Number(d.B)


	})

	// set scale domains
	x.domain(d3.extent(data, d => d.convocatoria))
	y.domain([
		d3.min(data, d => d.A) / 1.005, 
		d3.max(data, d => d.A) * 1.005,


	
	])

	// generate axes once scales have been set
	xAxis.call(xAxisCall.scale(x))
	yAxis.call(yAxisCall.scale(y))

	// add line to chart
	g.append("path")
		.attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", "pink")
		.attr("stroke-width", "3px")
		.attr("d", line(data, d => d.A));

	g.append("path")
		.attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", "pink")
		.attr("stroke-width", "3px")
		.attr("d", line(data, d => d.B));


	/******************************** Tooltip Code ********************************/

	const focus = g.append("g")
		.attr("class", "focus")
		.style("display", "none")

	focus.append("line")
		.attr("class", "x-hover-line hover-line")
		.attr("y1", 0)
		.attr("y2", HEIGHT)

	focus.append("line")
		.attr("class", "y-hover-line hover-line")
		.attr("x1", 0)
		.attr("x2", WIDTH)

	focus.append("circle")
		.attr("r", 7.5)

	focus.append("text")
		.attr("x", 15)
		.attr("dy", ".31em")

	g.append("rect")
		.attr("class", "overlay")
		.attr("width", WIDTH)
		.attr("height", HEIGHT)
		.on("mouseover", () => focus.style("display", null))
		.on("mouseout", () => focus.style("display", "none"))
		.on("mousemove", mousemove)

	function mousemove() {
		const x0 = x.invert(d3.mouse(this)[0])
		const i = bisectDate(data, x0, 1)
		const d0 = data[i - 1]
		const d1 = data[i]
		const d = x0 - d0.convocatoria > d1.convocatoria - x0 ? d1 : d0
		focus.attr("transform", `translate(${x(d.convocatoria)}, ${y(d.A)})`)
		focus.select("text").text(d.A)
		focus.select(".x-hover-line").attr("y2", HEIGHT - y(d.A))		
		focus.select(".y-hover-line").attr("x2", -x(d.convocatoria))
	}
	
	/******************************** Tooltip Code ********************************/
})
