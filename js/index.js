const padding = {top: 100, right: 80, bottom: 50, left: 100};
const height = 500;
const width = 900;

const plot = d3.select("#plot");

plot.style("background-color", "white")
    .style("opacity", "0.8")
    .attr("width", width + padding.left + padding.right)
    .attr("height", height + padding.top + padding.bottom);

const xScale = d3.scaleLinear()
				.range([padding.left, width])

const yScale = d3.scaleLinear()
				.range([padding.top, height])

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
  .then((data) => {
    
    agregaPropMinutosDetras(data); 
    render(data);
    
}).catch((error) => console.error(error));

function getFastest(data) {
	let fastest = data.reduce((fastest, actual) => {
		return (fastest.Seconds > actual.seconds)? actual: fastest;
	});
	return fastest;
}

function segundosAMinutos(n){
	// En base decimal
	return n / 60;
}

function minutosDetrasDelMasRapido(fastest, n) {
	// n está en segundos
	// Devuelve a cuántos minutos del más rápido está n.
	const masRapido = segundosAMinutos(fastest.Seconds);
	const res = segundosAMinutos(n) - masRapido;
 return res;
}

// Idea de usar una función render tomada de Curran Kelleher - Introduction to D3 - Youtube - 2015
function render(data) {
  xScale.domain([d3.max(data, (d) => d.minutosDetras) + 0.3, d3.min(data, (d) => d.minutosDetras)]);

  yScale.domain([0, d3.max(data, (d) => d.Place) + 2]);

  const circles = plot.selectAll("circle").data(data);
  circles.enter()
      .append("circle")
        .attr("class", (d) => (d.Doping)? "doping" : "noDoping")
        .attr("r", "5")
        .attr("cx", (d) => xScale(d.minutosDetras))
        .attr("cy", (d) => yScale(d.Place))

  plot.selectAll("text.ciclista")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d.minutosDetras) + 8)
    .attr("y", (d) => yScale(d.Place) + 3)
    .attr("class", "ciclista")
    .text((d) => d.Name)

  // ejes
  // x
  plot.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  // y
  plot.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding.left + "," + 0 + ")")
    .call(d3.axisLeft(yScale));

  // y label
  plot.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", "-250")
    .attr("y", "50")
    .attr("class", "label")
    .text("Ranking");

  // x label
  plot.append("text")
    .attr("x", "250")
    .attr("y", height + padding.bottom)
    .attr("class", "label")
    .text("Minutos detrás del tiempo más rápido");

  // Título
  plot.append("g")
    .attr("transform", "translate(" + (padding.left  / 2 ) + "," + (padding.top / 2) + ")")
    .append("text")
    .attr("class", "title")
    .text("Doping en ciclismo profesional. 35 mejores tiempos en Alpe d'Huez");

  leyenda(plot);
}

function leyenda(plot) {
  const leyenda = plot.append("g").attr("transform", "translate(" + (width - padding.right) + "," + (height / 2 + 50) + ")").attr("class", "leyenda");

  leyenda.append("circle").attr("transform", "translate(0,0)")
    .attr("r", "5")
    .attr("class", "doping")

  leyenda.append("text").attr("transform", "translate(10,5)")
    .attr("class", "leyenda")
    .text("Con acusación de dopaje");
      
  leyenda.append("circle").attr("transform", "translate(0,20)")
    .attr("r", "5")
    .attr("class", "noDoping")

  leyenda.append("text").attr("transform", "translate(10,25)")
    .attr("class", "leyenda")
    .text("Sin acusación de dopaje");
}

function agregaPropMinutosDetras(data){
  // A cada uno de los objetos de data le agrega la propiedad minutosDetras, que la calcula a partir de la propiedad Seconds que los datos ya tienen.
  // Modifica data
   const fastest = getFastest(data);
    
   data.forEach((d) => {
      d.minutosDetras = minutosDetrasDelMasRapido(fastest, d.Seconds);
    })
}

/* Recursos
- [D3 Tips and Tricks v4.x](https://leanpub.com/d3-t-and-t-v4/read)
- [Introduction to D3](https://www.youtube.com/watch?v=8jvoTV54nXw)
- [Tutorials d3](https://github.com/d3/d3/wiki/Tutorials)
- Data Visualization with D3 by Michael Menz - CS50 Seminar 2016 [Slides](http://cdn.cs50.net/2016/fall/seminars/data_visualization_with_d3/data_visualization_with_d3.pdf) and [video](https://www.youtube.com/watch?v=219xXJRh4Lw)
- Free Code Camp - [Data Visualization with D3](https://beta.freecodecamp.org/en/challenges/data-visualization-with-d3/introduction-to-the-data-visualization-with-d3-challenges)
- [D3 fetch](https://github.com/d3/d3-fetch), for parsing csv, json, etc. 
- [D3 for mere mortals](http://www.recursion.org/d3-for-mere-mortals/)
- [Let's make a bar chart](https://bost.ocks.org/mike/bar/3/)
*/