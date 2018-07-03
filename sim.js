Vue.component('percentage-input', {
    props: {
        value: {
            type: Number,
            default: 50
        },
        numberOnly: {
            type:Boolean,
            default: false
        },
        max: {
            type: Number,
            default: 100
        },
        min: {
            type: Number,
            default: 0
        },
        step: {
            type: Number,
            default: 10
        }
    },
    data: function () {
        return {
            counter: this.value
        }
    },
    methods: {
        stepNumberInput(step) {
            this.counter += step;
            this.validateInput(this.counter);
        },

        validateInput(val) {
            this.counter = val;
            if (this.counter < this.min) this.counter = this.min;
            if (this.counter > this.max) this.counter = this.max;
            this.$emit('update:value', this.counter);
        }
    },
    template: `<div class="mt-3 mb-3 number-input">
                <button @click="stepNumberInput(-step)" class="minus"></button>
                <input min="0" max="100" type="number" @change="validateInput(parseInt($event.target.value))"
                    v-bind:value="counter">
                <button @click="stepNumberInput(step)" :class="['plus', {'number-only' : numberOnly }]"></button>
                <div class="input-group-append" v-if="!numberOnly">
                        <span class="input-group-text">%</span>
                </div>
            </div>`
});

var sim = new Vue({
    el: '#shado-sim',
    data: {

        numReps: 100, // number of replications (1 - 1000)

        /* ------------------------------
         * GLOBAL/BASIC SETTINGS
         * ------------------------------ */

        globalSettings: {
            simType: "Rail", // simulation type (aviation, railroad, ground)
            numHours: 8, // number of hours in shift (1 - 12)
            diffTrafficLevels: "n",
            trafficLevels: ["m", "m", "m", "m", "m", "m", "m", "m"], // traffic levels l (low), m (medium), h (high)
            exoFactorsType: [0, 0]
        },

        /* ------------------------------
         * TASKS SETTINGS
         * ------------------------------ */

        taskSettings: {
            numPhases: 3, // number of phases
            intervalPhases: [
                [0, 0.5],
                [0.5, 7.5],
                [7.5, 8],
                [8, 8],
                [8, 8]
            ], // hours of phases
            tasks: // array of individual task objects
                [{
                        name: "Communicating",
                        include: true,
                        isCustom: false,
                        essential: "n",
                        interruptable: "n",
                        affTeamCoord: "n",
                        arrivalDistribution: ["E", "E", "E", "E", "E"],
                        arrivalParam: [
                            [0.033333, 0.1],
                            [0.033333, 0.1],
                            [0.033333, 0.1],
                            [0.033333, 0.1],
                            [0.033333, 0.1],
                        ],
                        serviceDistribution: ["U", "U", "U", "U", "U"],
                        serviceParam: [
                            [0.5, 2],
                            [0.5, 2],
                            [0.5, 2],
                            [0.5, 2],
                            [0.5, 2]
                        ],
                        expireDistribution: ["E", "E", "E", "E", "E"],
                        expireParam: [
                            [0, 0.184],
                            [0, 0.184],
                            [0, 0.184],
                            [0, 0.184],
                            [0, 0.184]
                        ],
                        affectedByTraffic: "y",
                        affectByIROPS: [0, 1, 0, 0, 0],
                        humanErrorProb: [
                            [0.00008, 0.0004, 0.007],
                            [0.00008, 0.0004, 0.007],
                            [0.00008, 0.0004, 0.007],
                            [0.00008, 0.0004, 0.007],
                            [0.00008, 0.0004, 0.007]
                        ]

                    },
                    {
                        name: "Actuation",
                        include: true,
                        isCustom: false,
                        essential: "n",
                        interruptable: "n",
                        affTeamCoord: "n",
                        arrivalDistribution: ["E", "E", "E", "E", "E"],
                        arrivalParam: [
                            [0.033333, 0.1],
                            [0.033333, 0.1],
                            [0.033333, 0.1],
                            [0.033333, 0.1],
                            [0.033333, 0.1]
                        ],
                        serviceDistribution: ["U", "U", "U", "U", "U"],
                        serviceParam: [
                            [0.5, 2],
                            [0.5, 2],
                            [0.5, 2],
                            [0.5, 2],
                            [0.5, 2]
                        ],
                        expireDistribution: ["E", "E", "E", "E", "E"],
                        expireParam: [
                            [0, 0.184],
                            [0, 0.184],
                            [0, 0.184],
                            [0, 0.184],
                            [0, 0.184]
                        ],
                        affectedByTraffic: "y",
                        affectByIROPS: [0, 1, 0, 0, 0],
                        humanErrorProb: [
                            [0.00008, 0.0004, 0.007],
                            [0.00008, 0.0004, 0.007],
                            [0.00008, 0.0004, 0.007],
                            [0.00008, 0.0004, 0.007],
                            [0.00008, 0.0004, 0.007]
                        ]
                    },
                    {
                        name: "Directive Mandatory",
                        include: true,
                        isCustom: false,
                        essential: "n",
                        interruptable: "n",
                        affTeamCoord: "n",
                        arrivalDistribution: ["E", "E", "E", "E", "E"],
                        arrivalParam: [
                            [0.033333, 0.1],
                            [0.033333, 0.1],
                            [0.033333, 0.1],
                            [0.033333, 0.1],
                            [0.033333, 0.1]
                        ],
                        serviceDistribution: ["U", "U", "U", "U", "U"],
                        serviceParam: [
                            [0.5, 2],
                            [0.5, 2],
                            [0.5, 2],
                            [0.5, 2],
                            [0.5, 2]
                        ],
                        expireDistribution: ["E", "E", "E", "E", "E"],
                        expireParam: [
                            [0, 0.184],
                            [0, 0.184],
                            [0, 0.184],
                            [0, 0.184],
                            [0, 0.184]
                        ],
                        affectedByTraffic: "y",
                        affectByIROPS: [0, 1, 0, 0, 0],
                        humanErrorProb: [
                            [0.00008, 0.0004, 0.007],
                            [0.00008, 0.0004, 0.007],
                            [0.00008, 0.0004, 0.007],
                            [0.00008, 0.0004, 0.007],
                            [0.00008, 0.0004, 0.007]
                        ]
                    }
                ]
        },

        /* ------------------------------
         * OPERATOR SETTINGS
         * ------------------------------ */

        operatorSettings: {
            numTeams: 2, // number of teams (2 - 5)
            teams: // array of individual team objects
                [{
                        name: "Operator Team",
                        size: 1,
                        strategy: "FIFO",
                        comms: "N",
                        tasks: [0, 1],
                        priority: [
                            [1, 4, 7],
                            [1, 2, 3],
                            [1, 2, 3],
                            [1, 2, 3],
                            [1, 1, 2]
                        ],
                        AIDA: {
                            AIDAType: [false, false, false],
                            ETServiceTime: 0,
                            ETErrorRate: 0,
                            ETFailThreshold: 0,
                            IATasks: [],
                            IALevel: 'S',
                            TCALevel: 'S'
                        },
                        failThresh: [50, 50, 50, 50, 50]
                    },
                    {
                        name: "Operator Team",
                        size: 1,
                        strategy: "FIFO",
                        comms: "N",
                        tasks: [1, 2],
                        priority: [
                            [1, 1, 1],
                            [1, 2, 3],
                            [1, 2, 3],
                            [1, 2, 3],
                            [1, 1, 2]
                        ],
                        AIDA: {
                            AIDAType: [false, false, false],
                            ETServiceTime: 0,
                            ETErrorRate: 0,
                            ETFailThreshold: 0,
                            IATasks: [],
                            IALevel: 'S',
                            TCALevel: 'S'
                        },
                        failThresh: [50, 50, 50, 50, 50]
                    }
                ]
        },

        /* ------------------------------
         * COMPUTED VALUES
         * ------------------------------ */

        fleetSettings: {
            fleetTypes: 1, // number of fleets (2 - 5)
            fleets: [{
                name: "Fleet",
                numVehicles: 1,
                comms: "N",
                tasks: [0, 1, 2]
            }]
        }
    },

    computed: {

        /* ------------------------------
         * GLOBAL SETTINGS COMPUTED VALUES
         * ------------------------------ */

        // array of traffic levels per hour of 0, 0.5, or 1
        traffic() {
            var traff = this.globalSettings.trafficLevels;
            for (i = 0; i < traff.length; i++) {
                if (traff[i] === "l") {
                    traff[i] = 0;
                } else if (traff[i] === "h") {
                    traff[i] = 1;
                } else {
                    traff[i] = 0.5;
                }
            }
            return traff;
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

        /* ------------------------------
         * TASK SETTINGS COMPUTED VALUES
         * ------------------------------ */

        // true if 15 tasks
        maxTasksReached() {
            return this.numTaskTypes >= 15;
        },

        // number of tasks
        numTaskTypes() {
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
            for (var j = 0; j < this.taskSettings.numPhases; j++) {
                dists.push([]);
                for (i = 0; i < this.taskSettings.tasks.length; i++) {
                    if (this.taskSettings.tasks[i].arrivalDistribution && this.taskSettings.tasks[i].include) {
                        dists[j].push(this.taskSettings.tasks[i].arrivalDistribution[j]);
                    }
                }
            }
            return dists;
        },

        // array containing all task arrival time parameters
        arrPms() {
            var params = [];
            for (var j = 0; j < this.taskSettings.numPhases; j++) {
                params.push([]);
                for (i = 0; i < this.taskSettings.tasks.length; i++) {
                    if (this.taskSettings.tasks[i].arrivalParam && this.taskSettings.tasks[i].include) {
                        params[j].push(this.taskSettings.tasks[i].arrivalParam[j]);
                    }
                }
            }
            return params;
        },

        // array containing all task service time distributions
        serDists() {
            var dists = [];
            for (var j = 0; j < this.taskSettings.numPhases; j++) {
                dists.push([]);
                for (i = 0; i < this.taskSettings.tasks.length; i++) {
                    if (this.taskSettings.tasks[i].serviceDistribution && this.taskSettings.tasks[i].include) {
                        dists[j].push(this.taskSettings.tasks[i].serviceDistribution[j]);
                    }
                }
            }
            return dists;
        },

        // array containing all task service time parameters
        serPms() {
            var params = [];
            for (var j = 0; j < this.taskSettings.numPhases; j++) {
                params.push([]);
                for (i = 0; i < this.taskSettings.tasks.length; i++) {
                    if (this.taskSettings.tasks[i].serviceParam && this.taskSettings.tasks[i].include) {
                        params[j].push(this.taskSettings.tasks[i].serviceParam[j]);
                    }
                }
            }
            return params;
        },

        // array containing all task expiration time distributions
        expDists() {
            var dists = [];
            for (var j = 0; j < this.taskSettings.numPhases; j++) {
                dists.push([]);
                for (i = 0; i < this.taskSettings.tasks.length; i++) {
                    if (this.taskSettings.tasks[i].expireDistribution && this.taskSettings.tasks[i].include) {
                        dists[j].push(this.taskSettings.tasks[i].expireDistribution[j]);
                    }
                }
            }
            return dists;
        },

        // array containing all task expiration time parameters
        expPms() {
            var params = [];
            for (var j = 0; j < this.taskSettings.numPhases; j++) {
                params.push([]);
                for (var i = 0; i < this.taskSettings.tasks.length; i++) {
                    if (this.taskSettings.tasks[i].expireParam && this.taskSettings.tasks[i].include) {
                        params[j].push(this.taskSettings.tasks[i].expireParam[j]);
                    }
                }
            }
            return params;
        },

        // array containing all tasks affected by traffic
        affByTraff() {
            var traff = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].affectedByTraffic && this.taskSettings.tasks[i].affectByIROPS && this.taskSettings.tasks[i].include) {
                    if (this.taskSettings.tasks[i].affectedByTraffic === "y") {
                        var affected = this.taskSettings.tasks[i].affectByIROPS;
                        for (var j = 0; j < affected.length; j++) {
                            if (typeof affected[j] !== "number") {
                                affected[j] = affected[j] ? 1 : 0;
                            }
                        }
                        traff.push(affected);
                    } else {
                        traff.push([0, 0]);
                    }
                }
            }
            return traff;
        },

        // array containing all task human error probabilities
        humanError() {
            var probs = [];
            for (var j = 0; j < this.taskSettings.numPhases; j++) {
                probs.push([]);
                for (var i = 0; i < this.taskSettings.tasks.length; i++) {
                    if (this.taskSettings.tasks[i].humanErrorProb && this.taskSettings.tasks[i].include) {
                        probs[j].push(this.taskSettings.tasks[i].humanErrorProb[j]);
                    }
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

        phaseBegin() {
            var pb = [];
            for (i = 0; i < this.taskSettings.numPhases; i++) {
                pb.push(this.taskSettings.intervalPhases[i][0]);
            }
            return pb;
        },

        opPriority() {
            var prty = [];
            for (var j = 0; j < this.taskSettings.numPhases; j++) {
                prty.push([]);
                for (var i = 0; i < this.operatorSettings.teams.length; i++) {
                    prty[j].push(this.operatorSettings.teams[i].priority[j]);
                }
            }
            return prty;
        },

        // array containing operator team communication types
        teamComm() {
            var comms = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].comms) {
                    comms.push(this.operatorSettings.teams[i].comms);
                }
            }
            return comms;
        },
        // array containing operator team fail threshold
        teamFailThreshold() {
            var ft = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].failThresh) {
                    var teamft = [];
                    for (var n of this.operatorSettings.teams[i].failThresh) {
                        teamft.push(n / 100);
                    }
                    ft.push(teamft);
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
        // array containing ET Service Time
        ETServiceTime() {
            var st = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].AIDA.ETServiceTime) {
                    st.push(this.operatorSettings.teams[i].AIDA.ETServiceTime / 100);
                }
            }
            return st;
        },
        //array contining Error Rate
        ETErrorRate() {
            var er = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].AIDA.ETErrorRate) {
                    er.push(this.operatorSettings.teams[i].AIDA.ETErrorRate / 100);
                }
            }
            return er;
        },
        //array for fail threshold
        ETFailThreshold() {
            var ft = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].AIDA.ETFailThreshold) {
                    ft.push(this.operatorSettings.teams[i].AIDA.ETFailThreshold / 100);
                }
            }
            return ft;
        },
        //AIDA IA Tasks
        IATasks() {
            var tasks = [];
            for (var i = 0; i < this.operatorSettings.teams.length; i++) {
                tasks.push([]);
                if (this.operatorSettings.teams[i].AIDA.IATasks) {
                    for(var j=0; j < this.operatorSettings.teams[i].AIDA.IATasks.length; j++) {
                        var k = this.operatorSettings.teams[i].AIDA.IATasks[j];
                        // only tasks included in op teams...
                        if (this.operatorSettings.teams[i].tasks.includes(k)) {
                            tasks[i].push(k);
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

        // array with number of vehicles per fleet
        numVehicles() {
            var vehicles = [];
            for (i = 0; i < this.fleetSettings.fleets.length; i++) {
                if (this.fleetSettings.fleets[i].numVehicles) {
                    vehicles.push(this.fleetSettings.fleets[i].numVehicles);
                } else {
                    vehicles.push(0);
                }
            }
            return vehicles;
        },

        // array containing fleet autonomy levels
        fleetAutoLevel() {
            var al = [];
            for (i = 0; i < this.fleetSettings.fleets.length; i++) {
                if (this.fleetSettings.fleets[i].comms) {
                    al.push(this.fleetSettings.fleets[i].comms);
                } else {
                    al.push([]);
                }
            }
            return al;
        },

        // array containing fleet tasks arrays
        fleetHetero() {
            var tasks = [];
            for (i = 0; i < this.fleetSettings.fleets.length; i++) {
                if (this.fleetSettings.fleets[i].tasks) {
                    tasks.push(this.fleetSettings.fleets[i].tasks);
                } else {
                    tasks.push([]);
                }
            }
            return tasks;
        }

    },

    methods: {
        // when numHours changed
        updateTrafficLvls() {
            var lvls = this.globalSettings.trafficLevels;
            if (this.globalSettings.diffTrafficLevels === "n") {
                lvls.splice(0);
            }

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

        getTaskArray() {
            var task = [];

            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                task.push(1);
            }

            return task;
        },

        addCustomTask() {
            this.taskSettings.tasks.push({
                name: "Custom Task",
                include: true,
                isCustom: true,
                essential: "n",
                interruptable: "n",
                affTeamCoord: "n",
                arrivalDistribution: ["E", "E", "E", "E", "E"],
                arrivalParam: [
                    [],
                    [],
                    [],
                    [],
                    []
                ],
                serviceDistribution: ["E", "E", "E", "E", "E"],
                serviceParam: [
                    [],
                    [],
                    [],
                    [],
                    []
                ],
                expireDistribution: ["E", "E", "E", "E", "E"],
                expireParam: [
                    [],
                    [],
                    [],
                    [],
                    []
                ],
                affectedByTraffic: "n",
                affectByIROPS: [],
                humanErrorProb: [
                    [],
                    [],
                    [],
                    [],
                    []
                ]
            });

            // add priority for each operatorSettings.teams
            for (var j = 0; j < this.taskSettings.numPhases; j++) {
                for (i = 0; i < this.operatorSettings.teams.length; i++) {
                    this.operatorSettings.teams[i].priority[j].push(1);
                }
            }
        },

        removeCustomTask(task) {
            if (confirm("Are you sure you want to delete this custom task?")) {

                // remove from taskSettings.tasks
                var taskIndex = this.taskSettings.tasks.indexOf(task);
                this.taskSettings.tasks.splice(taskIndex, 1);

                // remove priority for each operatorSettings.teams
                for (var k = 0; k < this.taskSettings.numPhases; k++) {
                    for (i = 0; i < this.operatorSettings.teams.length; i++) {
                        var priIndex = -1;
                        //console.log(this.operatorSettings.teams[i].priority, taskIndex);
                        for (var j = 0; j < this.operatorSettings.teams[i].priority[k].length; j++) {
                            if (this.operatorSettings.teams[i].priority[k][j] === taskIndex)
                                priIndex = j;
                            else if (this.operatorSettings.teams[i].priority[k][j] > taskIndex)
                                this.operatorSettings.teams[i].priority[k][j]--;
                        }

                        if (priIndex !== -1) this.operatorSettings.teams[i].priority[k].splice(priIndex, 1);
                        //console.log(this.operatorSettings.teams[i].priority);
                    }
                }

                $("#tasks-global-settings-tab").click();
            }
        },

        isAffectedByTrafficPhases(task) {
            return task.affectedByTraffic === "y" && this.taskSettings.numPhases > 1;
        },

        updateOperatorTeams() {
            var teams = this.operatorSettings.teams;
            if (this.operatorSettings.numTeams > teams.length) {
                var tasks = sim.getTaskArray();
                var ft = [];

                for (i = 0; i < this.taskSettings.tasks.length; i++) {
                    ft.push(50);
                }
                while (teams.length < this.operatorSettings.numTeams) {
                    teams.push({
                        name: "Operator Team",
                        size: 1,
                        strategy: "FIFO",
                        comms: "N",
                        tasks: [],
                        priority: [tasks, tasks, tasks, tasks, tasks],
                        AIDA: {
                            AIDAType: [false, false, false],
                            ETServiceTime: 0,
                            ETErrorRate: 0,
                            ETFailThreshold: 0,
                            IATasks: [],
                            IALevel: 'S',
                            TCALevel: 'S'
                        },
                        failThresh: ft
                    })
                }
            } else {
                teams.splice(this.operatorSettings.numTeams);
            }
        },

        removeOperatorTeam(team) {
            if (confirm("Are you sure you want to delete this operator team?")) {
                this.operatorSettings.teams.splice(this.operatorSettings.teams.indexOf(team), 1);
            }
            this.operatorSettings.numTeams = this.operatorSettings.teams.length;
            $("#operators-global-settings-tab").click();
        },

        updateFleets() {
            var fleets = this.fleetSettings.fleets;
            if (this.fleetSettings.fleetTypes > fleets.length) {
                while (fleets.length < this.fleetSettings.fleetTypes) {
                    fleets.push({
                        name: "Fleet",
                        numVehicles: 1,
                        comms: "N",
                        tasks: []
                    })
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
            $("#fleets-global-settings-tab").click();
        },

        updatePhases() {
            // change numPhases hours
            var numPhases = this.taskSettings.numPhases;
            var numHours = this.globalSettings.numHours;

            for (let i = 1; i <= 3; i++) {
                this.$refs["interval-" + i].noUiSlider.updateOptions({
                    range: {
                        'min': 0,
                        'max': numHours
                    }
                });
            }
            // set last slider
            var tip = this.taskSettings.intervalPhases
            if (numPhases === 1) {
                tip[0] = [0, numHours];
            } else {
                tip[numPhases - 1] = [tip[numPhases - 2][1], numHours];
            }
            this.$refs["interval-" + numPhases].noUiSlider.set(tip[numPhases - 1]);
        },
        onChangeNumPhases() {
            var numPhases = this.taskSettings.numPhases;
            var numHours = this.globalSettings.numHours;

            // right slider enable
            for (let i = 1; i < numPhases; i++) {
                this.$refs["interval-" + i].getElementsByClassName("noUi-origin")[1].removeAttribute('disabled');
            }
            // right-slider of last slider disabled
            this.$refs["interval-" + numPhases].getElementsByClassName("noUi-origin")[1].setAttribute('disabled', true);

            // set last slider
            var tip = this.taskSettings.intervalPhases
            if (numPhases === 1) {
                tip[0] = [0, numHours];
            } else {
                tip[numPhases - 1] = [tip[numPhases - 2][1], numHours];
            }
            this.$refs["interval-" + numPhases].noUiSlider.set(tip[numPhases - 1]);
        },
        setSimType(str) {
            this.globalSettings.simType = str;
            this.$nextTick(function () {
                $("#sim-type").modal('hide');
            });
        }
    },

    mounted: function () {
        //for(let i=1;i<=this.taskSettings.numPhases;i++) {
        for (let i = 1; i <= 5; i++) {
            //console.log(this.$refs["interval-" + i]);
            noUiSlider.create(this.$refs["interval-" + i], {
                start: [this.taskSettings.intervalPhases[i - 1][0], this.taskSettings.intervalPhases[i - 1][1]],
                step: 0.5,
                range: {
                    'min': 0,
                    'max': this.globalSettings.numHours
                },
                connect: true,
                pips: {
                    mode: 'steps',
                    values: [0, 8],
                    filter: function (value, type) {
                        return value * 2 % 2 ? 0 : 1;
                    },
                    format: wNumb({
                        decimal: 1
                    }),
                    density: 100
                }
            });

            this.$refs["interval-" + i].noUiSlider.on('update', (values, handle) => {
                var val = parseFloat(values[handle]);
                var tip = this.taskSettings.intervalPhases;
                if (i > 1 && handle === 0) {
                    if (tip[i - 2][1] !== val) {
                        tip[i - 2][1] = val;
                        setTimeout(() => {
                            this.$refs["interval-" + (i - 1)].noUiSlider.set(tip[i - 2]);
                        }, 100);
                    }
                }
                if (i < this.taskSettings.numPhases && handle === 1) {
                    if (tip[i][0] !== val) {
                        tip[i][0] = val;
                        //console.log(this.$refs["interval-" + (i+1)][0], tip[i]);
                        setTimeout(() => {
                            this.$refs["interval-" + (i + 1)]
                                .noUiSlider.set(tip[i]);
                        }, 100);
                    }
                }
                tip[i - 1].splice(handle, 1, val);
            });
        }
        // left-slider of first slider disabled
        this.$refs["interval-1"].getElementsByClassName("noUi-origin")[0].setAttribute('disabled', true);
        // right-slider of last slider disabled
        this.$refs["interval-" + this.taskSettings.numPhases].getElementsByClassName("noUi-origin")[1].setAttribute('disabled', true);
        //this.$refs["interval-" + this.taskSettings.numPhases].noUiSlider.set([0.5, 8]);
    }
});

$(document).ready(function () {
    //Json Builder
    $("#sumbitBtn").click(function () {
        var out = {
            "numHours": sim.globalSettings.numHours,
            "traffic": sim.traffic,
            "numReps": sim.numReps,
            "numPhases": sim.taskSettings.numPhases,
            "phaseBegin": sim.phaseBegin,
            "hasExogenous": sim.hasExogenous,

            "numTeams": sim.operatorSettings.numTeams,
            "teamSize": sim.teamSize,
            "opNames": sim.opNames,
            "opStrats": sim.teamStrategy,
            "opTasks": sim.opTasks,
            "taskPrty": sim.opPriority,
            "teamComm": sim.teamComm,
            "humanError": sim.humanError,
            "ECC": sim.teamFailThreshold,

            "AIDAtype": sim.AIDAType,
            "ETServiceTime": sim.ETServiceTime,
            "ETErrorRate": sim.ETErrorRate,
            "ETFailThreshold": sim.ETFailThreshold,
            "IAtasks": sim.IATasks,
            "IALevel": sim.IALevel,
            "TCALevel": sim.TCALevel,

            "fleetTypes": sim.fleetSettings.fleetTypes,
            "numvehicles": sim.numVehicles,
            "autolvl": sim.fleetAutoLevel,
            "fleetHetero": sim.fleetHetero,

            "numTaskTypes": sim.numTaskTypes,
            "taskNames": sim.taskNames,
            "arrDists": sim.arrDists,
            "arrPms": sim.arrPms,
            "serDists": sim.serDists,
            "serPms": sim.serPms,
            "expDists": sim.expDists,
            "expPms": sim.expPms,
            "affByTraff": sim.affByTraff,
            "teamCoordAff": sim.teamCoordAff,
            "interruptable": sim.interruptable,
            "essential": [0, 0, 1],

            "leadTask": [],
            "taskNames_f": ["Shitft Follow", "Rude Follow"],
            "arrDists_f": [["C", "C"], ["C", "C"]],
            "arrPms_f": [[[1], [1]], [[1], [1]]],
            "serDists_f": [["C", "C"], ["C", "C"]],
            "serPms_f": [[[5], [2]], [[5], [2]]],
            "expDists_f": [["C", "C"], ["C", "C"]],
            "expPms_f": [[[70], [70]], [[70], [70]]],
            "affByTraff_f": [[0, 0], [0, 0]],
            "teamCoordAff_f": [0, 1],
            "taskPrty_f": [[[0, 1]], [[0, 1]]],
            "interruptable_f": [1, 1],
            "essential_f": [0, 0],
            "humanError_f": [[[0.00008, 0.003, 0.007], [0.00008, 0.003, 0.007]], [[0.00008, 0.003, 0.007], [0.00008, 0.003, 0.007]]],
            "ECC_f": [[0.5, 0.5]]

        };
        console.log(out);
        //hide download
        document.getElementById("downloadBtn").style.display = "none";
        // document.getElementById("downloadSummary").style.display = "none";

        //Download Json
        $("#container").empty();
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(out));
        $('<a href="data:' + data + '" download="shadoParams.json">Download <br> Input JSON</a>').appendTo('#container');
        $.ajax({
            type: "POST",
            url: "http://apps.hal.pratt.duke.edu:8080/shado/testpost",
            // The key needs to match your method's input parameter (case-sensitive).
            data: JSON.stringify(out),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                alert(msg);
                console.log("response received");
                console.log(msg);
                // move(100);
                //  var obj = JSON.stringify(msg)
                // // var tempParseData = obj;
                // obj = JSON.parse(obj);
                // console.log(obj);
                // alert(obj);
                // if(msg.status == 'success')
                alert("PARAMETERS SUBMITTED!");
            },
            complete: function (msg) {
                console.log("response received");
                console.log(msg);
                var obj = JSON.stringify(msg);

                if (msg.status == 500) {
                    alert("Server Error: Check parameters(maybe not enough tasks)!")
                    alert(msg.responseText);
                }
                if (msg.status == 200) {
                    alert(msg.responseText);
                    //Allow Download
                    //Show download button
                    showDownloadBtn();
                    // downloadRepCSV();
                    // downloadSummary();
                }
                document.getElementById("sumbitBtn").textContent = "Submit Again";

                BoxPlot.visualize("http://apps.hal.pratt.duke.edu/out/Utilization.json?" + new Date().getTime(), "#boxSVG", "1");
            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    });
    //Download  
    $("#downloadCSV").click(function () {
        //  $.get("http://localhost:8080/shado/getRepDetail");
        window.location.href = "http://apps.hal.pratt.duke.edu:8080/shado/getRepDetail";
        win.focus();
        console.log("GET request 'getRepDetail' sent");
    });

    $("#downloadSummary").click(function () {
        var xhttp = new XMLHttpRequest();
        // $.get("http://localhost:8080/shado/getSummary");
        // xhttp.open("GET", "http://localhost:8080/shado/getSummary", true);
        window.location.href = "http://apps.hal.pratt.duke.edu:8080/shado/getSummary";
        win.focus();
        console.log("GET request 'getSummary' sent");
    });

    $("#downloadJSON").click(function () {
        window.location.href = "http://apps.hal.pratt.duke.edu:8080/shado/getUtilizationJSON";
        console.log("GET request 'getUtilizationJSON' sent");
    });
    $(function () {
        $("form").submit(function () {
            return false;
        });
    });

    // when tab is selected, focus on the first input
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = e.target.attributes.href.value;
        var selectedTab = $(target + ' a.active');

        if (selectedTab.length > 0) {
            target = selectedTab[0].attributes.href.value;
        }

        if ($(target + ' input[type=text]').length > 0)
            $(target + ' input[type=text]')[0].focus();
    });

    // In Firefox, mousewheel should not change the value of the input number
    $('input[type=number]').on('wheel', function () {
        var el = $(this);
        var focused = el.is(":focus");
        el.blur();
        console.log("Scrolling?");
        if (focused) {
            setTimeout(function () {
                el.focus();
            }, 100);
        }
    });

    $('#sim-type').modal(true);
});

function showDownloadBtn() {
    document.getElementById("downloadBtn").style.display = "block";
    document.getElementById("downloadSummary").style.display = "block";
}
