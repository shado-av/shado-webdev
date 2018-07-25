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
        },
        margin: {
            type:Boolean,
            default: true
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
            this.$forceUpdate();    // sometimes update not working...
        }
    },
    template: `<div :class="['number-input', {'mt-3' : margin}, {'mb-3' : margin}]">
                <button @click="stepNumberInput(-step)" class="minus"></button>
                <input type="number" @change="validateInput(parseInt($event.target.value))"
                    :value="value">
                <button @click="stepNumberInput(step)" :class="['plus', {'number-only' : numberOnly }]"></button>
                <div class="input-group-append" v-if="!numberOnly">
                        <span class="input-group-text">%</span>
                </div>
            </div>`
});

var sim = new Vue({
    el: '#shado-sim',
    data: {
        // 0.9.2 remove phase and add turnOver settings
        // 0.9.1 add opExpertise settings
        version: "0.9.2", // data version for checking valid data when loading JSON file
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
                        expireDistribution: ["E"],
                        expireParam: [
                            [1440],
                        ],
                        affectByIROPS: [0],
                        humanErrorProb: [
                            [0.00008, 0.0004, 0.007],
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
                        expireDistribution: ["E"],
                        expireParam: [
                            [1440],
                        ],
                        affectByIROPS: [0],
                        humanErrorProb: [
                            [0.00008, 0.0004, 0.007],
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
                        expireDistribution: ["E"],
                        expireParam: [
                            [1440],
                        ],
                        affectByIROPS: [0],
                        humanErrorProb: [
                            [0.00008, 0.0004, 0.007],
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
            teams: // array of individual team objects
                [{
                        name: "Operator Team 1",
                        size: 1,
                        strategy: "FIFO",
                        comms: "N",
                        tasks: [0, 1],
                        flexible: 'n',
                        expertise: [[1],[1],[0]],
                        priority: [
                            [1, 4, 6],
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
                        failThresh: [
                            [10, 20, 30],
                        ]
                    },
                    {
                        name: "Operator Team 2",
                        size: 1,
                        strategy: "FIFO",
                        comms: "N",
                        tasks: [1, 2],
                        flexible: 'n',
                        expertise: [[0],[1],[1]],
                        priority: [
                            [1, 1, 1],
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
                        failThresh: [
                            [10, 20, 30],
                        ]
                    }
                ]
        },

        /* ------------------------------
         * COMPUTED VALUES
         * ------------------------------ */

        fleetSettings: {
            fleetTypes: 1, // number of fleets (2 - 5)
            numNameFleet: 3, // for just naming
            fleets: [{
                    name: "Fleet 1",
                    numVehicles: 1,
                    comms: "N",
                    tasks: [0, 1]
                },
                {
                    name: "Fleet 2",
                    numVehicles: 1,
                    comms: "N",
                    tasks: [1, 2]
                }
            ]
        }
    },

    computed: {

        /* ------------------------------
         * GLOBAL SETTINGS COMPUTED VALUES
         * ------------------------------ */

        // array of traffic levels per hour of 0, 0.5, or 1
        traffic() {
            var traff = [];
            var traffOrig = this.globalSettings.trafficLevels;
            for (i = 0; i < traffOrig.length; i++) {
                if (traffOrig[i] === "l") {
                    traff[i] = 0;
                } else if (traffOrig[i] === "h") {
                    traff[i] = 1;
                } else {
                    traff[i] = 0.5;
                }
            }
            return traff;
        },

        // array of existence of turn over [0,0]
        hasTransition() {
            var to = [];
            var hasTo = this.globalSettings.hasTransition;
            for (var j = 0; j < 2; j++) {
                to[j] = hasTo[j] ? 1 : 0;
            }
            return to;
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
            var exoRv = "None";

            if (exoFT[0] || exoFT[1]) {
                if (exoFT[0]) exoRv = "Type 1";
                if (exoFT[0] && exoFT[1]) exoRv += ", Type 2";
                else if (exoFT[1]) exoRv = "Type 2";
            }

            return exoRv;
        },

        /* ------------------------------
         * TASK SETTINGS COMPUTED VALUES
         * ------------------------------ */

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
                        for (var k = 0; k < this.fleetSettings.fleets.length; k++) {
                            if (this.operatorSettings.teams[i].expertise[j] && this.operatorSettings.teams[i].expertise[j][k] && this.fleetSettings.fleets[k].tasks.includes(j)) {
                                exps.push(1);
                            } else
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
                prty.push(this.operatorSettings.teams[i].priority[0]);
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

            for (var i = 0; i < this.operatorSettings.teams.length; i++) {
                ft.push(this.operatorSettings.teams[i].failThresh[0]);
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

        addCustomTask() {
            var x = this.taskSettings.numNameTask++;
            sim.newTask("Custom Task " + x, -1);
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
                expireDistribution: ["E"],
                expireParam: [
                    [1440],
                ],
                affectByIROPS: [0],
                humanErrorProb: [
                    [0.00008, 0.0004, 0.007],
                ],
                leadTask: leadTask,
            });

            // add priority for each operatorSettings.teams
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                this.operatorSettings.teams[i].priority[0].push(1);
                // add fail threshold
                this.operatorSettings.teams[i].failThresh[0].push(50);
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

            //console.log(taskIndex, this.operatorSettings.teams[0].failThresh[0]);
            // remove priority for each operatorSettings.teams
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                console.log(taskIndex, this.operatorSettings.teams[i].failThresh[0]);
                this.operatorSettings.teams[i].priority[0].splice(taskIndex, 1);
                this.operatorSettings.teams[i].failThresh[0].splice(taskIndex, 1);
                console.log(taskIndex, i, this.operatorSettings.teams[i].failThresh[0]);
            }
        },

        removeCustomTask(task) {
            if (confirm("Are you sure you want to delete this custom task?")) {

                this.removeTask(task);

                $("#tasks-global-settings-tab").click();
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

        updateOperatorTeams() {
            var teams = this.operatorSettings.teams;
            if (this.operatorSettings.numTeams > teams.length) {
                var tasks = sim.getTaskArray(); // default priority for each task
                var ft = []; // failThreshold default value for each task
                var exp = [];
                for (var i = 0; i < this.taskSettings.tasks.length; i++) {
                    ft.push(50);
                    exp.push([]);
                    for(var j=0; j < this.fleetSettings.fleets.length;j++) {
                        exp[i][j] = true;
                    }
                }

                while (teams.length < this.operatorSettings.numTeams) {
                    var x = this.operatorSettings.numNameTeam++;
                    teams.push({
                        name: "Operator Team " + x,
                        size: 1,
                        strategy: "FIFO",
                        comms: "N",
                        tasks: [],
                        flexible: 'y',
                        expertise: exp,
                        priority: [tasks],
                        AIDA: {
                            AIDAType: [false, false, false],
                            ETServiceTime: 0,
                            ETErrorRate: 0,
                            ETFailThreshold: 0,
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
            if (confirm("Are you sure you want to delete this operator team?")) {
                this.operatorSettings.teams.splice(this.operatorSettings.teams.indexOf(team), 1);
            }
            this.operatorSettings.numTeams = this.operatorSettings.teams.length;
            $("#operators-global-settings-tab").click();
        },

        // update whole matrix to true
        updateOpExpertise(team) {
            for(var i=0;i<this.taskSettings.tasks.length;i++) {
                for(var j=0;j<this.fleetSettings.fleets.length;j++) {
                    team.expertise[i][j]=true;
                }
            }
        },

        // check whether fleet has assigned this task
        disableOpExpertise(fleet, taskIndex) {
            return !fleet.tasks.includes(taskIndex);
        },

        updateFleets() {
            var fleets = this.fleetSettings.fleets;
            if (this.fleetSettings.fleetTypes > fleets.length) {
                while (fleets.length < this.fleetSettings.fleetTypes) {
                    var x = this.fleetSettings.numNameFleet++;
                    fleets.push({
                        name: "Fleet " + x,
                        numVehicles: 1,
                        comms: "N",
                        tasks: []
                    });

                    // change opExpertiseMatrix to true if opFlexible
                    for(var i=0; i<this.operatorSettings.teams.length; i++) {
                        if (this.operatorSettings.teams[i].flexible === 'y') {
                            for(var j=0;j<this.taskSettings.tasks.length;j++) {
                                this.operatorSettings.teams[i].expertise[j][fleets.length-1] = true;
                            }
                        }
                    }
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

        setSimType(str) {
            this.globalSettings.simType = str;
            this.$nextTick(function () {
                $("#sim-type").modal('hide');
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
            return params;  // for 'T'
        },

        saveData() {
            localStorage.setItem('allData'+this.version, JSON.stringify(this.$data));
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
                    this.numReps = data.numReps;
                    this.globalSettings = data.globalSettings;
                    this.taskSettings = data.taskSettings;
                    this.operatorSettings = data.operatorSettings;
                    this.fleetSettings = data.fleetSettings;
                }
            }
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
        this.loadData();
    }
});

$(document).ready(function () {
    var serverName = env.serverUrl;
    var sessionId = "";
    var sessionQuery = "";

    //Json Builder
    $("#submitBtn").click(function () {
        $("#submitBtn").prop('disabled', true);
        var out = {
            "numHours": sim.globalSettings.numHours,
            "traffic": sim.traffic,
            "numReps": sim.numReps,
            "hasTurnOver": sim.hasTransition,
            "turnOverDists": sim.globalSettings.transitionDists,
            "turnOverPms": sim.transitionPms,
            "hasExogenous": sim.hasExogenous,

            "numTeams": sim.operatorSettings.numTeams,
            "teamSize": sim.teamSize,
            "opNames": sim.opNames,
            "opStrats": sim.teamStrategy,
            "opTasks": sim.opTasks,
            "opExpertise": sim.opExpertise,
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
        document.getElementById("downloadBtn").style.display = "none";
        // document.getElementById("downloadSummary").style.display = "none";

        //Download Json
        $("#container").empty();
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(out));
        $('<a href="data:' + data + '" download="shadoParams.json">Download <br> Input JSON</a>').appendTo('#container');
        $.ajax({
            type: "POST",
            url: serverName + "/shado/testpost",
            // The key needs to match your method's input parameter (case-sensitive).
            data: JSON.stringify(out),
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (msg) {
                console.log("response success received");
                console.log(msg);
                sessionId = msg.substr(msg.lastIndexOf(":") + 2);
                sessionQuery = "?sessionN=" +sessionId;
                console.log(sessionId, sessionQuery);
                //alert(msg);

                // Show download button
                showDownloadBtn();
                BoxPlot.visualize(serverName + "/shado/getUtilizationJSON" + sessionQuery, "#boxSVG", "1");
                $("#view-results-tab").click();
            },
            complete: function (msg) {
                console.log("response complete received");

                document.getElementById("submitBtn").textContent = "Submit Again";
                $("#submitBtn").prop('disabled', false);
            },
            error: function (request, status, error) {
                console.log(request, status, error);
                alert("Server Error: " + request.responseText);
            }
        });
    });
    //Download  
    $("#downloadCSV").click(function () {
        //  $.get("http://localhost:8080/shado/getRepDetail");
        window.location.href = serverName + "/shado/getRepDetail" + sessionQuery;
        win.focus();
        console.log("GET request 'getRepDetail' sent");
    });

    $("#downloadSummary").click(function () {
        var xhttp = new XMLHttpRequest();
        // $.get("http://localhost:8080/shado/getSummary");
        // xhttp.open("GET", "http://localhost:8080/shado/getSummary", true);
        window.location.href = serverName + "/shado/getSummary" + sessionQuery;
        win.focus();
        console.log("GET request 'getSummary' sent");
    });

    $("#downloadJSON").click(function () {
        window.location.href = serverName + "/shado/getUtilizationJSON" + sessionQuery;
        console.log("GET request 'getUtilizationJSON' sent");
    });

    $(function () {
        $("form").submit(function () {
            return false;
        });
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

    // enable tooltip
    $('body').tooltip({selector:'[data-toggle=tooltip]'});

    // pop-up simulation type chooser
    $('#sim-type').modal(true);

    $('#review-settings-tab').click( function() {
        TrafficLevelBarChart.drawTrafficeLevelBarChart("#trafficLevel", sim.globalSettings.trafficLevels);
    });

    $(document)
        .ajaxStart(NProgress.start)
        .ajaxStop(NProgress.done);
});

function showDownloadBtn() {
    document.getElementById("downloadBtn").style.display = "block";
    document.getElementById("downloadSummary").style.display = "block";
}
