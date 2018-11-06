const EventBus = new Vue();

var sim = new Vue({
    el: '#shado-sim',
    data: {
		// 0.9.5 add expertiseOS for other sources per each operator
		// 0.9.4 add Other Sources
        // 0.9.3 add flex position, change traffic per fleet
        // 0.9.2 remove phase and add turnOver settings
        // 0.9.1 add opExpertise settings
        version: "0.9.5", // data version for checking valid data when loading JSON file
        numReps: 100, // number of replications (1 - 1000)

        /* ------------------------------
         * GLOBAL/BASIC SETTINGS
         * ------------------------------ */

        globalSettings: {
            simType: "Rail", // simulation type (aviation, railroad, ground)
            numHours: 8, // number of hours in shift (1 - 12)
            diffTrafficLevels: "n",
            trafficLevels: ["m", "m", "m", "m", "m", "m", "m", "m"], // traffic levels l (low), m (medium), h (high)
            isTransition: 'y',            // Has this shift any transitioning peroid?
            transitionDesc: ["Beginning", "Ending"],
            hasTransition: [false, false],  // has transitioning period at the beginning or at the ending
            transitionDists: ['U', 'U'],
            transitionPms: [[5,10], [12,15]],
            exoFactorsType: [false, false]
        },

        /* ------------------------------
         * TASKS SETTINGS
         * ------------------------------ */

        taskSettings: {
            numNameTask: 1, // for just naming Custom Task #
            tasks: // array of individual task objects
                [{
                        name: "Communicating",
                        include: true,
                        isCustom: false,
                        essential: "n",
                        exoType2Aff: "n",
                        interruptable: "n",
                        affTeamCoord: "n",
                        arrivalDistribution: ["E"],
                        arrivalParam: [
                            [60],
                        ],
                        serviceDistribution: ["U"],
                        serviceParam: [
                            [0.5, 2],
                        ],
                        expireDistribution: ["N"],
                        expireParam: [
                            [1440],
                        ],
                        affectByIROPS: [0],
                        humanErrorSelect: "0",
                        humanErrorProb: [
                            humanErrorProbConfig["0"].value,
                        ],

                        leadTask: -1,
                    },
                    {
                        name: "Actuation",
                        include: true,
                        isCustom: false,
                        essential: "n",
                        exoType2Aff: "n",
                        interruptable: "n",
                        affTeamCoord: "n",
                        arrivalDistribution: ["E"],
                        arrivalParam: [
                            [60],
                        ],
                        serviceDistribution: ["U"],
                        serviceParam: [
                            [0.5, 2],
                        ],
                        expireDistribution: ["N"],
                        expireParam: [
                            [1440],
                        ],
                        affectByIROPS: [0],
                        humanErrorSelect: "0",
                        humanErrorProb: [
                            humanErrorProbConfig["0"].value,,
                        ],

                        leadTask: -1,
                    },
                    {
                        name: "Directive Mandatory",
                        include: true,
                        isCustom: false,
                        essential: "n",
                        exoType2Aff: "n",
                        interruptable: "n",
                        affTeamCoord: "n",
                        arrivalDistribution: ["E"],
                        arrivalParam: [
                            [60],
                        ],
                        serviceDistribution: ["U"],
                        serviceParam: [
                            [0.5, 2],
                        ],
                        expireDistribution: ["N"],
                        expireParam: [
                            [1440],
                        ],
                        affectByIROPS: [0],
                        humanErrorSelect: "0",
                        humanErrorProb: [
                            humanErrorProbConfig["0"].value,
                        ],

                        leadTask: -1,
                    }
                ]
        },

        /* ------------------------------
         * OPERATOR SETTINGS
         * ------------------------------ */

        operatorSettings: {
            numTeams: 2, // number of teams (2 - 5)
            numNameTeam: 3, // for just naming
            hasFlexPosition: 'n',
            flexTeamSize: 1,
            teams: // array of individual team objects
                [{
                        name: "Operator Team 1",
                        size: 1,
                        strategy: "FIFO",
                        comms: "N",
                        tasks: [0, 1],
                        expertise: [[1,1],[1,1],[0,1]],
					    expertiseOS: [0, 0, 0],
                        priority: [
                            [1, 4, 6],
                        ],
                        AIDA: {
                            AIDAType: [false, false, false],
                            ETServiceTimeQ: "E",
							ETErrorRateQ: "E",
                            ETFailThresholdQ: "E",
                            ETServiceTime: 2,
                            ETErrorRate: 2,
                            ETFailThreshold: 2,
                            IATasks: [],
                            IALevel: 'S',
                            TCALevel: 'S'
                        },
                        failThresh: [
                            [1, 2, 3],
                        ]
                    },
                    {
                        name: "Operator Team 2",
                        size: 1,
                        strategy: "FIFO",
                        comms: "N",
                        tasks: [1, 2],
                        expertise: [[0,1],[1,1],[1,1]],
					    expertiseOS: [0, 0, 0],
                        priority: [
                            [1, 1, 1],
                        ],
                        AIDA: {
                            AIDAType: [false, false, false],
                            ETServiceTimeQ: "E",
							ETErrorRateQ: "E",
                            ETFailThresholdQ: "E",
                            ETServiceTime: 2,
                            ETErrorRate: 2,
                            ETFailThreshold: 2,
                            IATasks: [],
                            IALevel: 'S',
                            TCALevel: 'S'
                        },
                        failThresh: [
                            [1, 2, 3],
                        ]
                    }
                ]
        },

        /* ------------------------------
         * Fleet Settings
         * ------------------------------ */

        fleetSettings: {
            fleetTypes: 2, // number of fleets (2 - 5)
            numNameFleet: 3, // for just naming
            fleets: [{
                    name: "Fleet 1",
                    numVehicles: 1,
                    comms: "N",
                    tasks: [0, 1],
                    diffTrafficLevels: "n",
                    trafficLevels: ["m", "m", "m", "m", "m", "m", "m", "m"], // traffic levels l (low), m (medium), h (high)
                },
                {
                    name: "Fleet 2",
                    numVehicles: 1,
                    comms: "N",
                    tasks: [1, 2],
                    diffTrafficLevels: "n",
                    trafficLevels: ["m", "m", "m", "m", "m", "m", "m", "m"], // traffic levels l (low), m (medium), h (high)
                },
            ],
			otherSources: {
				name: "Other Sources",	// not needed
				numVehicles: 1,				// not needed
				comms: "N",					// not needed
				tasks: [],
				diffTrafficLevels: "n",
				trafficLevels: ["m", "m", "m", "m", "m", "m", "m", "m"], // traffic levels l (low), m (medium), h (high)
			}
        },

        /* --------------------------------------------------------------------------------------------------------
         * Misc Settings - These values are not saved or loaded. Only needed for temporary or description purpose.
         * ------------------------------------------------------------------------------------------------------- */
        miscSettings: {
            downloadJsonData: "",
            downloadJsonVisible: false,

			// default simulation shift
			simShift: "Morning",

            // Checking busy status
            onSubmit: false,
            isSaving: false,
            isLoading: false,
            showGoButton: false,
            showGoText: "Run Simulation",
            showGoClass: "btn-success",

            viewResultsClass: "d-none",

            // This temporary stores text when input is focused. Later, this can be used to replace when user left with no text
            inputString: "",
            // This string temporariliy stores warning message
            warningMessage: "",

            // When the results is available Id is set
            sessionId: "",
            sessionQuery: "",

            globalMenuId: [
                "basic-settings-tab",
                "tasks-settings-tab",
                "fleets-settings-tab",
                "operators-settings-tab",
                "review-settings-tab",
                "view-results-tab",
            ],

            // System wide strings... usually required for Reviews.

            // Other Constants... maybe moved to env? or some variable holding constants.
            comms: { "N" : "None", "S": "Some", "F": "Full"},

            // Please match the option with the options in simulator.html
            humanErrorProb: humanErrorProbConfig,
        },
        /* --------------------------------------------------------------------------------------------------------
         * ResultSettings - Specific result settings/value when the simulation runs
         * ------------------------------------------------------------------------------------------------------- */
        resultSettings: {
            numReps: 100,
            hours: 8,
            exoFactors: [],
            busyTimePerFleet: "",
            busyTimePerTask: "",
            waitTimePerFleet: "",
            waitTimePerTask: "",
            busyTimePerOp: "",
            lowWorkloadTeams: "",
            highWorkloadTeams: "",
        },
        textStrings: textStrings.General,
    },

    /* ------------------------------
     * COMPUTED VALUES
     * ------------------------------ */
    computed: {

        /* ------------------------------
         * GLOBAL SETTINGS COMPUTED VALUES
         * ------------------------------ */

        // array of existence of turn over [0,0]
        hasTransition() {
            var to = [];
            var hasTo = this.globalSettings.hasTransition;
            for (var j = 0; j < 2; j++) {
                to[j] = hasTo[j] ? 1 : 0;
            }
            return to;
        },

        // return review string for type of exo factors
        hasTransitionForReview() {
            var hasTo = this.globalSettings.hasTransition;
            var tranRv = "None";

            if (hasTo[0] || hasTo[1]) {
                if (hasTo[0]) tranRv = "Beginning of shift";
                if (hasTo[0] && hasTo[1]) tranRv += ", Ending of shift";
                else if (hasTo[1]) tranRv = "Ending of shift";
            }

            return tranRv;
        },

        transitionPms() {
            var params = [];

            for (var j = 0; j < 2; j++) {
                if (this.globalSettings.transitionDists[j]) {
                    params.push(this.distParams(this.globalSettings.transitionDists[j],
                                                this.globalSettings.transitionPms[j]));
                }
            }
            return params;
        },

        // array of existence of exo factors and type of exo factor
        hasExogenous() {
            var exoFT = this.globalSettings.exoFactorsType;
            for (var j = 0; j < 2; j++) {
                if (typeof exoFT[j] !== "number") {
                    exoFT[j] = exoFT[j] ? 1 : 0;
                }
            }
            return exoFT;
        },

        // return review string for type of exo factors
        hasExogenousForReview() {
            var exoFT = this.globalSettings.exoFactorsType;
            var exoFTName = this.textStrings.optionExtremeCondition;
            var exoRv = "None";

            //console.log("exoFactorsName", exoFT, exoFTName);
            if (exoFT[0] || exoFT[1]) {
                if (exoFT[0]) exoRv = exoFTName[0];
                if (exoFT[0] && exoFT[1]) exoRv += ", " + exoFTName[1];
                else if (exoFT[1]) exoRv = exoFTName[1];
            }

            return exoRv;
        },
// return review string for type of exo factors
        hasExogenousForResults() {
            var exoFT = this.globalSettings.exoFactorsType;
            var exoFTName = this.textStrings.optionExtremeCondition;
            var exoRv = "";

            //console.log("exoFactorsName", exoFT, exoFTName);
            if (exoFT[0] || exoFT[1]) {
                exoRv = "with ";
                if (exoFT[0]) exoRv += exoFTName[0];
                if (exoFT[0] && exoFT[1]) exoRv += " and " + exoFTName[1];
                else if (exoFT[1]) exoRv += exoFTName[1];
            }

            return exoRv;
        },

        /* ------------------------------
         * TASK SETTINGS COMPUTED VALUES
         * ------------------------------ */

		noTasksIncluded() {
			return this.numTaskTypes[0]<1;
		},

        // true if 15 tasks
        maxTasksReached() {
            return this.numTaskTypes[0] >= 15;
        },

        // number of tasks
        numTaskTypes() {
            var nums = [];
            for (i = 0; i <= this.taskSettings.tasks.length; i++)
                nums[i] = 0;

            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].include) {
                    nums[this.taskSettings.tasks[i].leadTask + 1]++
                }
            }
            return nums;
        },

        numTotalTaskTypes() {
            var num = 0;
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].include) {
                    num++;
                }
            }
            return num;
        },

        // array containing task names
        taskNames() {
            var names = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].name && this.taskSettings.tasks[i].include) {
                    names.push(this.taskSettings.tasks[i].name);
                }
            }
            return names;
        },

        // array containing tasks affected by exogenous type 2
        exoType2Aff() {
            var exo2 = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].exoType2Aff && this.taskSettings.tasks[i].include) {
                    if (this.taskSettings.tasks[i].exoType2Aff === "y") {
                        exo2.push(1);
                    } else {
                        exo2.push(0);
                    }
                }
            }
            return exo2;
        },
        // array containing tasks affected by team coordination values
        teamCoordAff() {
            var coords = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].affTeamCoord && this.taskSettings.tasks[i].include) {
                    if (this.taskSettings.tasks[i].affTeamCoord === "y") {
                        coords.push(1);
                    } else {
                        coords.push(0);
                    }
                }
            }
            return coords;
        },
        // array containing whether each task is essential
        essential() {
            var esst = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].essential && this.taskSettings.tasks[i].include) {
                    if (this.taskSettings.tasks[i].essential === "y") {
                        esst.push(1);
                    } else {
                        esst.push(0);
                    }
                }
            }
            return esst;
        },
        // array containing whether each task is interruptable
        interruptable() {
            var intp = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].interruptable && this.taskSettings.tasks[i].include) {
                    if (this.taskSettings.tasks[i].interruptable === "y") {
                        intp.push(1);
                    } else {
                        intp.push(0);
                    }
                }
            }
            return intp;
        },

        // array containing all task arrival time distributions
        arrDists() {
            var dists = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].arrivalDistribution && this.taskSettings.tasks[i].include) {
                    dists.push(this.taskSettings.tasks[i].arrivalDistribution[0]);
                }
            }
            return dists;
        },

        // array containing all task arrival time parameters
        arrPms() {
            var params = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].arrivalParam && this.taskSettings.tasks[i].include) {
                    params.push(this.distParams(this.taskSettings.tasks[i].arrivalDistribution[0],
                                                this.taskSettings.tasks[i].arrivalParam[0]));
                }
            }
            return params;
        },

        // array containing all task service time distributions
        serDists() {
            var dists = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].serviceDistribution && this.taskSettings.tasks[i].include) {
                    dists.push(this.taskSettings.tasks[i].serviceDistribution[0]);
                }
            }
            return dists;
        },

        // array containing all task service time parameters
        serPms() {
            var params = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].serviceParam && this.taskSettings.tasks[i].include) {
                    params.push(this.distParams(this.taskSettings.tasks[i].serviceDistribution[0],
                                                this.taskSettings.tasks[i].serviceParam[0]));
                }
            }
            return params;
        },

        // array containing all task expiration time distributions
        expDists() {
            var dists = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].expireDistribution && this.taskSettings.tasks[i].include) {
                    dists.push(this.taskSettings.tasks[i].expireDistribution[0]);
                }
            }
            return dists;
        },

        // array containing all task expiration time parameters
        expPms() {
            var params = [];
            for (var i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].expireParam && this.taskSettings.tasks[i].include) {
                    params.push(this.distParams(this.taskSettings.tasks[i].expireDistribution[0],
                                                this.taskSettings.tasks[i].expireParam[0]));
                }
            }
            return params;
        },

        // array containing all tasks affected by traffic
        affByTraff() {
            var traff = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].affectByIROPS && this.taskSettings.tasks[i].include) {
                    var affected = this.taskSettings.tasks[i].affectByIROPS[0];
                    affected = affected ? 1 : 0;
                    traff.push(affected);
                }
            }
            return traff;
        },

        // array containing all task human error probabilities
        humanError() {
            var probs = [];
            for (var i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].humanErrorProb && this.taskSettings.tasks[i].include) {
                    probs.push(this.taskSettings.tasks[i].humanErrorProb[0]);
                }
            }
            return probs;
        },

        /* ------------------------------
         * OPERATOR SETTINGS COMPUTED VALUES
         * ------------------------------ */

        // sum of all operator team sizes
        numRemoteOp() {
            var sum = 0;
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].size) {
                    sum += this.operatorSettings.teams[i].size;
                }
            }
            return sum;
        },

        // is there a flex position?
        hasFlexPosition() {
            return (this.operatorSettings.hasFlexPosition === 'y') ? 1: 0;
        },

        totalOperatorTeams() {
            return this.operatorSettings.numTeams + ((this.operatorSettings.hasFlexPosition === 'y') ? 1: 0);
        },

        flexTeamSize() {
            if (this.operatorSettings.hasFlexPosition === 'y') {
                var fts = this.operatorSettings.flexTeamSize;
                if (fts < 1) fts = 1;
                if (fts > 99) fts = 99;
                return fts;
            } else
                return 0;
        },

        // array containing operator team names
        opNames() {
            var names = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].name) {
                    names.push(this.operatorSettings.teams[i].name);
                }
            }
            return names;
        },

        // array containing operator team sizes
        teamSize() {
            var sizes = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].size) {
                    sizes.push(this.operatorSettings.teams[i].size);
                }
            }
            return sizes;
        },

        // array containing operator team tasks arrays
        opTasks() {
            var tasks = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].tasks) {
                    tasks.push(this.operatorSettings.teams[i].tasks);
                } else {
                    tasks.push([]);
                }
            }
            return tasks;
        },

        // array containing operator team tasks arrays
        opExpertise() {
            var expertise = [];
            for (var i = 0; i < this.operatorSettings.teams.length; i++) {
                expertise.push([]);
                for (var j = 0; j < this.taskSettings.tasks.length; j++) {
                    if (this.taskSettings.tasks[j].include) {
                        var exps = [];
                        var opteam = this.operatorSettings.teams[i];
                        for (var k = 0; k < this.fleetSettings.fleets.length; k++) {
                            if (opteam.expertise[j] && opteam.expertise[j][k]
                                && this.fleetSettings.fleets[k].tasks.includes(j)) {
                                exps.push(1);
                            } else
                                exps.push(0);
                        }

						// Other Sources... always or not
						if (this.checkOtherSources) {
							if (opteam.expertiseOS[j] &&  this.checkOpExpertiseOS(j))
								exps.push(1);
							else
								exps.push(0);
						}

                        expertise[i].push(exps);
                    }
                }
            }
            return expertise;
        },

        // array of leadTask, value will be -1 if leading, otherwise the leading task
        leadTask() {
            var task = [];

            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].include)
                    task.push(this.taskSettings.tasks[i].leadTask);
            }

            //console.log("leadTask:", task);
            return task;
        },

        opPriority() {
            var prty = [];
            for (var i = 0; i < this.operatorSettings.teams.length; i++) {
				prty.push([]);
				for (var j=0; j < this.taskSettings.tasks.length; j++) {
					if (this.taskSettings.tasks[j].include)
                		prty[i].push(this.operatorSettings.teams[i].priority[0][j]);
				}
				console.log("OP Prioirty:", this.operatorSettings.teams[i].priority[0]);
            }
            return prty;
        },

        // array containing operator team communication types
        teamComm() {
            var comms = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
				if (this.operatorSettings.teams[i].size < 2)
					comms.push('N');
				else if (this.operatorSettings.teams[i].comms) {
                    comms.push(this.operatorSettings.teams[i].comms);
                } else
					comms.push('N');
            }
            return comms;
        },
        // array containing operator team fail threshold
        teamFailThreshold() {
            var ft = [];

            for (var i = 0; i < this.operatorSettings.teams.length; i++) {
                ft.push([]);
                for(var j=0; j < this.taskSettings.tasks.length;j++) {
                    if (this.taskSettings.tasks[j].include) {
                        ft[i].push(this.operatorSettings.teams[i].failThresh[0][j] / 10);
                    }
                }
            }
            return ft;
        },
        // array containing operator team strategy
        teamStrategy() {
            var st = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].strategy) {
                    st.push(this.operatorSettings.teams[i].strategy);
                }
            }
            return st;
        },
        // array containing ET Service Time
        AIDAType() {
            var aitypes = [];
            for (var i = 0; i < this.operatorSettings.teams.length; i++) {
                var ait = [];
                for (var j=0; j < this.operatorSettings.teams[i].AIDA.AIDAType.length; j++) {
                    if (this.operatorSettings.teams[i].AIDA.AIDAType[j])
                        ait.push(1);
                    else
                        ait.push(0);
                }
                aitypes.push(ait);
            }
            return aitypes;
        },

        AIDATypeForReview() {
            var aitypes = [];

            for (var i = 0; i < this.operatorSettings.teams.length; i++) {
                var ait = "", flagAdded=false;
                for (var j=0; j < this.operatorSettings.teams[i].AIDA.AIDAType.length; j++) {
                    if (this.operatorSettings.teams[i].AIDA.AIDAType[j]) {
                        if (flagAdded) ait+=", ";
                        ait += this.textStrings.AIDATypeStr[j];
                        flagAdded = true;
                    }
                }
                if (flagAdded)
                    aitypes.push(ait);
                else
                    aitypes.push("None");
            }
            return aitypes;
        },

        // array containing ET Service Time
        ETServiceTime() {
            var st = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
				var speed = this.operatorSettings.teams[i].AIDA.ETServiceTimeQ;
                if (speed === 'F') {			// faster
                    st.push(1.0 / this.operatorSettings.teams[i].AIDA.ETServiceTime);
                } else if (speed === 'S') {  // slower
                    st.push(1.0 * this.operatorSettings.teams[i].AIDA.ETServiceTime);
				} else
					st.push(1.0);
            }
            return st;
        },
        //array contining Error Rate
        ETErrorRate() {
            var er = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
				var speed = this.operatorSettings.teams[i].AIDA.ETErrorRateQ;

                if (speed === 'F') {	// faster
                    er.push(1.0 / this.operatorSettings.teams[i].AIDA.ETErrorRate);
                } else if (speed === 'S') {
                    er.push(1.0 * this.operatorSettings.teams[i].AIDA.ETErrorRate);
				} else
					er.push(1.0);
            }
            return er;
        },
        //array for fail threshold
        ETFailThreshold() {
            var ft = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
				var speed = this.operatorSettings.teams[i].AIDA.ETFailThresholdQ;
                if (speed === 'F') {	// faster
                    ft.push(1.0 / this.operatorSettings.teams[i].AIDA.ETFailThreshold);
                } else if (speed === 'S') // slower
                    ft.push(1.0 * this.operatorSettings.teams[i].AIDA.ETFailThreshold);
				else
                    ft.push(1.0);
            }
            return ft;
        },
        //AIDA IA Tasks
        IATasks() {
            var tasks = [];
            for (var i = 0; i < this.operatorSettings.teams.length; i++) {
                tasks.push([]);
				var iaTasks = this.operatorSettings.teams[i].AIDA.IATasks;
                if (iaTasks) {
					// [0, 1, 2] only task includes [0, 2], then [0, 2] => [0, 1]
					for (var k=0, l=0; k<this.taskSettings.tasks.length;k++) {
						if (this.taskSettings.tasks[k].include) {
							if (iaTasks.includes(k) && this.checkIfTaskSelected(this.operatorSettings.teams[i],k, true))
								tasks[i].push(l);
							l++;
						}
					}
                }
            }
            return tasks;
        },
        //AIDA IA Level
        IALevel() {
            var lv = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].AIDA.IALevel) {
                    lv.push(this.operatorSettings.teams[i].AIDA.IALevel);
                } else {
                    lv.push("");
                }
            }
            return lv;
        },

        //AIDA TCA Level
        TCALevel() {
            var lv = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].AIDA.TCALevel) {
                    lv.push(this.operatorSettings.teams[i].AIDA.TCALevel);
                } else {
                    lv.push("");
                }
            }
            return lv;
        },
        /* ------------------------------
         * FLEET SETTINGS COMPUTED VALUES
         * ------------------------------ */

		// number of total fleet types
		numTotalFleetTypes() {
			var x = this.fleetSettings.fleetTypes;
			if (this.checkOtherSources) {
				x++;
			}
			return x;
		},

        // array with fleet names
        fleetNames() {
            var fleetNames = [];
            for (i = 0; i < this.fleetSettings.fleets.length; i++) {
                if (this.fleetSettings.fleets[i].name) {
                    fleetNames.push(this.fleetSettings.fleets[i].name);
                } else
                    fleetNames.push("Fleet no name " + i);
            }
			if (this.checkOtherSources)
				fleetNames.push(this.textStrings.otherSources);
            return fleetNames;
        },

        // array with number of vehicles per fleet
        numVehicles() {
            var vehicles = [];
            for (i = 0; i < this.fleetSettings.fleets.length; i++) {
                if (this.fleetSettings.fleets[i].numVehicles) {
                    vehicles.push(this.fleetSettings.fleets[i].numVehicles);
                } else {
                    vehicles.push(1);
                }
            }
			if (this.checkOtherSources)
				vehicles.push(1);

            return vehicles;
        },

        // array containing fleet autonomy levels
        fleetAutoLevel() {
            var al = [];
            for (i = 0; i < this.fleetSettings.fleets.length; i++) {
				if (this.fleetSettings.fleets[i].numVehicles < 2)
					al.push('N');
				else if (this.fleetSettings.fleets[i].comms) {
                    al.push(this.fleetSettings.fleets[i].comms);
                } else {
                    al.push('N');
                }
            }
			if (this.checkOtherSources)
				al.push('N');

            return al;
        },

        // array containing fleet tasks arrays
        fleetHetero() {
            var tasks = [];
			var ostasks =  this.fleetSettings.otherSources.tasks;
			var i;
            for (i = 0; i < this.fleetSettings.fleets.length; i++) {
				tasks.push([]);
				var ftasks = this.fleetSettings.fleets[i].tasks;
				if (ftasks) {
					// [0, 1, 2] only task includes [0, 2], then [0, 2] => [0, 1]
					for (var k=0, l=0; k<this.taskSettings.tasks.length;k++) {
						if (this.taskSettings.tasks[k].include) {
							if (ftasks.includes(k) && !ostasks.includes(k))
								tasks[i].push(l);
							l++;
						}
					}
				}
            }

			if (this.checkOtherSources) {
				tasks.push([]);
				if (ostasks) {
					// [0, 1, 2] only task includes [0, 2], then [0, 2] => [0, 1]
					for (var k=0, l=0; k<this.taskSettings.tasks.length;k++) {
						if (this.taskSettings.tasks[k].include) {
							if (ostasks.includes(k))
								tasks[i].push(l);
							l++;
						}
					}
				}
			}

            return tasks;
        },

		// check whether any enabled task is selected for other sources...
		checkOtherSources() {
			for (j = 0; j < this.taskSettings.tasks.length; j++) {
				if (this.taskSettings.tasks[j].include && this.fleetSettings.otherSources.tasks.includes(j)) return true;
			}

			return false;
		},

        fleetTasksForReview() {
            var tasks = [];
            for (i = 0; i < this.fleetSettings.fleets.length; i++) {
				var x = 0;
				//console.log("FleetTasksForReview tasks length", i, k, this.taskSettings.tasks);
				tasks.push([]);
				for (j = 0; j < this.taskSettings.tasks.length; j++) {
					if (this.taskSettings.tasks[j].include && this.checkOpExpertise(this.fleetSettings.fleets[i], i)) {
						tasks[i].push(this.taskSettings.tasks[j].name);
						x++;
					}
				}
				if (x===0)
					tasks[i].push(["None"]);
            }
            return tasks;
        },

        fleetOSTasksForReview() {
            var tasks = [];

			var x = 0;
			for (j = 0; j < this.taskSettings.tasks.length; j++) {
				if (this.taskSettings.tasks[j].include && this.checkOpExpertiseOS(j)) {
					tasks.push(this.taskSettings.tasks[j].name);
					x++;
				}
			}
			if (x===0)
				tasks.push(["None"]);

            return tasks;
        },

        // array of traffic levels per hour of 0=no traffic, 0.5=low, 1=medium or 2 = high per each fleet
        traffic() {
            var traff = [];
			var x = this.checkOtherSources ? 1 : 0;
 			var traffOrig, noDiff;

            for(var f=0;f<this.fleetSettings.fleets.length + x;f++) {

				if (f === this.fleetSettings.fleets.length) {
                	traffOrig = this.fleetSettings.otherSources.trafficLevels;
                	noDiff = this.fleetSettings.otherSources.diffTrafficLevels === 'n';
				} else {
                	traffOrig = this.fleetSettings.fleets[f].trafficLevels;
                	noDiff = this.fleetSettings.fleets[f].diffTrafficLevels === 'n';
				}

				traff.push([]);
                for (i = 0; i < traffOrig.length; i++) {
                    if (noDiff) {
                        traff[f][i] = 1;
                    }
                    else if (traffOrig[i] === "l") {
                        traff[f][i] = 0.5;
                    } else if (traffOrig[i] === "h") {
                        traff[f][i] = 2;
                    } else if (traffOrig[i] === "m") {
                        traff[f][i] = 1;
                    } else
                        traff[f][i] = 0;
                }
            }
			return traff;
        },

    },

    methods: {
        // when numHours changed
        updateTrafficLvls() {
            for (let fleet of this.fleetSettings.fleets) {
                var lvls = fleet.trafficLevels;

                var l = lvls.length;
                if (this.globalSettings.numHours > l) {
                    while (l < this.globalSettings.numHours) {
                        lvls.push("m");
                        l++;
                    }
                } else {
                    lvls.splice(this.globalSettings.numHours);
                }
            }

			// update other sources traffic level
			var lvls = this.fleetSettings.otherSources.trafficLevels;
			var l = lvls.length;
			if (this.globalSettings.numHours > l) {
				while (l < this.globalSettings.numHours) {
					lvls.push("m");
					l++;
				}
			} else {
				lvls.splice(this.globalSettings.numHours);
			}
        },

        disableAddTask(task) {
            if (task.include || !this.maxTasksReached) {
                return false;
            }
            return true;
        },

        maxFollowingTasksReached(index) {
            return this.numTaskTypes[index + 1] >= 10;
        },

        disableAddFollowingTasks(task, index) {
            console.log("DisableAddFollowingTasks : ");
            if (task.include || !this.maxFollowingTasksReached(index)) {
                console.log(false);
                return false;
            }
            console.log(true);
            return true;
        },
        // return default task array
        getTaskArray() {
            var task = [];

            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                task.push(1);
            }

            return task;
        },

		// add new task and select the newly created tab
		addTask() {
			this.addCustomTask();

			// select the newly created task
            this.$nextTick(() => {
				console.log(document.querySelectorAll('#tasks-settings .nav-item'));

				document.querySelectorAll('#tasks-settings .nav-item')[this.numTaskTypes[0]].querySelector('a').click();
            });
		},

        addCustomTask() {
            var x = this.taskSettings.numNameTask++;
            sim.newTask("Task " + x, -1);
        },

        newTask(name, leadTask) {
            this.taskSettings.tasks.push({
                name: name,
                include: true,
                isCustom: true,
                essential: "n",
                interruptable: "n",
                exoType2Aff: "n",
                affTeamCoord: "n",
                arrivalDistribution: ["E"],
                arrivalParam: [
                    [60],
                ],
                serviceDistribution: ["U"],
                serviceParam: [
                    [0.5, 2],
                ],
                expireDistribution: ["N"],
                expireParam: [
                    [1440],
                ],
                affectByIROPS: [0],
                humanErrorSelect: "0",
                humanErrorProb: [
                    humanErrorProbConfig["0"].value,,
                ],
                leadTask: leadTask,
            });

            // add priority for each operatorSettings.teams
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                this.operatorSettings.teams[i].priority[0].push(1);
                // add fail threshold
                this.operatorSettings.teams[i].failThresh[0].push(5);
            }

            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                // add a opExpertise
                this.operatorSettings.teams[i].expertise.push([]);
            }
        },

        removeTask(task) {
            // remove from taskSettings.tasks
            var taskIndex = this.taskSettings.tasks.indexOf(task);
			this.taskSettings.tasks.splice(taskIndex, 1);

			// remove tasks for each fleet
			// tasks [0, 1, 2], remove task 1 => [0, 2] => [0, 1]
			for (i = 0; i< this.fleetSettings.fleets.length; i++) {
				var fleet = this.fleetSettings.fleets[i];
				for (k = 0; k< fleet.tasks.length; k++) {
					if (fleet.tasks[k] === taskIndex) fleet.tasks.splice(k, 1);
					if (fleet.tasks[k] > taskIndex) fleet.tasks[k]--;
				}
				// console.log(fleet.tasks);
			}

            // remove priority, failthresh, expertise, AIDA IA tasks for each operatorSettings.teams
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                //console.log(taskIndex, this.operatorSettings.teams[i].failThresh[0]);
                this.operatorSettings.teams[i].priority[0].splice(taskIndex, 1);
                this.operatorSettings.teams[i].failThresh[0].splice(taskIndex, 1);
                //console.log(taskIndex, i, this.operatorSettings.teams[i].failThresh[0]);
				this.operatorSettings.teams[i].expertise.splice(taskIndex, 1);

				// AIDA IA Tasks remove the current task
				var teamAI = this.operatorSettings.teams[i].AIDA;
				for (k = 0; k< teamAI.IATasks.length; k++) {
					if (teamAI.IATasks[k] === taskIndex) teamAI.IATasks.splice(k, 1);
					if (teamAI.IATasks[k] > taskIndex) teamAI.IATasks[k]--;
				}
            }
		},

        removeCustomTask(task) {
            if (confirm("Are you sure you want to delete this task?")) {

				// remove following tasks
				var taskIndex = this.taskSettings.tasks.indexOf(task);
				for (var i = 0; i< this.taskSettings.tasks.length; i++) {
					while (i<this.taskSettings.tasks.length && this.taskSettings.tasks[i].leadTask === taskIndex)
						this.removeTask(this.taskSettings.tasks[i]);
				}

                this.removeTask(task);

 				this.$nextTick(() => {
					if (document.querySelector("#tasks-settings .nav-link.active") === null) // no tab is selected
						document.querySelector("#tasks-global-settings-tab").click();
				});
            }
        },

        addFollowingTask(task) {
            var x = this.taskSettings.numNameTask++;
            sim.newTask(task.name + " " + x + " (Follow)", this.taskSettings.tasks.indexOf(task));
        },

        removeFollwingTask(task) {
            if (confirm("Are you sure you want to delete this following task?")) {
                this.removeTask();
            }
        },

        // update human error probability
        updateHumanErrorProb(task) {
            task.humanErrorProb[0] = this.miscSettings.humanErrorProb[task.humanErrorSelect].value;
        },

		// add new operator team and select the newly created tab
		addOperatorTeam() {
			this.operatorSettings.numTeams++;
			this.updateOperatorTeams();

			// select the newly created task
            this.$nextTick(() => {
				document.querySelectorAll('#operators-settings .nav-item')[this.operatorSettings.numTeams].querySelector('a').click();
            });
		},

        updateOperatorTeams() {
            var teams = this.operatorSettings.teams;
            if (this.operatorSettings.numTeams > teams.length) {
                var tasks = sim.getTaskArray(); // default priority for each task
                var ft = []; // failThreshold default value for each task
                var exp = [];
				var expOS = [];
                for (var i = 0; i < this.taskSettings.tasks.length; i++) {
                    ft.push(5);
                    exp.push([]);
					expOS.push(true);
                    for(var j=0; j < this.fleetSettings.fleets.length;j++) {
                        exp[i][j] = true;
                    }
                }

                while (teams.length < this.operatorSettings.numTeams) {
                    var x = this.operatorSettings.numNameTeam++;
                    teams.push({
                        name: this.textStrings.operator + " Team " + x,
                        size: 1,
                        strategy: "FIFO",
                        comms: "N",
                        tasks: [],
                        expertise: exp,
						expertiseOS: expOS,
                        priority: [tasks],
                        AIDA: {
                            AIDAType: [false, false, false],
                            ETServiceTimeQ: 'E',
							ETErrorRateQ: 'E',
                            ETFailThresholdQ: 'E',
                            ETServiceTime: 2,
                            ETErrorRate: 2,
                            ETFailThreshold: 2,
                            IATasks: [],
                            IALevel: 'S',
                            TCALevel: 'S'
                        },
                        failThresh: [ft]
                    })
                }
            } else {
                teams.splice(this.operatorSettings.numTeams);
            }
        },

        removeOperatorTeam(team) {
            if (confirm("Are you sure you want to delete this team?")) {
                this.operatorSettings.teams.splice(this.operatorSettings.teams.indexOf(team), 1);
            }
            this.operatorSettings.numTeams = this.operatorSettings.teams.length;
            document.querySelector("#operators-global-settings-tab").click();
        },

        // update whole matrix to true
        updateOpExpertise(team) {
            for(var i=0;i<this.taskSettings.tasks.length;i++) {
                for(var j=0;j<this.fleetSettings.fleets.length;j++) {
                    team.expertise[i][j]=true;
                }
            }
        },

        // check whether fleet has assigned this task and other sources doesn't assign it
        checkOpExpertise(fleet, taskIndex) {
            return fleet.tasks.includes(taskIndex) && !this.fleetSettings.otherSources.tasks.includes(taskIndex);
        },

		// check whether other sources assigned this task
		checkOpExpertiseOS(taskIndex) {
            return this.fleetSettings.otherSources.tasks.includes(taskIndex);
		},

        // return fleet names for review associated with a task
        fleetNamesOpExpertise(team, taskIndex) {
            var fleetNames = [];
            for(var j=0;j<this.fleetSettings.fleets.length;j++) {
                var fleet = this.fleetSettings.fleets[j];
                if (team.expertise[taskIndex][j] && this.checkOpExpertise(fleet, taskIndex)) {
                    fleetNames.push(fleet.name);
                }
            }

			if (team.expertiseOS[taskIndex] && this.checkOpExpertiseOS(taskIndex))
				fleetNames.push(textStrings.otherSources);

            if (fleetNames.length) {
                return fleetNames.join(", ");
            } else
                return "None";
        },

        // check wheteher the task is selected in the opExpertise matrix
        checkIfTaskSelected(team, taskIndex, isAI) {
			var isAI = isAI || false;
            for (var i=0; i<this.fleetSettings.fleets.length;i++) {
                var fleet = this.fleetSettings.fleets[i];
                if (team.expertise[taskIndex][i] && this.checkOpExpertise(fleet, taskIndex))
                    return true;
            }

			// check expertise other sources
			if (!isAI && team.expertiseOS[taskIndex] && this.checkOpExpertiseOS(taskIndex))
            	return true;

			return false;
        },

		// add new fleet and select the newly created tab
		addFleet() {
			this.fleetSettings.fleetTypes++;
			this.updateFleets();

			// select the newly created task
            this.$nextTick(() => {
				document.querySelectorAll('#fleets-settings .nav-item')[this.fleetSettings.fleetTypes].querySelector('a').click();
            });
		},

        updateFleets() {
            var fleets = this.fleetSettings.fleets;
            if (this.fleetSettings.fleetTypes > fleets.length) {
                while (fleets.length < this.fleetSettings.fleetTypes) {
                    var x = this.fleetSettings.numNameFleet++;
                    fleets.push({
                        name: this.textStrings.fleet + " " + x,
                        numVehicles: 1,
                        comms: "N",
                        tasks: [],
                        diffTrafficLevels: "n",
                        trafficLevels: ["m", "m", "m", "m", "m", "m", "m", "m"], // traffic levels l (low), m (medium), h (high)
                    });
                }

            } else {
                fleets.splice(this.fleetSettings.fleetTypes);
            }

        },

        removeFleet(fleet) {
            if (confirm("Are you sure you want to delete this fleet?")) {
                this.fleetSettings.fleets.splice(this.fleetSettings.fleets.indexOf(fleet), 1);
            }
            this.fleetSettings.fleetTypes = this.fleetSettings.fleets.length;
            document.querySelector("#fleets-global-settings-tab").click();
        },

        loadStrings(str, texts) {
            // always use the latest textStrings...
            this.textStrings = texts["General"]; // redundant???!
			console.log("texts", texts[str], texts.General, str);

			// Base is General and override with each settings
            if (str !== "General") {
                for(x in texts[str]) {
                    this.textStrings[x] = texts[str][x];
                }
            }

			console.log(this.textStrings);
        },

        setSimType(str) {
			//alert(this.miscSettings.simShift);
            this.globalSettings.simType = str;

            // retrieve each default configuration and set
            axios.get('data/' + str + this.miscSettings.simShift + '.json')
              .then((response) => {
                // handle success
				console.log(response.data, str);
				var data = response.data; // if same version!!!
				if (this.version === data.version) {
					this.numReps = data.numReps;
					this.globalSettings = data.globalSettings;
					this.taskSettings = data.taskSettings;
					this.operatorSettings = data.operatorSettings;
					this.fleetSettings = data.fleetSettings;
				} else {
					console.log("Data", data, data.version);
					console.log("Data version is different.", this.version, data.version);
				}
              })
              .catch((error) => {
                // handle error
                console.log(error);
              })
			  .then(() => {
	            this.$nextTick(() => {
					console.log(textStrings);
					this.loadStrings(str, textStrings);
					$("#sim-type").modal('hide');
				});
			  });
        },

        // return exact number of params depending on distribution
        distParams(dist, params) {
            switch(dist) {
                case 'E':
                case 'C':
                    return [params[0]];
                case 'L':
                case 'U':
                    return [params[0], params[1]];
                case 'N':
                    return [-1];
            }
            return [params[0], params[1], params[2]];  // for 'T'
        },

        saveData() {
            this.miscSettings.isSaving = true;
            NProgress.start();
            localStorage.setItem('allData'+this.version, JSON.stringify(this.$data));
            setTimeout(function() {NProgress.done(); sim.miscSettings.isSaving = false; }, 1000);
        },

        saveFile() {
            var a = document.createElement('a');
            a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(JSON.stringify(this.$data)));
            a.setAttribute('download', "download.json");
            a.setAttribute("style", "display: none;");
            document.body.appendChild(a);
            a.click();
            a.remove();
        },

        loadFile(evt) {
            var files = evt.target.files; // FileList object
            console.log(files);

            // files is a FileList of File objects. List some properties.
            var output = [];
            for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();

                // Closure to capture the file information.
                reader.onload = (function (theFile) {
                    return function (e) {
                        console.log('e readAsText = ', e);
                        console.log('e readAsText target = ', e.target);
                        try {
                            var data = JSON.parse(e.target.result);

                            // sanity check
                            if (data.numReps && data.globalSettings && data.taskSettings && data.operatorSettings && data.fleetSettings && data.version && sim.version === data.version) {
                                sim.numReps = data.numReps;
                                sim.globalSettings = data.globalSettings;
                                sim.taskSettings = data.taskSettings;
                                sim.operatorSettings = data.operatorSettings;
                                sim.fleetSettings = data.fleetSettings;
                                sim.loadStrings(sim.globalSettings.simType, textStrings);

								sim.checkValues();

                                alert(files[0].name + " is loaded successfully!");
                            } else if (data.version) {
                                alert("Your data file version is " + data.version + ". Please use current version!");
                            } else {
                                alert("Please use a valid JSON file!");
                            }
                        } catch (ex) {
                            alert('There was an error when trying to parse JSON file = ' + ex);
                        }

                    }
                })(f);
                reader.readAsText(f);
            }
        },

        loadData() {
            if (localStorage.getItem('allData' + this.version)) {
                var data = JSON.parse(localStorage.getItem('allData' + this.version));

                // erase all current keys from data
                // Object.keys(this.$data).forEach(key => this.$data[key] = null);

                // set all properties from newdata into data
                // Object.entries(data).forEach(entry => Vue.set(this.$data, entry[0], entry[1]));
                if (this.version === data.version) {
                    this.miscSettings.isLoading = true;
                    NProgress.start();
                    this.numReps = data.numReps;
                    this.globalSettings = data.globalSettings;
                    this.taskSettings = data.taskSettings;
                    this.operatorSettings = data.operatorSettings;
                    this.fleetSettings = data.fleetSettings;
                    console.log(this.globalSettings.simType);
                    this.loadStrings(this.globalSettings.simType, textStrings);

					this.checkValues();
                    setTimeout(function() {NProgress.done(); sim.miscSettings.isLoading = false; }, 1000);
                } else {
                    //alert("No previous setting is found.");
                }
            } else {
                //alert("No previous setting is found.")
            }
        },

		valueBetween(val, min, max) {
			if (val < min) val = min;
			if (val > max) val = max;

			return val;
		},

		// solve some discrepancy between load data and current data
		checkValues() {
			for (var team of this.operatorSettings.teams) {
				if (!team.AIDA.ETErrorRateQ) {
					team.AIDA.ETErrorRateQ = "E";
				}
				if (!team.AIDA.ETFailThresholdQ) {
					team.AIDA.ETFailThresholdQ = "E";
				}
				if (!team.AIDA.ETServiceTimeQ) {
					team.AIDA.ETServiceTimeQ = "E";
				}

				team.AIDA.ETErrorRate = this.valueBetween( team.AIDA.ETErrorRate, 1.01, 100);
				team.AIDA.ETFailThreshold = this.valueBetween( team.AIDA.ETFailThreshold, 1.01, 100);
				team.AIDA.ETServiceTime = this.valueBetween( team.AIDA.ETServiceTime, 1.01, 100);
			}
		},

        // check whether the params is numbers and greater than zero
        checkNumbers(params, length) {
            for(var i=0;i<length;i++) {
               if (typeof params[i] !== 'number' || params[i] <= 0)
                    return false;
            }
            return true;
        },

        // check whether the current distribution setting is correct
        // bigger than 0
        // min < max (uniform)
        // min < mode < max (triangular)
        checkDistribution(dists, params, length) {
            if (dists.length !== length) return false;
            const paramSize = { 'E': 1, 'C':1, 'U':2, 'L':2, 'T': 3};

            for(var i=0;i<length;i++) {
                if (!this.checkNumbers(params[i], paramSize[dists[i]])) {
                    this.miscSettings.warningMessage = "Distribution parameters should be greater than 0."
                    return false;
                }
                switch(dists[i]) {
                    case 'U':
                        if (params[i][0] > params[i][1]) {
                            this.miscSettings.warningMessage = "X should be smaller than or equal to Y.";
                            return false;
                        }
                        break;
                    case 'T':
                        if (params[i][0] > params[i][1] || params[i][0] > params[i][2] || params[i][1] > params[i][2]) {
                            this.miscSettings.warningMessage = "X <= Z <= Y";
                            return false;
                        }
                        break;
                }
            }

            return true;
        },

        // check wheter one active task/fleet is selected
        checkExpertise(team) {
            for(var i=0;i<this.taskSettings.tasks.length;i++) {
                if (this.taskSettings.tasks[i].include && this.checkIfTaskSelected(team, i)) return true;
            }
            return false;
        },

        checkIATask(team) {
            for(var i=0;i<this.taskSettings.tasks.length;i++) {
                if (this.taskSettings.tasks[i].include && this.checkIfTaskSelected(team,i,true) && team.AIDA.IATasks.includes(i)) return true;
            }
            return false;
        },

		// no need to check other sources...
        checkFleetTask(fleet) {
            for(var i=0;i<this.taskSettings.tasks.length;i++) {
                if (this.taskSettings.tasks[i].include && this.checkOpExpertise(fleet, i)) return true;
            }
            return false;
        },

        // add error or warning to the review settings
        // error - 0(info), 1(warning), 2(error)
        addReviewError(msg, tabId, errorLevel) {
            var eLevel = errorLevel || 0;
            const errorClass = ["info", "warning", "danger"];

            var warningNode = document.getElementById('warnings');

            var newNode = document.createElement('div');
            newNode.className = 'alert alert-' + errorClass[eLevel];
            newNode.innerHTML = msg + " <a href='javascript:void(0)' data-id='" + tabId + "'>Edit</a>";
            warningNode.appendChild(newNode);
        },

        // check current user input
        checkInputData() {
            EventBus.$emit('validateInput', true);

            var count = [0,0];
			var i,j,k;
			var firstSource;

            // remove all warnings
            var warningNode = document.getElementById('warnings');
            while (warningNode.firstChild) {
                warningNode.removeChild(warningNode.firstChild);
            }

            // check basic settings
            // turn over input complete?
            if (!this.checkDistribution(this.globalSettings.transitionDists, this.globalSettings.transitionPms, 2)) {
                this.addReviewError("Check the transitioning period parameters. " + this.miscSettings.warningMessage, "basic-settings-tab", 2);
                count[1]++;
            }

			//Check included tasks > 0
			if  (this.noTasksIncluded) {
				this.addReviewError("Please include at least one task!",  "tasks-global-settings-tab", 2)
			}

            // check task params
            for(i=0;i<this.taskSettings.tasks.length;i++) {
                var task = this.taskSettings.tasks[i];
                if (task.include) {
                    if (!this.checkDistribution(task.arrivalDistribution, task.arrivalParam, 1)) {
                        this.addReviewError("Fix the task, " + task.name + " question 6 parameters. " + this.miscSettings.warningMessage, "tasks-" + i + "-settings-tab", 2);
                        count[1]++;
                    }

                    if (!this.checkDistribution(task.expireDistribution, task.expireParam, 1)) {
                        this.addReviewError("Fix the task, " + task.name + " question 7 time parameters. " + this.miscSettings.warningMessage, "tasks-" + i + "-settings-tab", 2);
                        count[1]++;
                    }

                    if (!this.checkDistribution(task.serviceDistribution, task.serviceParam, 1)) {
                        this.addReviewError("Fix the task, " + task.name + " question 8 parameters. " + this.miscSettings.warningMessage, "tasks-" + i + "-settings-tab-tab", 2);
                        count[1]++;
                    }

                    if (!this.checkDistribution(['T'], task.humanErrorProb, 1)) {
                        this.addReviewError("Fix the task, " + task.name + " human error probability parameters. " + this.miscSettings.warningMessage, "tasks-" + i + "-settings-tab", 2);
                        count[1]++;
                    }

					// Check at least one fleet is selectd for the active task
					firstSource = -1;
					for(j=0;j<this.fleetSettings.fleetTypes;j++) {
						var fleet = this.fleetSettings.fleets[j];

						if (fleet.tasks.includes(i)) {
							firstSource = j;
							break;
						}
					}
   				    // if Task is not coming from any of the sources
					if (firstSource<0 && !this.fleetSettings.otherSources.tasks.includes(i)) {
			 	    	this.addReviewError("At least one source should be selected for the task, " + task.name + ".", "fleet-0-settings-tab");
						count[0]++;
						firstSource = 0;
					}

					// Alert user if Task is not handled by any operators
					for(j=0,k=0;j<this.operatorSettings.numTeams;j++) {
                		var opteam = this.operatorSettings.teams[j];

						if (this.checkIfTaskSelected(opteam, i)) k++;
					}

					if (k===0) {
			 	    	this.addReviewError("At least one active " + this.textStrings.operator.toLowerCase() + " should be selected for the task, " + task.name + ".", "opteam-" + firstSource +"-settings-tab");
						count[0]++;
					}
				}
            }

            // check fleet params
            // Any task is selected for each fleet? warning
            if (this.fleetSettings.fleetTypes !== this.fleetSettings.fleets.length) {
                this.addReviewError("Check the number of " + this.textStrings.fleets.toLowerCase() + " settings.", "fleets-global-settings-tab");
                count[0]++;
            }

            for(i=0;i<this.fleetSettings.fleetTypes;i++) {
                var fleet = this.fleetSettings.fleets[i];

                if (!this.checkFleetTask(fleet)) {
                    this.addReviewError("At least one task needs to be selected for the " + this.textStrings.fleet.toLowerCase() + ", " + fleet.name + ".", "fleet-" + i + "-settings-tab");
                    count[0]++;
                }
            }

            // check opteam params
            for(i=0;i<this.operatorSettings.numTeams;i++) {
                var opteam = this.operatorSettings.teams[i];

                // at least one expertise is selected, warning
                if (!this.checkExpertise(opteam)) {
                    this.addReviewError("At least one active tasks/" + this.textStrings.fleets.toLowerCase() + " combo needs to be checked for the " + this.textStrings.operator.toLowerCase() + " team, " + opteam.name + ".", "opteam-" + i + "-settings-tab");
                    count[0]++;
                }
                // at least one tasks for aida assisting individuals is selected, warning
                if (opteam.AIDA.AIDAType[1] && !this.checkIATask(opteam)) {
                    this.addReviewError("At least one task needs to be associated with AIDA " + this.textStrings.AIDATypeStr[1].toLowerCase() + " for the " + this.textStrings.operator.toLowerCase() + " team, " + opteam.name + ".", "opteam-" + i + "-settings-tab");
                    count[0]++;
                }
            }

            return count;
        },

        // when submit button is clicked! go checkes whether check the input or not...
        onSubmit(go) {
            //console.log("onSubmit", go);
            if (!go) {  // false
                var count =  this.checkInputData();

                if (count[0] + count[1] > 0) {
                    if (count[1] === 0) // only minor warnings...
                        this.miscSettings.showGoButton = true;

                    alert("There are some warnings, please check the review!");
                    this.$refs.reviewSettingsTab.click();
                    window.scrollTo(0,0);
                    return;
                }
            }

            this.miscSettings.showGoButton = false;
            this.miscSettings.onSubmit = true;

            var out = {
                // Basic Settings
                "numHours": sim.globalSettings.numHours,
                "numReps": sim.numReps,
                "hasTurnOver": sim.hasTransition,
                "turnOverDists": sim.globalSettings.transitionDists,
                "turnOverPms": sim.transitionPms,
                "hasExogenous": sim.hasExogenous,

                // Operators Settings
                "numTeams": sim.operatorSettings.numTeams,
                "teamSize": sim.teamSize,
                "hasFlexPosition": sim.hasFlexPosition,
                "flexTeamSize": sim.flexTeamSize,
                "opNames": sim.opNames,
                "opStrats": sim.teamStrategy,
                //"opTasks": sim.opTasks,
                "opExpertise": sim.opExpertise,
                "taskPrty": sim.opPriority,
                "teamComm": sim.teamComm,
                "humanError": sim.humanError,
                "ECC": sim.teamFailThreshold,

                // AIDA Settings
                "AIDAtype": sim.AIDAType,
                "ETServiceTime": sim.ETServiceTime,
                "ETErrorRate": sim.ETErrorRate,
                "ETFailThreshold": sim.ETFailThreshold,
                "IAtasks": sim.IATasks,
                "IALevel": sim.IALevel,
                "TCALevel": sim.TCALevel,

                // Fleet Settings
                "fleetTypes": sim.numTotalFleetTypes,
                "fleetNames": sim.fleetNames,
                "numvehicles": sim.numVehicles,
                "autolvl": sim.fleetAutoLevel,
                "fleetHetero": sim.fleetHetero,
                "traffic": sim.traffic,

                // Task Settings
                "numTaskTypes": sim.numTotalTaskTypes,
                "taskNames": sim.taskNames,
                "arrDists": sim.arrDists,
                "arrPms": sim.arrPms,
                "serDists": sim.serDists,
                "serPms": sim.serPms,
                "expDists": sim.expDists,
                "expPms": sim.expPms,
                "affByTraff": sim.affByTraff,
                "teamCoordAff": sim.teamCoordAff,
                "exoType2Aff": sim.exoType2Aff,
                "interruptable": sim.interruptable,
                "essential": sim.essential,

                "leadTask": sim.leadTask
            };
            console.log("JSON output: ", out);
            //hide download
            //document.getElementById("downloadBtn").style.display = "none";

            //Download Json
            this.miscSettings.downloadJsonVisible = true;
            this.miscSettings.downloadJsonData = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(out));

            axios.post(env.serverUrl + "/shado/runShado", JSON.stringify(out), {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                }
            }).then((msg) => {
                console.log("response success received");
                this.miscSettings.sessionId = msg.data.substr(msg.data.lastIndexOf(":") + 2);
                this.miscSettings.sessionQuery = "?sessionN=" + this.miscSettings.sessionId;
                console.log(this.miscSettings.sessionId, this.miscSettings.sessionQuery);
                alert("Simulation complete. View the results.");

                this.resultSettings.numReps = this.numReps;
                this.resultSettings.numHours = this.globalSettings.hours;
                this.resultSettings.exoFactors = this.hasExogenousForResults;
                this.resultSettings.busyTimePerFleet = "";
                this.resultSettings.busyTimePerTask = "";
                this.resultSettings.waitTimePerFleet = "";
                this.resultSettings.waitTimePerTask = "";

                // Show download button
                // document.getElementById("downloadBtn").style.display = "block";

                BoxPlot.visualize(env.serverUrl + "/shado/getUtilizationJSON" + this.miscSettings.sessionQuery,
                                  "#boxSVG", "1");

                // pieChart only works when it is visible
                FailedTaskAnalysis.analyze(env.serverUrl + "/shado/getTaskJSON" + this.miscSettings.sessionQuery,
                                           "pieChart", "#taskRecordTable");

                WaitTime.visualize(env.serverUrl + "/shado/getWaitTimeJSON" + this.miscSettings.sessionQuery,
                                "#waitTimeSVG", "1");

                this.miscSettings.viewResultsClass = "";
                this.$nextTick( function() {
                    this.$refs.viewResultsTab.click();
					FailedTaskAnalysis.refreshPie();
                    if (this.textStrings.mainMenu.length <= 5)
                        this.textStrings.mainMenu.push("View Results");
                });
            })
            .catch((err) => {
                console.log(err.response);
                if (err.response)
                    alert("Server Error: " + err.response.request.responseText);
                else
                    alert("Server Error: Server not responding");
            }).then(() => {
                console.log("response complete received");
                document.getElementById("submitBtn").textContent = "Submit Again";
                this.miscSettings.onSubmit = false;
            });
        },

        changeInputString(text, obj) {
            //console.log("ChangeInputString", obj.name);
			obj.name = obj.name.replace(/  +/g, ' ').trim();	// replace multiple spaces into one and trim
            if (0 === obj.name.length || !obj.name.trim()) {
                obj.name = this.miscSettings.inputString;
                alert(text + " name should contain at least 1 characters. It reverts to " + obj.name + ".");
				return;
            }

			// Only allow 0~9, a-z, A-Z, -, _, ' '.
			if (!/^[\w -]+$/.test(obj.name)) {	// if test not passed
				obj.name = obj.name.replace(/[^\w -]/g, ' ');		// replace any special chars into space
				obj.name = obj.name.replace(/  +/g, ' ').trim();	// replace multiple spaces into one and trim
				alert(text + " name should not contain other than 0-9, A-Z, a-z, space, -, and _. Special characters are stripped.");
			}
        },

        // download links...
        downloadCSV() {
            window.location.href = env.serverUrl + "/shado/getRepDetail" + this.miscSettings.sessionQuery;
        },

        downloadSummary() {
            window.location.href = env.serverUrl + "/shado/getSummary" + this.miscSettings.sessionQuery;
        },

        downloadJSON() {
            window.location.href = env.serverUrl + "/shado/getUtilizationJSON" + this.miscSettings.sessionQuery;
        },

        onPrevTab() {
            var id = document.querySelector("#sim-nav .nav-link.active").id;
            var index = this.miscSettings.globalMenuId.indexOf(id);
            var elm = document.getElementById(this.miscSettings.globalMenuId[index-1]);
            if (elm !== null) {
                elm.click();
            }
        },

        onNextTab() {
            var id = document.querySelector("#sim-nav .nav-link.active").id;
            var index = this.miscSettings.globalMenuId.indexOf(id);
            var elm = document.getElementById(this.miscSettings.globalMenuId[index+1]);
            if (elm !== null) {
                elm.click();
            }
        },

        printResults() {
			// make sure pie chart display correctly...
			document.querySelector("#results-failed-task-tab").click();
			setTimeout(function() {
				FailedTaskAnalysis.refreshPie();
				document.querySelector("#results-download-tab").click();
				setTimeout(function() { window.print(); }, 500);
			}, 500);
        }
    },

//    watch: {
//        numReps: {
//            handler() {
//                localStorage.setItem('numReps', JSON.stringify(this.numReps));
//            },
//            deep: true
//        },
//        globalSettings: {
//            handler() {
//                localStorage.setItem('globalSettings', JSON.stringify(this.globalSettings));
//            },
//            deep: true
//        },
//        taskSettings: {
//            handler() {
//                localStorage.setItem('taskSettings', JSON.stringify(this.taskSettings));
//            },
//            deep: true
//        },
//        operatorSettings: {
//            handler() {
//                localStorage.setItem('operatorSettings', JSON.stringify(this.operatorSettings));
//            },
//            deep: true
//        },
//        fleetSettings: {
//            handler() {
//                localStorage.setItem('fleetSettings', JSON.stringify(this.fleetSettings));
//            },
//            deep: true
//        }
//    },

    mounted: function () {
        // Add a request interceptor
        axios.interceptors.request.use(function (config) {
          // Do something before request is sent
          NProgress.start();
          return config;
        }, function (error) {
          // Do something with request error
          console.error(error)
          return Promise.reject(error);
        });

        // Add a response interceptor
        axios.interceptors.response.use(function (response) {
          // Do something with response data
          NProgress.done();
          return response;
        }, function (error) {
          // Do something with response error
          NProgress.done();
          console.error(error)
          return Promise.reject(error);
        });

		//Bug - this call overrides global textStrings...-_-
        //this.loadData();

        Vue.nextTick(function () {
            // In Firefox, mousewheel should not change the value of the input number
            $("#sim-content").on('wheel', 'input[type=number]', function () {
                var el = $(this);
                var focused = el.is(":focus");
                el.blur();
                //console.log("Scrolling?");
                if (focused) {
                    setTimeout(function () {
                        el.focus();
                    }, 100);
                }
            });

            // pop-up simulation type chooser
            $('#sim-type').modal(true);

            // When review settings tab is clicked, redraw fleetSettings
            $('#review-settings-tab').click( function(e) {
                for(var i=0;i<sim.fleetSettings.fleetTypes;i++) {
                    TrafficLevelBarChart.drawTrafficLevelBarChart("#trafficLevel" + i,
                                                                  sim.fleetSettings.fleets[i].trafficLevels,
                                                                  sim.fleetSettings.fleets[i].diffTrafficLevels === 'y');
                }
				TrafficLevelBarChart.drawTrafficLevelBarChart("#trafficLevelOS",
                                                                  sim.fleetSettings.otherSources.trafficLevels,
                                                                  sim.fleetSettings.otherSources.diffTrafficLevels === 'y');

                var count = sim.checkInputData();
                if (count[1] > 0) // only minor warnings...
                    sim.miscSettings.showGoButton = false;
                else {
                    sim.miscSettings.showGoButton = true;
                    if (count[0] > 0) {
                        sim.miscSettings.showGoText = "Run Simulation with Warnings";
                        sim.miscSettings.showGoClass = "btn-warning";
                    } else {
                        sim.miscSettings.showGoText = "Run Simulation";
                        sim.miscSettings.showGoClass = "btn-success";
                    }
                }
            });

            // If a main menu without view-results clicked...
            $("#sim-nav-submenus a").click( function(e) {
                var target = e.target.attributes.href.value;
                if (target !== "#view-results") {
                    if (sim.miscSettings.viewResultsClass === "") {
                        sim.miscSettings.viewResultsClass = "previous";
                    }
                }
            });

            // From review settings to each edit tab
            $("#review-settings").on("click", "a", function() {
                var id = $(this).data("id");

                // double visiting...
                if (id.startsWith("opteam-")) {
                    $('#operators-settings-tab').click();
                } else if (id.startsWith("fleet-")) {
                    $('#fleets-settings-tab').click();
                } else if (id.startsWith("tasks-")) {
                    $('#tasks-settings-tab').click();
                }

                $('#' + $(this).data("id")).click();
            });

            // when tab is selected, focus on the first input
            $("#sim-content").on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
                var target = e.target.attributes.href.value;
                var selectedTab = $(target + ' a.active');

                if (selectedTab.length > 0) {
                    target = selectedTab[0].attributes.href.value;
                }

                if ($(target + ' input[type=text]').length > 0)
                    $(target + ' input[type=text]')[0].focus();
            });

			// when failed analysis tab is selected and shown, refresh pie charts
			$("#results-failed-task-tab").on('shown.bs.tab', function (e) {
				FailedTaskAnalysis.refreshPie();
            });

            // replace javascript alert with bootstrap modal
            window.alert = function () {
                $("#alert-modal .modal-body").text(arguments[0]);
                $("#alert-modal").modal('show');
            };

            $("#sim-nav .nav-link").click( function() {
                console.log(this.id);
                var index = sim.miscSettings.globalMenuId.indexOf(this.id);

                sim.textStrings.nextTab = sim.textStrings.mainMenu[index+1] || "";
                sim.textStrings.previousTab = (index>=1) ? sim.textStrings.mainMenu[index-1] : "";

				// scroll top...some bootstrap bug related with result page...
//				console.log("Tab scroll", window.innerHeight, window.scrollX, window.scrollY);
//				console.log(document.body.scrollHeight, document.documentElement.scrollHeight);
//				console.log(document.body.clientHeight, document.body.offsetHeight);
				setTimeout(function() {
//					console.log("Tab scroll", window.innerHeight, window.scrollX, window.scrollY);
//					console.log(document.body.scrollHeight, document.documentElement.scrollHeight);
//					console.log(document.body.clientHeight, document.body.offsetHeight);
					if (document.body.scrollHeight < document.documentElement.scrollHeight) {
						window.scrollTo(0,0);
					}
//					console.log("After Tab scroll", window.scrollX, window.scrollY);
				}, 200);
            });
        }.bind(this))
    }
});
