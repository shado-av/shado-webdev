Vue.component('distribution-params', {
    props: {
        dist: {     // "ELUCTN"
            type: String,
            default: 50
        },
        params: {   // [4, 6, 8]
            type: Array,
            default: []
        },
        distLabel: {
            type: String,
            default: ""
        },
        paramsLabel: {
            type: String,
            default: ""
        },
        nOption: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getPos(dist) {
            var x = 18, y = 0;
            switch(dist) {
                case 'E':
                    x = 3; y = 1;
                    break;
                case 'L':
                    x = 4; y = 2;
                    break;
                case 'U':
                    x = 6; y = 2;
                    break;
                case 'C':
                    x = 8; y = 1;
                    break;
                case 'T':
                    x = 9; y = 3;
                    break;
            }
            return { x: x, y: y};
        },
        onChangeDist(e) {
            var d_params = this.params;
            var d_dist = e.target.value;

            // save the old value
            var xx = this.getPos(this.dist);
            //console.log("Before", this.dist, xx, d_params);

            for(var i=0;i<xx.y;i++) {
                d_params[i+xx.x] = d_params[i];
            }

            // restore the saved value
            xx = this.getPos(d_dist);
            for(var i=0;i<xx.y;i++) {
                d_params[i] = d_params[i+xx.x];
            }
            //console.log("After", d_dist,xx, d_params);

            this.$emit('update:dist', d_dist);
            this.$emit('update:params', d_params);
            //this.$forceUpdate();
        }
    },
    template:  `<div class="form-group form-row">
                    <div class="col-3">
                        <label>{{distLabel}}</label>
                        <select class="custom-select" id="transition" :value="dist" @change="onChangeDist">
                            <option value="E">Exponential</option>
                            <option value="L">Log Normal</option>
                            <option value="U">Uniform</option>
                            <option value="C">Constant</option>
                            <option value="T">Triangular</option>
                            <option value="N" v-show="nOption">Never Expires</option>
                        </select>
                        <small class="form-text text-muted">Type</small>
                    </div>

                    <!-- distribution parameters (task.arrivalParam) -->
                    <div class="col-9">
                        <label>{{paramsLabel}}</label>
                        <div v-if="dist === 'E'" class="row no-gutters">
                            <div class="col">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">Mean (Minutes)</small>
                            </div>
                        </div>
                        <div v-if="dist === 'L'" class="row no-gutters">
                            <div class="col mr-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">Mean (Minutes)</small>
                            </div>
                            <div class="col ml-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[1]">
                                <small class="form-text text-muted">Standard Deviation (Minutes)</small>
                            </div>
                        </div>
                        <div v-if="dist === 'U'" class="row no-gutters">
                            <div class="col mr-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">Minimum (Minutes)</small>
                            </div>
                            <div class="col ml-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[1]">
                                <small class="form-text text-muted">Maximum (Minutes)</small>
                            </div>
                        </div>
                        <div v-if="dist === 'C'" class="row no-gutters">
                            <div class="col mr-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">Number (Minutes)</small>
                            </div>
                        </div>
                        <div v-if="dist === 'T'" class="row no-gutters">
                            <div class="col mr-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">Minimum (Minutes)</small>
                            </div>
                            <div class="col mx-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[1]">
                                <small class="form-text text-muted">Mode (Minutes)</small>
                            </div>
                            <div class="col ml-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[2]">
                                <small class="form-text text-muted">Maximum (Minutes)</small>
                            </div>
                        </div>
                    </div>
                </div>`
});

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
    methods: {
        stepNumberInput(step) {
            this.validateInput(this.value + step);
        },

        validateInput(val) {
            if (val < this.min) val = this.min;
            if (val > this.max) val = this.max;

            this.$emit('update:value', val);
            this.$forceUpdate();    // not updating when you input more than max twice
            this.$emit('change');   // change event...
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
        // 0.9.3 add flex position, change traffic per fleet
        // 0.9.2 remove phase and add turnOver settings
        // 0.9.1 add opExpertise settings
        version: "0.9.3", // data version for checking valid data when loading JSON file
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
                        expireDistribution: ["N"],
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
                        expireDistribution: ["N"],
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
                        expertise: [[0,1],[1,1],[1,1]],
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
                }
            ]
        },

        /* --------------------------------------------------------------------------------------------------------
         * Misc Settings - These values are not saved or loaded. Only needed for temporary or description purpose.
         * ------------------------------------------------------------------------------------------------------- */
        miscSettings: {
            downloadJsonData: "",
            downloadJsonVisible: false,

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

            // System wide strings... usually required for Reviews.
            exoFactorsName: ["Medical Emergency", "Weather"],

            // Other Constants... maybe moved to env? or some variable holding constants.
            AIDATypeStr: ["Equal Operator", "Assisting Individual", "Assisting Team Coordination"],
            comms: { "N" : "None", "S": "Some", "F": "Full"},
        }
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
            var exoFTName = this.miscSettings.exoFactorsName;
            var exoRv = "None";

            //console.log("exoFactorsName", exoFT, exoFTName);
            if (exoFT[0] || exoFT[1]) {
                if (exoFT[0]) exoRv = exoFTName[0];
                if (exoFT[0] && exoFT[1]) exoRv += ", " + exoFTName[1];
                else if (exoFT[1]) exoRv = exoFTName[1];
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
                ft.push([]);
                for(var j=0; j < this.taskSettings.tasks.length;j++) {
                    if (this.taskSettings.tasks[i].include) {
                        ft[i].push(this.operatorSettings.teams[i].failThresh[0][j] / 100);
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
                        ait += this.miscSettings.AIDATypeStr[j];
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
                if (this.operatorSettings.teams[i].AIDA.ETServiceTime) {
                    st.push(this.operatorSettings.teams[i].AIDA.ETServiceTime / 100);
                } else
                    st.push(0); // whether it's not defined or 0
            }
            return st;
        },
        //array contining Error Rate
        ETErrorRate() {
            var er = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].AIDA.ETErrorRate) {
                    er.push(this.operatorSettings.teams[i].AIDA.ETErrorRate / 100);
                } else
                    er.push(0);
            }
            return er;
        },
        //array for fail threshold
        ETFailThreshold() {
            var ft = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].AIDA.ETFailThreshold) {
                    ft.push(this.operatorSettings.teams[i].AIDA.ETFailThreshold / 100);
                } else
                    ft.push(0);
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
        // array with fleet names
        fleetNames() {
            var fleetNames = [];
            for (i = 0; i < this.fleetSettings.fleets.length; i++) {
                if (this.fleetSettings.fleets[i].name) {
                    fleetNames.push(this.fleetSettings.fleets[i].name);
                } else
                    fleetNames.push("Fleet no name");
            }
            return fleetNames;
        },

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
        },

        fleetTasksForReview() {
            var tasks = [];
            for (i = 0; i < this.fleetSettings.fleets.length; i++) {
                var k = this.fleetSettings.fleets[i].tasks.length;
                if (k) {
                    tasks.push([]);
                    for (j = 0; j < k; j++) {
                        tasks[i].push(this.taskSettings.tasks[this.fleetSettings.fleets[i].tasks[j]].name);
                    }
                } else
                    tasks.push(["None"]);
            }
            return tasks;
        },

        // array of traffic levels per hour of 0=no traffic, 0.5=low, 1=medium or 2 = high per each fleet
        traffic() {
            var traff = [];

            for(var f=0;f<this.fleetSettings.fleets.length;f++) {
                var traffOrig = this.fleetSettings.fleets[f].trafficLevels;
                var noDiff = this.fleetSettings.fleets[f].diffTrafficLevels === 'n';
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
                expireDistribution: ["N"],
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

        // return fleet names for review associated with a task
        fleetNamesOpExpertise(team, taskIndex) {
            var fleetNames = [];
            for(var j=0;j<this.fleetSettings.fleets.length;j++) {
                var fleet = this.fleetSettings.fleets[j];
                if (team.expertise[taskIndex][j] && fleet.tasks.includes(taskIndex)) {
                    fleetNames.push(fleet.name);
                }
            }
            if (fleetNames.length) {
                return fleetNames.join(", ");
            } else
                return "None";
        },

        // check wheteher the task is selected in the opExpertise matrix
        checkIfTaskSelected(team, taskIndex) {
            for (var i=0; i<this.fleetSettings.fleets.length;i++) {
                var fleet = this.fleetSettings.fleets[i];
                if (team.expertise[taskIndex][i] && fleet.tasks.includes(taskIndex))
                    return true;
            }
            return false;
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
                    setTimeout(function() {NProgress.done(); sim.miscSettings.isLoading = false; }, 1000);
                } else {
                    //alert("No previous setting is found.");
                }
            } else {
                //alert("No previous setting is found.")
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
                            this.miscSettings.warningMessage = "Minumum should be smaller than maximum.";
                            return false;
                        }
                        break;
                    case 'T':
                        if (params[i][0] > params[i][1] || params[i][0] > params[i][2] || params[i][1] > params[i][2]) {
                            this.miscSettings.warningMessage = "Minimum < Mode < Maximum";
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

        // add error or warning to the review settings
        // error - 0(info), 1(warning), 2(error)
        addReviewError(msg, tabId, errorLevel) {
            var eLevel = errorLevel || 0;
            const errorClass = ["info", "warning", "danger"];

            var warningNode = document.getElementById('warnings');

            var newNode = document.createElement('div');
            newNode.className = 'alert alert-' + errorClass[eLevel];
            newNode.innerHTML = msg + " <a href='javacrpt:void(0)' data-id='" + tabId + "'>Edit</a>";
            warningNode.appendChild(newNode);
        },

        // check current user input
        checkInputData() {
            var count = [0,0];

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

            // check task params
            for(var i=0;i<this.taskSettings.tasks.length;i++) {
                var task = this.taskSettings.tasks[i];
                if (task.include) {
                    if (!this.checkDistribution(task.arrivalDistribution, task.arrivalParam, 1)) {
                        this.addReviewError("Fix the task, " + task.name + " interarrival time parameters. " + this.miscSettings.warningMessage, "tasks-" + i + "-settings-tab", 2);
                        count[1]++;
                    }

                    if (!this.checkDistribution(task.serviceDistribution, task.serviceParam, 1)) {
                        this.addReviewError("Fix the task, " + task.name + " service time parameters. " + this.miscSettings.warningMessage, "tasks-" + i + "-settings-tab-tab", 2);
                        count[1]++;
                    }

                    if (!this.checkDistribution(task.expireDistribution, task.expireParam, 1)) {
                        this.addReviewError("Fix the task, " + task.name + " expiration time parameters. " + this.miscSettings.warningMessage, "tasks-" + i + "-settings-tab", 2);
                        count[1]++;
                    }

                    if (!this.checkDistribution(['T'], task.humanErrorProb, 1)) {
                        this.addReviewError("Fix the task, " + task.name + " human error probability parameters. " + this.miscSettings.warningMessage, "tasks-" + i + "-settings-tab", 2);
                        count[1]++;
                    }
                }
            }

            // check fleet params
            // Any task is selected for each fleet? warning
            if (this.fleetSettings.fleetTypes !== this.fleetSettings.fleets.length) {
                this.addReviewError("Check the number of fleets settings.", "fleets-global-settings-tab");
                count[0]++;
            }
            for(var i=0;i<this.fleetSettings.fleetTypes;i++) {
                var fleet = this.fleetSettings.fleets[i];

                if (fleet.tasks.length < 1) {
                    this.addReviewError("At least one task needs to be selected for the fleet, " + fleet.name + ".", "fleet-" + i + "-settings-tab");
                    count[0]++;
                }
            }

            // check opteam params
            for(var i=0;i<this.operatorSettings.numTeams;i++) {
                var opteam = this.operatorSettings.teams[i];

                // at least one expertise is selected, warning
                if (!this.checkExpertise(opteam)) {
                    this.addReviewError("At least one active tasks/fleets combo needs to be checked for the operator team " + opteam.name + ".", "opteam-" + i + "-settings-tab");
                    count[0]++;
                }
                // at least one tasks for aida assisting individuals is selected, warning
                if (opteam.AIDA.AIDAType[1] && opteam.AIDA.IATasks.length < 1) {
                    this.addReviewError("At least one task needs to be associated with AIDA assisting individuals for the operator team, " + opteam.name + ".", "opteam-" + i + "-settings-tab");
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

                    alert("There are some warnings, please check the review settings page!");
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
                "opTasks": sim.opTasks,
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
                "fleetTypes": sim.fleetSettings.fleetTypes,
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
            document.getElementById("downloadBtn").style.display = "none";

            //Download Json
            this.miscSettings.downloadJsonVisible = true;
            this.miscSettings.downloadJsonData = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(out));

            axios.post(env.serverUrl + "/shado/testpost", JSON.stringify(out), {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                }
            }).then((msg) => {
                console.log("response success received");
                this.miscSettings.sessionId = msg.data.substr(msg.data.lastIndexOf(":") + 2);
                this.miscSettings.sessionQuery = "?sessionN=" + this.miscSettings.sessionId;
                console.log(this.miscSettings.sessionId, this.miscSettings.sessionQuery);
                alert("Simulation complete. View the results.");

                // Show download button
                document.getElementById("downloadBtn").style.display = "block";

                BoxPlot.visualize(env.serverUrl + "/shado/getUtilizationJSON" + this.miscSettings.sessionQuery,
                                  "#boxSVG", "1");

                // pieChart only works when it is visible
                FailedTaskAnalysis.analyze(env.serverUrl + "/shado/getTaskJSON" + this.miscSettings.sessionQuery,
                                           "pieChart", "#taskRecordTable");

                this.miscSettings.viewResultsClass = "";
                this.$nextTick( function() {
                    this.$refs.viewResultsTab.click();
                });

                FailedTaskAnalysis.refreshPie();
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
            if (0 === obj.name.length || !obj.name.trim()) {
                obj.name = this.miscSettings.inputString;
                alert(text + "name should contain at least 1 characters. It reverts to " + obj.name + ".");
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

        this.loadData();
    }
});

$(document).ready(function () {
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

    // When review settings tab is clicked, redraw fleetSettings
    $('#review-settings-tab').click( function(e) {
        for(var i=0;i<sim.fleetSettings.fleetTypes;i++) {
            TrafficLevelBarChart.drawTrafficLevelBarChart("#trafficLevel" + i,
                                                          sim.fleetSettings.fleets[i].trafficLevels,
                                                          sim.fleetSettings.fleets[i].diffTrafficLevels === 'y');
        }

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
    $("#settings-nav a").click( function(e) {
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
});
