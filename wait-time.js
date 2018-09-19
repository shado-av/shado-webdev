var WaitTime = (function () {
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

    // Perform a numeric sort on an array
    var sortNumber = function (a, b) {
        return a - b;
    };
    var barCharts = [];
    var tabIds = [ "barWaitTimePerTask", "barWaitTimePerFleet"];

    var visualize = function (url, element, index) {
        d3.json(url).then(function (json) {

            // parse json file into groupCounts
            var groupCounts = {};
            // number of operators in each team
            var groupLength = json.teamSize;
            var groupName = json.teamName;     // operator team name

            // timeWaitTime        [operator][replication][time]
            var k = -1;
            // number of operators
            var numOps = json.operatorName.length;

			// Delete Equal Operators
 			for (var i = 0, j = 0; i < groupLength.length; i++) {

				var key = json.operatorName[j + groupLength[i] - 1];
				if (key == "Equal Operator") {
					json.operatorName.splice(j+groupLength[i]-1, 1);	// delete equal operator team name
					json.timeWaitTime.splice(j+groupLength[i]-1, 1); // delete waitTime...
					groupLength[i]--;												   // decrease the length
					numOps--;
				}

				j += groupLength[i];
			}
			//console.log(json.operatorName, json.timeWaitTime, groupLength);
            // adjust width with the number of operator teams and total operators
//            if (groupLength.length > 10 || numOps > 20) {
//                totalWidth = 960 + (numOps - 10 + groupLength.length) * barWidth * 2;
//                width = totalWidth - margin.left - margin.right;
//            } else {
//                totalWidth = 960;
//                width = totalWidth - margin.left - margin.right;
//            }

            // operator loop
            for (var i = 0; i < numOps; i++) {
                var key = json.operatorName[i];
                groupCounts[key + "_" + i] = [];

                // replication loop
                for(var j=0; j < json.timeWaitTime[i].length; j++) {
                    //groupCounts[key + "_" + i] = groupCounts[key + "_" + i].concat(json.timeWaitTime[i][j]);
                    groupCounts[key + "_" + i].push(d3.sum(json.timeWaitTime[i][j]));
//                    if (i==0 && j>=95) {
//                        console.log(json.timeWaitTime[i][j], d3.sum(json.timeWaitTime[i][j]), groupCounts[key + "_" + i][j]);
//                        console.log(groupCounts);
//                    }
                }
            }
            console.log("WaitGroupCounts ", groupCounts);
            console.log("WaitGroupLength ", groupLength);

            // create tabviews with number to match the number of op teams
            var tabLength = $("#" + tabIds[0] + " .nav-tabs li").length;
            // console.log("Tab length", tabLength, groupLength.length);
            if (groupLength.length > tabLength) {
                // add more tabs
                for (j=0; j<tabIds.length; j++) {
                    for(i = tabLength; i<groupLength.length;i++) {
                        var tabId = tabIds[j] + 'Tab_' + i;
                        var liId = tabIds[j] + "Li_" + i;
                        $("#" + tabIds[j] + " .nav-tabs").append('<li class="nav-item" id="' + liId + '"><a href="#' + tabId + '" data-toggle="tab" class="nav-link">'+ groupName[i] +'</a></li>');
                        $("#" + tabIds[j] + " .tab-content").append('<div class="tab-pane table-responsive" id="' + tabId + '"><svg id="' + tabIds[j] + i + '" width="900" height="450"></svg></div>');
                    }
                }
            } else if (groupLength.length < tabLength) {
                for (j=0; j<tabIds.length; j++) {
                    // remove tabsbarGraphPerFleet
                    for(i = tabLength - 1; i>=groupLength.length;i--) {
                        var tabId = tabIds[j] + 'Tab_' + i;
                        var liId = tabIds[j] + "Li_" + i;
                        console.log(tabId);
                        $("#"+liId).remove();
                        $("#"+tabId).remove();
                    }
                }
            }

            // Create a Bar chart for each team
            for (j=0; j<tabIds.length; j++) {
                for (i = 0; i < groupLength.length; i++) {
                    var svgId = '#' + tabIds[j] + i;
                    if (barCharts[i*2 +j] === undefined)
                        barCharts[i * 2 + j] = new BarChartWithError(i, j, "Wait Time");

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
            var yMax = 0;
			var lk = -1;
            for (i=0; i<numOps; i++) {
                var opName = json.operatorName[i];
                key = opName + "_" + i;
                groupCount = groupCounts[key];

                var record = {};
                //var localMin = d3.min(groupCount);
                //var localMax = d3.max(groupCount);
                //var localSum = d3.sum(groupCount[i]);

                record["key"] = key;
                record["index"] = i;
                record["okey"] = opName;
                record["counts"] = groupCount;
				record["avg"] = d3.mean(groupCount);

				if (groupCount.length === 1) {
					record["std"] = 0; // undefined...
				} else {
					record["std"] = d3.deviation(groupCount);
				}
                var maxCan = d3.max(groupCount);
                if (yMax < record["avg"] + record["std"])
                    yMax = record["avg"] + record["std"];
                var k = +opName.substr(opName.lastIndexOf("No. ")) - 1;
				if (isNaN(k) || k < 0) k = lk + 1;
				lk = k;
                record["color"] = colorScale[ k ];
                boxPlotData.push(record);
            }
            console.log("WaitPlotData", boxPlotData);

            // calculat tick location within 0 ~ width - 20
            // width -= 50;
            var xTickLoc = [];
            var xTickVal = [];
            var xTickStr = [];
            var barWidthExpected = Math.floor(width / (groupLength.length-1+numOps));
            var xStart = 0;
            var xEnd = groupLength[0] * barWidthExpected;
            var xAdjust = true;
            if (barWidth > barWidthExpected) {
                barWidth = Math.floor(barWidthExpected);
                xAdjust = false;
            }

            for (i = 0, j = 0; i < groupLength.length; i++) {
                j+=groupLength[i];
                xTickVal[i] = (xStart + xEnd)/2;
                xTickStr[i] = groupName[i];

                if (i<groupLength.length-1) {
                    xStart = xEnd + barWidthExpected;
                    xEnd = xStart + (groupLength[i+1]) * barWidthExpected;
                }
            }

            xStart = 0;
            xEnd = groupLength[0] * barWidthExpected;
            for (var i = 0, j = 0, k = 0; i < numOps; i++) {
                if (xAdjust) { // enough width
                    xTickLoc[i] = barWidth * j + (xStart + xEnd - barWidth * groupLength[k])/2;
                    if (++j>=groupLength[k]) {
                        j=0; xStart = xEnd + barWidthExpected;
                        k++; xEnd = xStart + groupLength[k] * barWidthExpected;
                    }
                } else { // shrink down the barWdith
                    xTickLoc[i] = barWidth * (i + k);
                    if (++j>=groupLength[k]) { j=0; k++; }
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
                .domain([0, yMax])
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

            // Draw the boxes of the box plot, filled in white and on top of vertical lines
            var rects = g.selectAll("rect")
                .data(boxPlotData)
                .enter()
                .append("rect")
                .attr("width", barWidth)
                .attr("height", function (datum) {
                    var height = yScale(0) - yScale(datum.avg);
                    return height;
                })
                .attr("x", function (datum) {
                    return xScale(xTickLoc[datum.index]);
                })
                .attr("y", function (datum) {
                    return yScale(datum.avg);
                })
                .attr("fill", function (datum) {
                    return datum.color;
                })
                .attr("stroke", "#000")
                .attr("stroke-width", 1);

            // Draw the box plot vertical lines
            var verticalLines = g.selectAll(".verticalLines")
                .data(boxPlotData)
                .enter()
                .append("line")
                .attr("x1", function (datum) {
                    return xScale(xTickLoc[datum.index]) + barWidth / 2;
                })
                .attr("y1", function (datum) {
                    var whisker = (datum.avg - datum.std > 0) ? datum.avg - datum.std : 0;
                    return yScale(whisker);
                })
                .attr("x2", function (datum) {
                    return xScale(xTickLoc[datum.index]) + barWidth / 2;
                })
                .attr("y2", function (datum) {
                    var whisker = datum.avg + datum.std;
                    return yScale(whisker);
                })
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("fill", "none");

            // Draw the invisible boxes of the box plot for making clickable area larger
            var rects = g.selectAll(".clickable")
                .data(boxPlotData)
                .enter()
                .append("rect")
                .attr("width", barWidth)
                .attr("height", function (datum) {
                    var quartiles = datum.quartile;
                    var height = yScale(0) - yScale(yMax);
                    return height;
                })
                .attr("x", function (datum) {
                    return xScale(xTickLoc[datum.index]);
                })
                .attr("y", function (datum) {
                    return yScale(yMax);
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

                    div.html("<table><tr><td>Team:</td><td>" + d.okey +
                            "</td></tr><tr><td>Wait Time Avg.:</td><td align='right'>" + (d.avg).toFixed(2) +
                            "</td></tr><tr><td>Std. Dev.:</td><td align='right'>" + (d.std).toFixed(2) +
                            "</td></tr></table>")
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
            // Bottom whisker
                {
                    x1: function (datum) {
                        return xScale(xTickLoc[datum.index])
                    },
                    y1: function (datum) {
                        return yScale((datum.avg - datum.std > 0) ? datum.avg - datum.std : 0);
                    },
                    x2: function (datum) {
                        return xScale(xTickLoc[datum.index]) + barWidth
                    },
                    y2: function (datum) {
                        return yScale((datum.avg - datum.std > 0) ? datum.avg - datum.std : 0);
                    }
                },
            // Top whisker
                {
                    x1: function (datum) {
                        return xScale(xTickLoc[datum.index])
                    },
                    y1: function (datum) {
                        return yScale(datum.avg + datum.std)
                    },
                    x2: function (datum) {
                        return xScale(xTickLoc[datum.index]) + barWidth
                    },
                    y2: function (datum) {
                        return yScale(datum.avg + datum.std)
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
                .call(axisLeft.ticks(null, 's').tickFormat(d3.format(".1f")))

            // Setup a series axis on the bottom
            var axisBottom = d3.axisBottom(xScale);
			if (groupLength.length > 7) {
				axisBG.append("g").call(axisBottom.tickValues([]));
			} else {
            	axisBG.append("g")
                	.call(axisBottom.tickValues(xTickVal).tickFormat(function(d, i) {
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
                .text("Wait Time (minutes)");

        });
    };

    return {
        visualize: visualize
    };
})();
