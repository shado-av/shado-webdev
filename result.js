var div = d3.select("body").append("div")
	.attr("class", "tooltipBox")
	.style("opacity", 0);

// Setup a color scale for filling each box
var colorScale = [
	// d3 color 20
	"#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5",

	// https://jnnnnn.blogspot.com/2017/02/distinct-colours-2.html
	"#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7", "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616", "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178", "#5776a9", "#678007", "#fa9316", "#85c070", "#6aa2a9", "#989e5d", "#fe9169", "#cd714a", "#6ed014", "#c5639c", "#c23271", "#698ffc", "#678275", "#c5a121", "#a978ba", "#ee534e", "#d24506", "#59c3fa", "#ca7b0a", "#6f7385", "#9a634a", "#48aa6f", "#ad9ad0", "#d7908c", "#6a8a53", "#8c46fc", "#8f5ab8", "#fd1105", "#7ea7cf", "#d77cd1", "#a9804b", "#0688b4", "#6a9f3e", "#ee8fba", "#a67389", "#9e8cfe", "#bd443c", "#6d63ff", "#d110d5", "#798cc3", "#df5f83", "#b1b853", "#bb59d8", "#1d960c", "#867ba8", "#18acc9", "#25b3a7", "#f3db1d", "#938c6d", "#936a24", "#a964fb", "#92e460", "#a05787", "#9c87a0", "#20c773", "#8b696d", "#78762d", "#e154c6", "#40835f", "#d73656", "#1afd5c", "#c4f546", "#3d88d8", "#bd3896", "#1397a3", "#f940a5", "#66aeff", "#d097e7", "#fe6ef9", "#d86507", "#8b900a", "#d47270", "#e8ac48", "#cf7c97", "#cebb11", "#718a90", "#e78139", "#ff7463", "#bea1fd"
];

var BarChartWithError = (function (index, isFleet, timeText) {
	var jsonData = {};
	var svg;
	var g;
	var id = index || 0;
	var isFleet = isFleet || 0;
	var timeText = timeText || "Busy Time";
	var x;
	var y;
	var z = d3.scaleOrdinal()
		.range(colorScale);
	var keys = [];
	var stacked;
	var margin = {
		top: 40,
		right: 20,
		bottom: 40,
		left: 50
	};
	var minutes, barCounts;
	var bandWidth;
	var totalWidth = 960;
	var totalHeight = 400;
	var width = totalWidth - margin.left - margin.right;
	var height = totalHeight - margin.top - margin.bottom;
	var barWidth = 25;

	var drawBarChartWithError = function (json, teamName, svgId) {
		var avgTime;
		var stdTime;
		var xAxisText;
		var yMax = 100;
		var resultSet;
		var strAction = " spent";

		jsonData = json;
		if (isFleet) {
			keys = json.fleetName;

			if (json.hasOwnProperty('averageBusyTimePerFleet')) {
				avgTime = json.averageBusyTimePerFleet[id];
				stdTime = json.stdBusyTimePerFleet[id];
				resultSet = "busyTimePerFleet";
			} else {
				avgTime = json.averageWaitTimePerFleet[id];
				stdTime = json.stdWaitTimePerFleet[id];
				resultSet = "waitTimePerFleet";
			}

			xAxisText = sim.textStrings.fleet + " Name";
		} else {
			keys = json.taskName;

			if (json.hasOwnProperty('averageBusyTimePerTask')) {
				avgTime = json.averageBusyTimePerTask[id];
				stdTime = json.stdBusyTimePerTask[id];
				resultSet = "busyTimePerTask";
			} else {
				avgTime = json.averageWaitTimePerTask[id];
				stdTime = json.stdWaitTimePerTask[id];
				resultSet = "waitTimePerTask";
			}
			xAxisText = "Task Name";
		}
		barCounts = avgTime.length;

		// put report variables using isFleet, timeText
		if (timeText.startsWith("Wait")) {
			strAction = " waited";
		}

		if (isFleet) {
			sim.resultSettings[resultSet] += teamName + strAction + ", on average, more time on " + keys[avgTime.indexOf(d3.max(avgTime))] + " than any other type of " + sim.textStrings.fleet.toLowerCase() + "s. They were least busy with " + keys[avgTime.indexOf(d3.min(avgTime))] + ". ";
		} else {
			sim.resultSettings[resultSet] += teamName + strAction + ", on average, more time on " + keys[avgTime.indexOf(d3.max(avgTime))] + " than any other type of tasks. They were least busy with " + keys[avgTime.indexOf(d3.min(avgTime))] + ". ";
		}

		//console.log("ResultSettings", sim.resultSettings);

		// adjust width with the number of operator teams and total operators
		//        if (barCounts > 10) {
		//            totalWidth = 960 + barCounts * barWidth * 2;
		//            width = totalWidth - margin.left - margin.right;
		//        } else {
		//            totalWidth = 960;
		//            width = totalWidth - margin.left - margin.right;
		//        }

		//console.log(barCounts, barWidth, totalWidth, width, avgTime);
		svg = d3.select(svgId);
		svg.selectAll("*").remove();
		//console.log(svg);

		svg.attr("width", totalWidth)
			.attr("height", totalHeight);

		//width = +svg.attr("width") - margin.left - margin.right;
		//height = +svg.attr("height") - margin.top - margin.bottom;
		bandWidth = Math.floor((width - 150) / (barCounts + 1));

		x = d3.scaleBand().rangeRound([0, width - 150])
			.padding(0.1);
		y = d3.scaleLinear()
			.rangeRound([height, 0]);

		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		//console.log(keys, width, height);
		// text label for the x axis
		svg.append("text")
			.attr("transform",
				"translate(" + (width / 2) + " ," +
				(height + margin.bottom + margin.top) + ")")
			.style("text-anchor", "middle")
			.attr("font-weight", "bold")
			.text(xAxisText);

		// text label for the y axis
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0) // - margin.left)
			.attr("x", 0 - (height / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.attr("font-weight", "bold")
			.text(timeText + " (minutes)");

		yMax = 1;
		for (i = 0; i < avgTime.length; i++) {
			if (yMax < avgTime[i] + stdTime[i]) {
				yMax = avgTime[i] + stdTime[i];
			}
		}

		// define domains
		x.domain(keys); // data.map(function(d) { return d.x; }));
		y.domain([0, yMax]); //.nice()
		z.domain(keys);

		// set ticks
		g.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x).tickValues([]));

		g.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(y).ticks(null, 's'))
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
			.attr("x", width - 5)
			.attr("width", 19)
			.attr("height", 19)
			.attr("fill", z);

		legend.append("text")
			.attr("x", width - 10)
			.attr("y", 9.5)
			.attr("dy", "0.32em")
			.text(function (d) {
				return d;
			});

		// convert json data into d3 stack preferred form
		var data = [];
		for (var i = 0; i < keys.length; i++) {
			data.push({
				x: keys[i],
				avg: avgTime[i],
				std: stdTime[i]
			});
		}

		//console.log(data);

		var bar = g.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function (d) {
				return x(d.x);
			})
			.attr("y", function (d) {
				return y(d.avg);
			})
			.attr("height", function (d) {
				return height - y(d.avg);
			})
			.attr("width", x.bandwidth())
			.attr("fill", function (d) {
				return z(d.x);
			});

		// Draw the error bar vertical lines
		var verticalLines = g.selectAll(".verticalLines")
			.data(data)
			.enter()
			.append("line")
			.attr("x1", function (d) {
				return x(d.x) + x.bandwidth() / 2;
			})
			.attr("y1", function (d) {
				return y(d.avg + d.std);
			})
			.attr("x2", function (d) {
				return x(d.x) + x.bandwidth() / 2;
			})
			.attr("y2", function (d) {
				return y((d.avg - d.std) > 0 ? d.avg - d.std : 0);
			})
			.attr("stroke", "#000")
			.attr("stroke-width", 1)
			.attr("fill", "none");

		// Now render all the horizontal lines at once - the whiskers and the median
		var horizontalLineConfigs = [
        // Top whisker
			{
				x1: function (d) {
					return x(d.x) + ((x.bandwidth() > barWidth) ? x.bandwidth() / 2 - barWidth / 2 : 0);
				},
				y1: function (d) {
					return y(d.avg + d.std)
				},
				x2: function (d) {
					return x(d.x) + ((x.bandwidth() > barWidth) ? x.bandwidth() / 2 + barWidth / 2 : 0);
				},
				y2: function (d) {
					return y(d.avg + d.std)
				}
            },
        // Bottom whisker
			{
				x1: function (d) {
					return x(d.x) + ((x.bandwidth() > barWidth && (d.avg - d.std) > 0) ? x.bandwidth() / 2 - barWidth / 2 : 0);
				},
				y1: function (d) {
					return y((d.avg - d.std) > 0 ? d.avg - d.std : 0)
				},
				x2: function (d) {
					return x(d.x) + ((x.bandwidth() > barWidth && (d.avg - d.std) > 0) ? x.bandwidth() / 2 + barWidth / 2 : 0);
				},
				y2: function (d) {
					return y((d.avg - d.std) > 0 ? d.avg - d.std : 0)
				}
            }
        ];

		for (var i = 0; i < horizontalLineConfigs.length; i++) {
			var lineConfig = horizontalLineConfigs[i];

			// Draw the whiskers at the min for this series
			var horizontalLine = g.selectAll(".whiskers")
				.data(data)
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

		// Draw the invisible boxes of the box plot for making clickable area larger
		var rects = g.selectAll(".clickable")
			.data(data)
			.enter()
			.append("rect")
			.attr("width", x.bandwidth())
			.attr("height", function (d) {
				return y(0) - y(yMax);
			})
			.attr("x", function (d) {
				return x(d.x);
			})
			.attr("y", function (d) {
				return y(yMax);
			})
			.attr("fill", "none")
			.attr("class", "clickable")
			.attr("pointer-events", "visible")
			.attr("stroke", "transparent")
			//               .style("cursor", "pointer")
			.attr("stroke-width", 1);

		// mouseover tips
		svg.selectAll(".clickable")
			.on("mouseover", function (d, i) {
				d3.select(this).attr("stroke", "blue").attr("stroke-width", 0.8);
				div.transition()
					.duration(200)
					.style("opacity", .9);
				//console.log(d, i);
				var k = Math.floor(i / 4);
				div.html("<table><tr><td>" + xAxisText + ":</td><td>" + keys[i] + "</td></tr><tr><td>" +
						timeText + " Average:</td><td>" + d.avg.toFixed(2) + "</td></tr><tr><td>Std. Dev.</td><td>" + d.std.toFixed(2) + "</td></tr></table>")
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

		//d3.select("#barChartTitle" + id).text(teamName + " Workload");
	};

	return {
		drawBarChartWithError: drawBarChartWithError
	};
});

var BoxPlot = (function () {
	var barWidth = 25;
	var margin = {
		top: 40,
		right: 100,
		bottom: 40,
		left: 50
	};
	var totalWidth = 960;
	var totalHeight = 450;
	var width = totalWidth - margin.left - margin.right;
	var height = totalHeight - margin.top - margin.bottom;

	var boxQuartiles = function (d) {
		return [
                d3.quantile(d, .25),
                d3.quantile(d, .5),
                d3.quantile(d, .75)
            ];
	};

	// Perform a numeric sort on an array
	var sortNumber = function (a, b) {
		return a - b;
	};
	var barCharts = [];
	var tabIds = ["barGraphPerTask", "barGraphPerFleet"];

	var visualize = function (url, element, index) {
		d3.json(url).then(function (json) {
			barWidth = 25;

			// low utilization minutes per operator
			var lowUtilMinutes = [];
			var highUtilMinutes = [];
			var lowUtilTeams = [];
			var highUtilTeams = [];
			var numMinutes = json.timeUtilization[0][0].length; // how many 10 minutes
			var numFactors = 6; // 60 minutes = 1 hour
			var numHours = Math.ceil(numMinutes / numFactors); // how many hours

			// parse json file into groupCounts
			var groupCounts = {};
			// number of operators in each team
			var groupLength = json.teamSize;
			var groupName = json.teamName; // operator team name
			//var globalCounts = [];
			// averageTaskUtilization [operator][replication]
			// timeUtilization        [operator][replication][time]
			var k = -1;
			// number of operators
			var numOps = json.operatorName.length;

			// Delete Equal Operators
			for (var i = 0, j = 0; i < groupLength.length; i++) {

				var key = json.operatorName[j + groupLength[i] - 1];
				if (key == "Equal Operator") {
					json.operatorName.splice(j + groupLength[i] - 1, 1); // delete equal operator team name
					json.timeUtilization.splice(j + groupLength[i] - 1, 1); // delete utilization for AI...
					groupLength[i]--; // decrease the length
					numOps--;
				}

				j += groupLength[i];
			}
			// adjust width with the number of operator teams and total operators
			//            if (groupLength.length > 10 || numOps > 20) {
			//                totalWidth = 960 + (numOps - 10 + groupLength.length) * barWidth * 2;
			//                width = totalWidth - margin.left - margin.right;
			//            } else {
			//                totalWidth = 960;
			//                width = totalWidth - margin.left - margin.right;
			//            }

			// Convert 10 mins interval into 1 hours
			// calculate high/low workload minutes per each operator
			var temp = [];
			for (var i = 0, j = 0; i < numOps; i++) { // for each operators
				var key = json.operatorName[i];
				groupCounts[key + "_" + i] = [];
				lowUtilMinutes[i] = [];
				highUtilMinutes[i] = [];

				for (var j = 0; j < json.timeUtilization[i].length; j++) { // for each replications
					for (var k = 0; k < numHours; k++) {
						temp[k] = 0;
					}

					// Add utilization per  1 hour
					for (var k = 0; k < numMinutes; k++) {
						temp[Math.floor(k / numFactors)] += json.timeUtilization[i][j][k];
					}

					// Average it to caculate the hour utilization
					for (var k = 0; k < numHours; k++) {
						temp[k] /= numFactors;
					}

					groupCounts[key + "_" + i] = groupCounts[key + "_" + i].concat(temp);
					lowUtilMinutes[i][j] = 0;
					highUtilMinutes[i][j] = 0;

					for (var k = 0; k < numHours; k++) {
						if (temp[k] > 0.7) highUtilMinutes[i][j] += numFactors * 10;
						if (temp[k] < 0.3) lowUtilMinutes[i][j] += numFactors * 10;
					}
				}
			}

			// average over each team for high/low util minutes
			var avg = 0;
			for (i = 0, j = 0; i < groupLength.length; i++) {
				for (k = j + 1; k < j + groupLength[i]; k++) {
					highUtilMinutes[j].concat(highUtilMinutes[k]);
					lowUtilMinutes[j].concat(lowUtilMinutes[k]);
				}
				avg = d3.mean(highUtilMinutes[j]);
				//console.log("High Util", highUtilMinutes[j], avg);
				if (avg >= numHours * numFactors / 2) {
					highUtilTeams.push(i);
				}
				avg = d3.mean(lowUtilMinutes[j]);
				//console.log("Low Util", lowUtilMinutes[j], avg);
				if (avg >= numHours * numFactors / 2) {
					lowUtilTeams.push(i);
				}
				j += groupLength[i];
			}

			k = highUtilTeams.length;
			sim.resultSettings.highWorkloadTeams = "";
			if (k === 0) sim.resultSettings.highWorkloadTeams = "No team";
			else {
				for (i = 0; i < k; i++) {
					if (i < k - 2)
						sim.resultSettings.highWorkloadTeams += groupName[i] + ", ";
					else if (i === k - 2)
						sim.resultSettings.highWorkloadTeams += groupName[i] + " and ";
					else
						sim.resultSettings.highWorkloadTeams += groupName[i];
				}
			}

			k = lowUtilTeams.length;
			sim.resultSettings.lowWorkloadTeams = "";
			if (k === 0) sim.resultSettings.lowWorkloadTeams = "No team";
			else {
				for (i = 0; i < k; i++) {
					if (i < k - 2)
						sim.resultSettings.lowWorkloadTeams += groupName[i] + ", ";
					else if (i === k - 2)
						sim.resultSettings.lowWorkloadTeams += groupName[i] + " and ";
					else
						sim.resultSettings.lowWorkloadTeams += groupName[i];
				}
			}

			console.log("Utilization GroupCounts ", groupCounts);
			console.log("Utilization GroupLength ", groupLength);

			// create tabviews with number to match the number of op teams

			var tabLength = $("#" + tabIds[0] + " .nav-tabs li").length;
			//console.log("Tab length", tabLength, groupLength.length);
			if (groupLength.length > tabLength) {
				// add more tabs
				for (j = 0; j < tabIds.length; j++) {
					for (i = tabLength; i < groupLength.length; i++) {
						var tabId = tabIds[j] + 'Tab_' + i;
						var liId = tabIds[j] + "Li_" + i;
						$("#" + tabIds[j] + " .nav-tabs").append('<li class="nav-item" id="' + liId + '"><a href="#' + tabId + '" data-toggle="tab" class="nav-link">' + groupName[i] + '</a></li>');
						$("#" + tabIds[j] + " .tab-content").append('<div class="tab-pane table-responsive" id="' + tabId + '"><svg id="' + tabIds[j] + i + '" width="900" height="450"></svg></div>');
					}
				}
			} else if (groupLength.length < tabLength) {
				for (j = 0; j < tabIds.length; j++) {
					// remove tabsbarGraphPerFleet
					for (i = tabLength - 1; i >= groupLength.length; i--) {
						var tabId = tabIds[j] + 'Tab_' + i;
						var liId = tabIds[j] + "Li_" + i;
						console.log(tabId);
						$("#" + liId).remove();
						$("#" + tabId).remove();
					}
				}
			}

			// Create a Bar chart for each team
			for (j = 0; j < tabIds.length; j++) {
				for (i = 0; i < groupLength.length; i++) {
					var svgId = '#' + tabIds[j] + i;
					if (barCharts[i * 2 + j] === undefined)
						barCharts[i * 2 + j] = new BarChartWithError(i, j);

					barCharts[i * 2 + j].drawBarChartWithError(json, groupName[i], svgId);
				}

				// Just activate first tab
				$("#" + tabIds[j] + " .nav-tabs li").children('a').first().click();
			}

			// Sort group counts so quantile methods work
			for (var key in groupCounts) {
				var groupCount = groupCounts[key];
				groupCounts[key] = groupCount.sort(sortNumber);
			}

			// Prepare the data for the box plots
			var boxPlotData = [];
			var lk = -1;
			sim.resultSettings.busyTimePerOp = "";
			for (i = 0; i < numOps; i++) {
				var opName = json.operatorName[i];
				key = opName + "_" + i;
				groupCount = groupCounts[key];

				var record = {};
				var localMin = d3.min(groupCount);
				var localMax = d3.max(groupCount);

				record["key"] = key;
				record["index"] = i;
				record["okey"] = opName;
				record["counts"] = groupCount;
				record["quartile"] = boxQuartiles(groupCount);
				record["whiskers"] = [localMin, localMax];
				var k = +opName.substr(opName.lastIndexOf("No. ")) - 1;
				if (isNaN(k) || k < 0) k = lk + 1;
				lk = k;
				record["color"] = colorScale[k];
				//console.log(k);
				boxPlotData.push(record);

				sim.resultSettings.busyTimePerOp += json.operatorName[i] + " was between " + (record["quartile"][0] * 100).toFixed(0) + "-" + (record["quartile"][2] * 100).toFixed(0) + "% busy";
				if (i === numOps - 2) sim.resultSettings.busyTimePerOp += ", and ";
				else if (i < numOps - 2) sim.resultSettings.busyTimePerOp += ', ';
			}

			// calculat tick location within 0 ~ width - 20
			// width -= 50;
			var xTickLoc = [];
			var xTickVal = [];
			var xTickStr = [];
			var barWidthExpected = Math.floor(width / (groupLength.length - 1 + numOps));
			var xStart = 0;
			var xEnd = groupLength[0] * barWidthExpected;
			var xAdjust = true;
			if (barWidth > barWidthExpected) {
				barWidth = Math.floor(barWidthExpected);
				xAdjust = false;
			}

			for (i = 0, j = 0; i < groupLength.length; i++) {
				j += groupLength[i];
				xTickVal[i] = (xStart + xEnd) / 2;
				xTickStr[i] = groupName[i];

				if (i < groupLength.length - 1) {
					xStart = xEnd + barWidthExpected;
					xEnd = xStart + (groupLength[i + 1]) * barWidthExpected;
				}
			}

			xStart = 0;
			xEnd = groupLength[0] * barWidthExpected;
			for (var i = 0, j = 0, k = 0; i < numOps; i++) {
				if (xAdjust) { // enough width
					xTickLoc[i] = barWidth * j + (xStart + xEnd - barWidth * groupLength[k]) / 2;
					if (++j >= groupLength[k]) {
						j = 0;
						xStart = xEnd + barWidthExpected;
						k++;
						xEnd = xStart + groupLength[k] * barWidthExpected;
					}
				} else { // shrink down the barWdith
					xTickLoc[i] = barWidth * (i + k);
					if (++j >= groupLength[k]) {
						j = 0;
						k++;
					}
				}
			}
			//console.log("x Tick Location: ", xTickLoc, barWidthExpected, barWidth, width);
			// Compute an ordinal xScale for the keys in boxPlotData
			var xScale = d3.scaleLinear()
				.domain([0, width])
				.rangeRound([0, width]);
			//.padding([0.5]);

			// Compute a global y scale based on the global counts
			var yScale = d3.scaleLinear()
				.domain([0, 1])
				.range([height, 20]);

			// Setup the svg and group we will draw the box plot in
			var svg = d3.select(element);
			svg.selectAll("*").remove();

			var g = svg.attr("width", totalWidth)
				.attr("height", totalHeight)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// Move the left axis over 55 pixels, and the top axis over 35 pixels
			var axisG = g.append("g").attr("transform", "translate(0,0)");
			var axisBG = g.append("g").attr("transform", "translate(0," + (height) + ")");

			// Setup the group the box plot elements will render in
			//var g = svg.append("g")
			//    .attr("transform", "translate(0,0)");

			// Draw the box plot vertical lines
			var verticalLines = g.selectAll(".verticalLines")
				.data(boxPlotData)
				.enter()
				.append("line")
				.attr("x1", function (datum) {
					return xScale(xTickLoc[datum.index]) + barWidth / 2;
				})
				.attr("y1", function (datum) {
					var whisker = datum.whiskers[0];
					return yScale(whisker);
				})
				.attr("x2", function (datum) {
					return xScale(xTickLoc[datum.index]) + barWidth / 2;
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
					return xScale(xTickLoc[datum.index]);
				})
				.attr("y", function (datum) {
					return yScale(datum.quartile[2]);
				})
				.attr("fill", function (datum) {
					return datum.color;
				})
				.attr("stroke", "#000")
				.attr("stroke-width", 1);

			// Draw the invisible boxes of the box plot for making clickable area larger
			var rects = g.selectAll(".clickable")
				.data(boxPlotData)
				.enter()
				.append("rect")
				.attr("width", barWidth)
				.attr("height", function (datum) {
					var quartiles = datum.quartile;
					var height = yScale(0) - yScale(1);
					return height;
				})
				.attr("x", function (datum) {
					return xScale(xTickLoc[datum.index]);
				})
				.attr("y", function (datum) {
					return yScale(1);
				})
				.attr("fill", "none")
				.attr("class", "clickable")
				.attr("pointer-events", "visible")
				.attr("stroke", "transparent")
				//               .style("cursor", "pointer")
				.attr("stroke-width", 1);

			g.selectAll(".clickable")
				.on("mouseover", function (d, i) {
					//console.log(d, i);
					d3.select(this).attr("stroke", "blue").attr("stroke-width", 0.8);
					div.transition()
						.duration(200)
						.style("opacity", .9);

					div.html("<table><tr><td>Group:</td><td>" + d.okey +
							"</td></tr><tr><td>Max:</td><td align='right'>" + (d.whiskers[1] * 100).toFixed(2) +
							"%</td></tr><tr><td>Q3:</td><td align='right'>" + (d.quartile[2] * 100).toFixed(2) +
							"%</td></tr><tr><td>Median:</td><td align='right'>" + (d.quartile[1] * 100).toFixed(2) +
							"%</td></tr><tr><td>Q1:</td><td align='right'>" + (d.quartile[0] * 100).toFixed(2) +
							"%</td></tr><tr><td>Min:</td><td align='right'>" + (d.whiskers[0] * 100).toFixed(2) +
							"%</td></tr></table>")
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
					//$("#barChart" + index).modal();
				});

			// Now render all the horizontal lines at once - the whiskers and the median
			var horizontalLineConfigs = [
            // Top whisker
				{
					x1: function (datum) {
						return xScale(xTickLoc[datum.index])
					},
					y1: function (datum) {
						return yScale(datum.whiskers[0])
					},
					x2: function (datum) {
						return xScale(xTickLoc[datum.index]) + barWidth
					},
					y2: function (datum) {
						return yScale(datum.whiskers[0])
					}
                },
            // Median line
				{
					x1: function (datum) {
						return xScale(xTickLoc[datum.index])
					},
					y1: function (datum) {
						return yScale(datum.quartile[1])
					},
					x2: function (datum) {
						return xScale(xTickLoc[datum.index]) + barWidth
					},
					y2: function (datum) {
						return yScale(datum.quartile[1])
					}
                },
            // Bottom whisker
				{
					x1: function (datum) {
						return xScale(xTickLoc[datum.index])
					},
					y1: function (datum) {
						return yScale(datum.whiskers[1])
					},
					x2: function (datum) {
						return xScale(xTickLoc[datum.index]) + barWidth
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
				.call(axisLeft.ticks(null, 's').tickFormat(function (d) {
					return d3.format(".0f")(d * 100);
				}));
			// Setup a series axis on the bottom
			var axisBottom = d3.axisBottom(xScale);
			if (groupLength.length > 7) {
				axisBG.append("g").call(axisBottom.tickValues([]));
			} else {
				axisBG.append("g")
					.call(axisBottom.tickValues(xTickVal).tickFormat(function (d, i) {
						return xTickStr[i];
					}));
			}

			// text label for the x axis
			svg.append("text")
				.attr("transform",
					"translate(" + (width / 2) + " ," +
					(height + margin.top + margin.bottom - 5) + ")")
				.style("text-anchor", "middle")
				.attr("font-weight", "bold")
				.text(sim.textStrings.operator + " Team");

			// text label for the y axis
			svg.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 0) // - margin.left)
				.attr("x", 0 - (height / 2))
				.attr("dy", "1em")
				.style("text-anchor", "middle")
				.attr("font-weight", "bold")
				.text("Utilization (%)");

		});
	};

	return {
		visualize: visualize
	};
})();

var TrafficLevelBarChart = (function () {
	var levels = {
		"h": 2,
		"m": 1,
		"l": 0,
		"0": -0.1
	};

	var drawTrafficLevelBarChart = function (barChartId, trafficLevels, isChanging) {
		var trafficHours = trafficLevels.length;

		var data = [];
		for (var i = 0; i < trafficHours; i++) {
			data[i] = {
				hour: i,
				level: (isChanging) ? trafficLevels[i] : 'm'
			};
		}

		//console.log(data);
		var svg = d3.select(barChartId),
			margin = {
				top: 20,
				right: 20,
				bottom: 50,
				left: 50
			},
			width = +svg.attr("width") - margin.left - margin.right,
			height = +svg.attr("height") - margin.top - margin.bottom;

		svg.selectAll("*").remove();
		var x = d3.scaleLinear().rangeRound([0, width]),
			y = d3.scaleLinear().rangeRound([height, 0]);

		var g = svg.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		x.domain([-0.1, trafficHours]);

		y.domain([-0.1, 2.3]);

		var xTickSkip = (trafficHours > 8) ? 2 : 1;
		var xBandWidth = width / trafficHours;
		var xPadding = Math.round(xBandWidth * 0.1);
		g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x).ticks(trafficHours).tickSizeOuter(0).tickFormat(function (d, i) {
				if (Math.round(d) == d && i % xTickSkip == 0) {
					return d;
				}
			}))

			.append("text")
			.attr("transform", "translate(" + ((width / 2) - 30) + ",45)")
			.attr("x", 1)
			.attr("dx", ".71em")
			.attr("fill", "black")
			.attr("font-size", "13")
			.text("Time (Hour)");

		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y).ticks(3).tickSizeOuter(0))

			.append("text")
			.attr("transform", "translate(-50,0) rotate(-90)")
			.attr("y", 6)
			.attr("dy", "0.71em")
			.attr("text-anchor", "end")
			.attr("fill", "black")
			.attr("font-size", "13")
			.text("Traffic Level (0 = Low, 1 = Med, 2 = High)");

		g.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("fill", "steelblue")
			.attr("x", function (d) {
				return x(d.hour) + xPadding;
			})
			.attr("y", function (d) {
				return y(levels[d.level]);
			})
			.attr("width", xBandWidth - 2 * xPadding)
			.attr("height", function (d) {
				return height - y(levels[d.level]);
			})
			.on("mouseover", function (d) {
				d3.select(this).style("fill", "brown");
			})
			.on("mouseout", function (d) {
				d3.select(this).style("fill", "steelblue");
			});
	}

	return {
		drawTrafficLevelBarChart: drawTrafficLevelBarChart
	};
})();

var FailedTaskAnalysis = (function () {
	var taskRecord = {};
	var pie = null;

	// refreshPie until correct label size is specified
	var refreshPie = function () {
		var isRefreshRequired = false;
		if (pie === null)
			isRefreshRequired = true;
		else if (pie.outerLabelGroupData[0] &&
			pie.outerLabelGroupData[0].h === 0) {
			pie.redraw();
			isRefreshRequired = true;
		}

		if (isRefreshRequired)
			setTimeout(function () {
				FailedTaskAnalysis.refreshPie();
			}, 200);
	}
	var analyze = function (filename, graphId, tableId) {
		if (pie !== null) {
			pie.destroy();
			pie = null;
		}

		d3.json(filename).then(function (json) {
			taskRecord = json;
			//console.log(json);

			var ft = json.numFailedTask;
			var tt = json.numTotalTask;

			// replication, phase, team, task type
			var numReps = json.numFailedTask.length;
			var numPhases = ft[0].length;
			var numTeams = json.teamName.length;
			var numTasks = json.taskName.length;

			var data = [{}, {}, {}, {}, {}];
			var color = ["#109618", "#DC3912", "#FF66CC", "#FF9900", "#990099"];
			//console.log(numReps, numPhases, numTeams, numTasks);

			for (var i = 0; i < 5; i++) {
				data.push({});
				data[i].value = tt[i];
				data[i].color = color[i];
			}
			data[0].label = "Successful Tasks";
			data[1].label = "Missed Tasks";
			data[2].label = "Incomplete Tasks";
			data[3].label = "Failed Tasks and Not Caught";
			data[4].label = "Failed Tasks and Caught";

			console.log(data);

			pie = new d3pie(graphId, {
				"size": {
					"canvasHeight": 400,
					"canvasWidth": 590,
					"pieOuterRadius": "80%"
				},
				"data": {
					"content": data
				},
				"labels": {
					"outer": {
						"format": "label-percentage1",
						"pieDistance": 32
					},
					"inner": {
						"format": "value",
						"hideWhenLessThanPercentage": 3
					},
					"mainLabel": {
						"font": "verdana"
					},
					"percentage": {
						"color": "#716161",
						"font": "verdana",
						"decimalPlaces": 1
					},
					"value": {
						"color": "#e1e1e1",
						"font": "verdana"
					},
					"lines": {
						"enabled": true,
						"color": "#cccccc"
					},
					"truncation": {
						"enabled": true
					}
				},
				"tooltips": {
					"enabled": true,
					"type": "placeholder",
					"string": "# of {label} is {value}, which is {percentage}%.",
				},
				"effects": {
					load: {
						effect: "none"
					}
				},
			});

			var dataSet = [];

			for (var i = 0; i < numTeams; i++) {
				for (var j = 0; j < numTasks; j++) {
					var data = [];
					data[0] = json.teamName[i];
					data[1] = json.taskName[j];
					data[2] = 0;
					data[5] = 0;
					data[8] = 0;
					data[11] = 0;
					for (var m = 0; m < 4; m++) {
						data[3 + m * 3] = json.averageFailed[i][j][m].toFixed(2);
						data[4 + m * 3] = json.stdFailed[i][j][m].toFixed(2);
					}
					for (var k = 0; k < numReps; k++) {
						for (var l = 0; l < numPhases; l++) {
							for (var m = 0; m < 4; m++) {
								data[m * 3 + 2] += json.numFailedTask[k][l][i][j][m];
							}
						}
					}
					dataSet.push(data);
				}
			}

			$(tableId).DataTable({
				data: dataSet,
				"destroy": true,
				"dom": 'Brtip',
				buttons: [
                    //'pageLength',
					{
						extend: 'csv',
						text: '<i class="fas fa-file-download"></i> Download CSV',
						customize: function (doc) {
							return ",,Missed Tasks,,,Incomplete Tasks,,,Failed Tasks and Not Caught,,,Failed Tasks and Caught\n" + doc;
						}
                    }
                ],
				columnDefs: [
					{
						targets: 'right-align',
						className: 'dt-body-right'
                    }
                ],
				"initComplete": function (settings, json) {
					// Apply the search
					var api = this.api();
					$(tableId).on('keyup change', 'input', function () {
						var column = api.column($(this).data("column"));

						if (column.search() !== this.value) {
							column.search(this.value).draw();
						}
					});

					$(tableId).removeClass("d-none");
				}
			});


		});
	};
	return {
		analyze: analyze,
		refreshPie: refreshPie
	};
})();
