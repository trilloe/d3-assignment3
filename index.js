// TODO
// Fix x axis placement and graph placement for negative numbers
let sample = [];

function randomize() {
    // Create Data
    let data = [];
    for (let i = 1; i <= 100; ++i) {
        data.push(i);
    }

    // Sample Data
    sampler(data, 20, false);

    // Refresh Graph
    graphRefresh(sample);
}

function normal() {
    // Collect Data
    let sample_size = (!document.getElementById("sample_size").value) ? 20 : document.getElementById("sample_size").value;
    let replace = document.querySelector('input[name="question"]:checked').value;

    let mean = (!document.getElementById("n_mean").value) ? 0 : document.getElementById("n_mean").value;
    let sd = (!document.getElementById("n_sd").value) ? 1 : document.getElementById("n_sd").value;
    console.log(`${mean}   ${sd}`);

    // Create Data
    let data = []

    for (let i = 1; i <= 100; ++i) {
        data.push(d3.randomNormal(mean, sd)().toFixed(2));
    }

    // Sample Data
    sampler(data, sample_size, Boolean(replace));

    // Refresh Graph;
    let max = 0;
    let min = 0;
    sample.forEach((value) => {
        let temp = parseFloat(value.value);
        if (temp > max) {
            max = temp;
        }
        if (temp < min) {
            min = temp;
        }
        console.log(value)
    });
    console.log(`${max} ${min}`);

    graphRefresh(sample, max + 1, min - 1);

}

function uniform() {
    // Collect Data
    let sample_size = (!document.getElementById("sample_size").value) ? 20 : document.getElementById("sample_size").value;
    let replace = document.querySelector('input[name="question"]:checked').value;

    let u_min = (!document.getElementById("u_min").value) ? 0 : document.getElementById("u_min").value;
    let u_max = (!document.getElementById("u_max").value) ? 100 : document.getElementById("u_max").value;

    // Create Data
    let data = []

    for (let i = 1; i <= 100; ++i) {
        data.push(d3.randomUniform(u_min, u_max)().toFixed(2));
    }

    // Sample Data
    sampler(data, sample_size, Boolean(replace));

    // Refresh Graph;
    let max = 0;
    let min = 0;
    sample.forEach((value) => {
        let temp = parseFloat(value.value);
        if (temp > max) {
            max = temp;
        }
        if (temp < min) {
            min = temp;
        }
        console.log(value)
    });
    console.log(`${max} ${min}`);

    graphRefresh(sample, max + 1, min - 1);
}

function exponential() {
    // Collect Data
    let sample_size = (!document.getElementById("sample_size").value) ? 20 : document.getElementById("sample_size").value;
    let replace = document.querySelector('input[name="question"]:checked').value;

    let lamb = (!document.getElementById("lamb").value) ? 1 : document.getElementById("lamb").value;
    console.log(`${lamb}`);

    // Create Data
    let data = []

    for (let i = 1; i <= 100; ++i) {
        data.push(d3.randomExponential(lamb)().toFixed(2));
    }

    // Sample Data
    sampler(data, sample_size, Boolean(replace));

    // Refresh Graph;
    let max = 0;
    let min = 0;
    sample.forEach((value) => {
        let temp = parseFloat(value.value);
        if (temp > max) {
            max = temp;
        }
        if (temp < min) {
            min = temp;
        }
        console.log(value)
    });
    console.log(`${max} ${min}`);

    graphRefresh(sample, max + 1, min - 1);
}

function graphRefresh(sample, yMax = 100, yMin = 0) {
    document.getElementById("graphSVG").innerHTML = "";
    generateGraph(sample, yMax, yMin);
    sample = [];
}

function sampler(data, count, replacement = false) {
    sample = [];
    for (let i = 0; i < count; ++i) {
        let index = Math.round(Math.random() * (data.length - 1));
        if (replacement) {
            sample.push({ 'id': i + 1, 'value': data[index] });
        } else {
            if (data[index] == -1) {
                while (data[index] == -1) {
                    index = Math.round(Math.random() * (data.length - 1));
                }
                sample.push({ 'id': i + 1, 'value': data[index] });
            } else {
                sample.push({ 'id': i + 1, 'value': data[index] });
            }
            data[index] = -1;
        }
    }
}


// function generateGraph(data, yMax, yMin) {
function generateGraph(data) {
    data = [-15, -20, -22, -18, 2, 6, -26, -18, -50];
    let y0 = Math.max(Math.abs(d3.min(data)), Math.abs(d3.max(data)));

    const svg = d3.select('svg');
    const svgContainer = d3.select('#container');

    const margin = 80;
    const width = 1000 - 2 * margin;
    const height = 600 - 2 * margin;

    const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

    const xScale = d3.scaleBand()
        .domain(d3.range(data.length))
        .rangeRound([0, width])
        .padding(0.2);
    //.range([0, width])
    //.padding(0.4)

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([-y0, y0])
        .nice();

    // vertical grid lines
    // const makeXLines = () => d3.axisBottom()
    //   .scale(xScale)

    const makeYLines = d3.axisLeft()
        .scale(yScale)

    chart.append("g")
        .attr("class", "x axis")
        .call(makeYLines);

    chart.append("g")
        .attr("class", "y axis")
        .append("line")
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .attr("x1", 0)
        .attr("x2", width);

    // chart.append('g')
    //     .attr('transform', `translate(0, ${height})`)
    //     .call(d3.axisBottom(xScale));

    // chart.append('g')
    //     .call(d3.axisLeft(yScale));

    // vertical grid lines
    // chart.append('g')
    //   .attr('class', 'grid')
    //   .attr('transform', `translate(0, ${height})`)
    //   .call(makeXLines()
    //     .tickSize(-height, 0, 0)
    //     .tickFormat('')
    //   )

    chart.append('g')
        .attr('class', 'grid')
        .call(makeYLines
            .tickSize(-width, 0, 0)
            .tickFormat('')
        )

    const barGroups = chart.selectAll()
        .data(data)
        .enter()
        .append('g')
    
    barGroups
        .append('rect')
        .attr('class', (g) => (g<0) ? 'bar_negative':'bar_positive')
        .attr('x', (g, i) => xScale(i))
        .attr('y', (g) => yScale(Math.max(0, g)))
        .attr('height', (g) => Math.abs(yScale(g) - yScale(0)))
        .attr('width', xScale.bandwidth())
        // .attr('x', (g) => xScale(g.id))
        // .attr('y', (g) => yScale(g.value))
        // .attr('height', (g) => height - yScale(g.value))
        // .attr('width', xScale.bandwidth())
        .on('mouseenter', function (actual, i) {
            // d3.selectAll('.value')
            //     .attr('opacity', 0)

            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 0.6)
                .style('fill', 'orange')
                //.attr('x', (g, a) => xScale(a) + xScale.bandwidth() / 2)
                //.attr('x', (g, a) => xScale(a))
                // .attr('x', (a) => xScale(a.id) - 5)
                //.attr('width', xScale.bandwidth() + 10)

            //const y = yScale(actual.value)
            const y = yScale(actual);
            

            line = chart.append('line')
                .attr('id', 'limit')
                .attr('x1', 0)
                .attr('y1', y)
                .attr('x2', width)
                .attr('y2', y)

            // barGroups.append('text')
            //     .attr('class', 'divergence')
            //     .attr('x', (a) => xScale(a.id) + xScale.bandwidth() / 2)
            //     .attr('y', (a) => yScale(a.value) + 30)
            //     .attr('fill', 'white')
            //     .attr('text-anchor', 'middle')
            //     .text((a, idx) => {
            //         const divergence = (a.value - actual.value).toFixed(1)

            //         let text = ''
            //         if (divergence > 0) text += '+'
            //         text += `${divergence}`
            //         return idx !== i ? text : '';
            //     })

        })
        .on('mouseleave', function () {
            d3.selectAll('.value')
                .attr('opacity', 1)

            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 1)
                .style('fill', 'rgb(128, 203, 196)')
                //.attr('x', (a) => xScale(a))
                .attr('width', xScale.bandwidth())

            chart.selectAll('#limit').remove()
            chart.selectAll('.divergence').remove()
        })

    barGroups
        .append('text')
        .attr('class', 'value')
        .attr('x', (g, a) => xScale(a) + xScale.bandwidth() / 2)
        .attr('y', (a) => (a > 0) ? yScale(a) - 10: yScale(Math.min(0, a)) + 20)
        .attr('text-anchor', 'middle')
        .text((a) => `${a}`)

    svg
        .append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Value')

    svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'middle')
        .text('ID')

    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Random Sample Visualizer')

    // svg.append('text')
    //     .attr('class', 'source')
    //     .attr('x', width - margin / 2)
    //     .attr('y', height + margin * 1.7)
    //     .attr('text-anchor', 'start')
    //     .text('Source: Stack Overflow, 2018')

}