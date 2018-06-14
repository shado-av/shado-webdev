var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

var StackedBarChart = (function () {
    var jsonData = {};
    var currentOperator = 0;
    var svg = d3.select("svg"),
        margin = {
            top: 40,
            right: 20,
            bottom: 40,
            left: 50
        },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear().rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal(d3.schemeCategory10);
    var keys = [];
    var stacked;

    var initStackedBarChart = function(json) {
        jsonData = json;
        keys = json.taskName;

        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.bottom + margin.top) + ")")
            .style("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text("Time (min)");

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0) // - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text("Utilization (%)");

        // reset slider to 1
        var slider = document.getElementById("replicationSlider");
        var output = document.getElementById("replicationTB");

        slider.value = 1;
        slider.setAttribute("max", json.utilization[0].length);
        output.innerHTML = slider.value;

        slider.oninput = function () {
            output.innerHTML = this.value;
            console.log(jsonData, currentOperator, this.value);
            drawStackedBarChart(jsonData, currentOperator, this.value - 1);
        }

        // define domains
        x.domain([0, 480]); // data.map(function(d) { return d.x; }));
        y.domain([0, 1]); //.nice()
        z.domain(keys);

        // set ticks
        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(48));

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, 's').tickFormat(function (d) {
                return d * 100;
            }))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start");

        // set legends
        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) {
                return d;
            });

        stacked = d3.stack().keys(keys); //(data);
    };

    var drawStackedBarChart = function(json, operator, replication) {
        // convert json data into d3 stack preferred form
        currentOperator = operator;
        var data = [];
        for (var i = 0, j = 0; i <= 480; i += 10, j++) {
            data.push({
                x: i,
                total: 0
            });
        }

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 48; j++) {
                data[j][keys[i]] = json.utilization[operator][replication][i][j];
                data[j]["total"] += json.utilization[operator][replication][i][j];
            }
            data[j][keys[i]] = 0; // prevent error for the last column 480
        }

        // draw stacked bar charts
        // each data column (a.k.a "key" or "series") needs to be iterated over
        // the variable alphabet represents the unique keys of the stacks
        keys.forEach(function (key, key_index) {

            var keyClassName = key.replace(' ', '-');
            console.log(key, key_index);
            var bar = g.selectAll(".bar-" + keyClassName)
                .data(stacked(data)[key_index], function (d) {
                    return d.data.x + "-" + keyClassName;
                });

            bar
                .transition()
                .attr("x", function (d) {
                    return x(d.data.x);
                })
                .attr("y", function (d) {
                    return y(d[1]);
                })
                .attr("height", function (d) {
                    return y(d[0]) - y(d[1]);
                });

            bar.enter().append("rect")
                .attr("class", function (d) {
                    return "bar bar-" + keyClassName;
                })
                .attr("x", function (d) {
                    return x(d.data.x);
                })
                .attr("y", function (d) {
                    return y(d[1]);
                })
                .attr("height", function (d) {
                    return y(d[0]) - y(d[1]);
                })
                .attr("width", 14) // x.bandwidth())
                .attr("fill", function (d) {
                    return z(key);
                })
        });

        d3.select("#stackedBCTitle").text(json.operatorName[operator] + " Workload");
        // mouseover tips
        svg.selectAll(".bar")
            .on("mouseover", function (d, i) {
                //console.log(d, i, i/49, data[i%49]);
                d3.select(this).attr("stroke", "blue").attr("stroke-width", 0.8);
                div.transition()
                    .duration(200)
                    .style("opacity", .9);

                div.html("Task: " + keys[parseInt(i / 49)] + "<br> Mean Utilization: " + ((d[1] - d[0]) * 100).toFixed(2) + "%<br> Total Utilization: " + (data[i % 49]["total"] * 100).toFixed(2) + "%")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                //.style("left", (window.pageXOffset + matrix.e + 15) + "px")
                //.style("top", (window.pageYOffset + matrix.f - 30) + "px");;
            })
            .on("mouseout", function (d) {
                d3.select(this).attr("stroke", "pink").attr("stroke-width", 0.2);
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    };

    return {
        initStackedBarChart : initStackedBarChart,
        drawStackedBarChart : drawStackedBarChart
    };
})();

var BoxPlot = (function() {
    var width = 960;
    var height = 450;
    var barWidth = 30;
    var margin = {
            top: 40,
            right: 20,
            bottom: 40,
            left: 50
        };
    var width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    var totalWidth = width + margin.left + margin.right;
    var totalheight = height + margin.top + margin.bottom;

    // parse json file into groupCounts
    var groupCounts = {};
    var globalCounts = [];

    var boxQuartiles = function(d) {
            return [
                d3.quantile(d, .25),
                d3.quantile(d, .5),
                d3.quantile(d, .75)
            ];
    };

    // Perform a numeric sort on an array
    var sortNumber = function(a, b) {
            return a - b;
    };

    var visualize = function(url, element) {
        d3.json(url).then(function (json) {
            // save the json into jsonData for later use of stacked bar charts
            StackedBarChart.initStackedBarChart(json);

            for (var i = 0; i < json.averageUtilization.length; i++) {
                var key = json.operatorName[i];
                groupCounts[key] = json.averageUtilization[i];
                globalCounts = globalCounts.concat(json.averageUtilization[i]);
            }
            console.log("GroupCounts ", groupCounts);
            console.log("GlobalCounts ", globalCounts);

            // Sort group counts so quantile methods work
            for (var key in groupCounts) {
                var groupCount = groupCounts[key];
                groupCounts[key] = groupCount.sort(sortNumber);
            }

            // Setup a color scale for filling each box
            var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
                .domain(Object.keys(groupCounts));

            // Prepare the data for the box plots
            var boxPlotData = [];
            for (var [key, groupCount] of Object.entries(groupCounts)) {

                var record = {};
                var localMin = d3.min(groupCount);
                var localMax = d3.max(groupCount);

                record["key"] = key;
                record["counts"] = groupCount;
                record["quartile"] = boxQuartiles(groupCount);
                record["whiskers"] = [localMin, localMax];
                record["color"] = colorScale(key);

                boxPlotData.push(record);
            }

            // Compute an ordinal xScale for the keys in boxPlotData
            var xScale = d3.scalePoint()
                .domain(Object.keys(groupCounts))
                .rangeRound([0, width])
                .padding([0.5]);

            // Compute a global y scale based on the global counts
            var min = d3.min(globalCounts);
            var max = d3.max(globalCounts);
            var yScale = d3.scaleLinear()
                .domain([min - 0.0001, max])
                .range([height, 0]);

            // Setup the svg and group we will draw the box plot in
            var svg = d3.select(element).append("svg")
                .attr("width", totalWidth)
                .attr("height", totalheight)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Move the left axis over 25 pixels, and the top axis over 35 pixels
            var axisG = svg.append("g").attr("transform", "translate(25,0)");
            var axisBG = svg.append("g").attr("transform", "translate(35," +        (height) + ")");

            // Setup the group the box plot elements will render in
            var g = svg.append("g")
                .attr("transform", "translate(20,5)");

            // Draw the box plot vertical lines
            var verticalLines = g.selectAll(".verticalLines")
                .data(boxPlotData)
                .enter()
                .append("line")
                .attr("x1", function (datum) {
                    return xScale(datum.key) + barWidth / 2;
                })
                .attr("y1", function (datum) {
                    var whisker = datum.whiskers[0];
                    return yScale(whisker);
                })
                .attr("x2", function (datum) {
                    return xScale(datum.key) + barWidth / 2;
                })
                .attr("y2", function (datum) {
                    var whisker = datum.whiskers[1];
                    return yScale(whisker);
                })
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("fill", "none");

            // Draw the boxes of the box plot, filled in white and on top of vertical lines
            var rects = g.selectAll("rect")
                .data(boxPlotData)
                .enter()
                .append("rect")
                .attr("width", barWidth)
                .attr("height", function (datum) {
                    var quartiles = datum.quartile;
                    var height = yScale(quartiles[0]) - yScale(quartiles[2]);
                    return height;
                })
                .attr("x", function (datum) {
                    return xScale(datum.key);
                })
                .attr("y", function (datum) {
                    return yScale(datum.quartile[2]);
                })
                .attr("fill", function (datum) {
                    return datum.color;
                })
                .attr("stroke", "#000")
                .attr("stroke-width", 1);

            g.selectAll("rect")
                .on("mouseover", function (d, i) {
                    //console.log(d, i);
                    d3.select(this).attr("stroke", "blue").attr("stroke-width", 0.8);
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);

                    div.html("Group: " + d.key +
                            "<br/>Max: " + d.whiskers[1].toFixed(4) +
                            "<br/>Q3: " + d.quartile[2].toFixed(4) +
                            "<br/>Median: " + d.quartile[1].toFixed(4) +
                            "<br/>Q1: " + d.quartile[0].toFixed(4) +
                            "<br/>Min: " + d.whiskers[0].toFixed(4))
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                    //.style("left", (window.pageXOffset + matrix.e + 15) + "px")
                    //.style("top", (window.pageYOffset + matrix.f - 30) + "px");;
                })
                .on("mouseout", function (d) {
                    d3.select(this).attr("stroke", "pink").attr("stroke-width", 0.2);
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .on("click", function (d, i) {
                    //console.log("open Modal");
                    StackedBarChart.drawStackedBarChart(json, i,            d3.select("#replicationSlider").property("value") - 1);
                    $('#stackedBC').modal();
                });

            // Now render all the horizontal lines at once - the whiskers and the median
            var horizontalLineConfigs = [
            // Top whisker
                {
                    x1: function (datum) {
                        return xScale(datum.key)
                    },
                    y1: function (datum) {
                        return yScale(datum.whiskers[0])
                    },
                    x2: function (datum) {
                        return xScale(datum.key) + barWidth
                    },
                    y2: function (datum) {
                        return yScale(datum.whiskers[0])
                    }
                },
            // Median line
                {
                    x1: function (datum) {
                        return xScale(datum.key)
                    },
                    y1: function (datum) {
                        return yScale(datum.quartile[1])
                    },
                    x2: function (datum) {
                        return xScale(datum.key) + barWidth
                    },
                    y2: function (datum) {
                        return yScale(datum.quartile[1])
                    }
                },
            // Bottom whisker
                {
                    x1: function (datum) {
                        return xScale(datum.key)
                    },
                    y1: function (datum) {
                        return yScale(datum.whiskers[1])
                    },
                    x2: function (datum) {
                        return xScale(datum.key) + barWidth
                    },
                    y2: function (datum) {
                        return yScale(datum.whiskers[1])
                    }
                }
            ];

            for (var i = 0; i < horizontalLineConfigs.length; i++) {
                var lineConfig = horizontalLineConfigs[i];

                // Draw the whiskers at the min for this series
                var horizontalLine = g.selectAll(".whiskers")
                    .data(boxPlotData)
                    .enter()
                    .append("line")
                    .attr("x1", lineConfig.x1)
                    .attr("y1", lineConfig.y1)
                    .attr("x2", lineConfig.x2)
                    .attr("y2", lineConfig.y2)
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1)
                    .attr("fill", "none");
            }

            // Setup a scale on the left
            var axisLeft = d3.axisLeft(yScale);
            axisG.append("g")
                .call(axisLeft);

            // Setup a series axis on the bottom
            var axisBottom = d3.axisBottom(xScale);
            axisBG.append("g")
                .call(axisBottom);

            // text label for the x axis
            svg.append("text")
                .attr("transform",
                    "translate(" + (width / 2) + " ," +
                    (height + margin.bottom - 10) + ")")
                .style("text-anchor", "middle")
                .attr("font-weight", "bold")
                .text("Operator Name");

            // text label for the y axis
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -50) // - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .attr("font-weight", "bold")
                .text("Average Utilization (%)");

        });
    };

    return {
        visualize : visualize
    };
})();
