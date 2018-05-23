var i;

var sim = new Vue({
   
    data: {

        numReps: 1, // number of replications (1 - 1000)

        /* ------------------------------
         * GLOBAL/BASIC SETTINGS
         * ------------------------------ */

        globalSettings: {
            simType: "railroad", // simulation type (aviation, railroad, ground)
            numHours: 8, // number of hours in shift (1 - 12)
            diffTrafficLevels: "n", 
            trafficLevels: ["m", "m", "m", "m", "m", "m", "m", "m"], // traffic levels l (low), m (medium), h (high)
            exoFactors: "n",
            exoFactorsType: 1
        },

        /* ------------------------------
         * TASKS SETTINGS
         * ------------------------------ */

        taskSettings: {
            numPhases: 2, // number of phases
            tasks: // array of individual task objects
            [
                {
                    name: "Communicating",
                    include: false,
                    isCustom: false,
                    priority: [4, 7],
                    arrivalDistribution: "E",
                    arrivalParam: [0.033333,0.1],
                    serviceDistribution: "U",
                    serviceParam: [0.5,2],
                    expireDistribution: "E",
                    expireParamDefault: [0,0.184],
                    expireParamExo: [0,0.184],
                    affectedByTraffic: "y",
                    affectByIROPS: [0,1],
                    humanErrorProb: [0.0004,0.00008,0.007]
                },
                {
                    name: "Actuation",
                    include: false,
                    isCustom: false,
                    priority: [5,5],
                    arrivalDistribution: "E",
                    arrivalParam: [0.033333,0.1],
                    serviceDistribution: "U",
                    serviceParam: [0.5,2],
                    expireDistribution: "E",
                    expireParamDefault: [0,0.184],
                    expireParamExo: [0,0.184],
                    affectedByTraffic: "y",
                    affectByIROPS: [0,1],
                    humanErrorProb:[0.0004,0.00008,0.007]
                },
                {
                    name: "Directive Mandatory",
                    include: false,
                    isCustom: false,
                    priority: [5,5],
                    arrivalDistribution: "E",
                    arrivalParam: [0.033333,0.1],
                    serviceDistribution: "U",
                    serviceParam: [0.5,2],
                    expireDistribution: "E",
                    expireParamDefault: [0,0.184],
                    expireParamExo: [0,0.184],
                    affectedByTraffic: "y",
                    affectByIROPS: [0,1],
                    humanErrorProb: [0.0004,0.00008,0.007]
                }
            ]
        },

        /* ------------------------------
         * OPERATOR SETTINGS
         * ------------------------------ */

        operatorSettings: {
            numTeams: 2, // number of teams (2 - 5)
            teams: // array of individual team objects
            [
                {
                    name: "Operator Team",
                    size: 1,
                    strategy: "FIFO",
                    comms: "N",
                    tasks: [],
                    AIDA: {
                        equalOperator: false,
                        assistingIndividuals: "N",
                        assistingTeamCoord: "N"  
                    },
                    failTresh: 50
                },
                {
                    name: "Operator Team",
                    size: 1,
                    strategy: "FIFO",
                    comms: "N",
                    tasks: [],
                    AIDA: {
                        equalOperator: false,
                        assistingIndividuals: "N",
                        assistingTeamCoord: "N"  
                    },
                    failThresh: 50
                } 
            ]
        },

        /* ------------------------------
         * COMPUTED VALUES
         * ------------------------------ */

        fleetSettings: {
            fleetTypes: 1, // number of fleets (2 - 5)
            fleets: 
            [
                {
                    name: "Fleet",
                    numVehicles: 1,
                    comms: "N",
                    tasks: []
                } 
            ]
        }
    },
    
    computed: {

        /* ------------------------------
         * GLOBAL SETTINGS COMPUTED VALUES
         * ------------------------------ */

        // array of traffic levels per hour of 0, 0.5, or 1
        traffic () {
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
        hasExogenous () {
            if (this.globalSettings.exoFactors === "y") {
                return [1, parseInt(this.globalSettings.exoFactorsType, 10)];
            }
            return [0, 0];
        },

        /* ------------------------------
         * TASK SETTINGS COMPUTED VALUES
         * ------------------------------ */

        // true if 15 tasks
        maxTasksReached () {
            return this.numTaskTypes >= 15;
        },

        // number of tasks
        numTaskTypes () {
            var num = 0;
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].include) {
                    num++;
                }
            }
            return num;
        },

        // array containing task names
        taskNames () {
            var names = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].name && this.taskSettings.tasks[i].include) {
                    names.push(this.taskSettings.tasks[i].name);
                }
            }
            return names;
        },

        // array containing all task arrival time distributions
        arrDists () {
            var dists = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].arrivalDistribution && this.taskSettings.tasks[i].include) {
                    dists.push(this.taskSettings.tasks[i].arrivalDistribution);
                }
            }
            return dists;
        },

        // array containing all task arrival time parameters
        arrPms () {
            var params = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].arrivalParam && this.taskSettings.tasks[i].include) {
                    params.push(this.taskSettings.tasks[i].arrivalParam);
                }
            }
            return params;
        },

        // array containing all task service time distributions
        serDists () {
            var dists = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].serviceDistribution && this.taskSettings.tasks[i].include) {
                    dists.push(this.taskSettings.tasks[i].serviceDistribution);
                }
            }
            return dists;
        },

        // array containing all task service time parameters
        serPms () {
            var params = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].serviceParam && this.taskSettings.tasks[i].include) {
                    params.push(this.taskSettings.tasks[i].serviceParam);
                }
            }
            return params;
        },

        // array containing all task expiration time distributions
        expDists () {
            var dists = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].expireDistribution && this.taskSettings.tasks[i].include) {
                    dists.push(this.taskSettings.tasks[i].expireDistribution);
                }
            }
            return dists;
        },

        // array containing all task expiration time parameters
        expPmsHi () {
            var params = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].expireParamDefault && this.taskSettings.tasks[i].include) {
                    params.push(this.taskSettings.tasks[i].expireParamDefault);
                }
            }
            return params;
        },

        // array containing all tasks affected by traffic
        affByTraff () {
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
        humanError () {
            var probs = [];
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].humanErrorProb && this.taskSettings.tasks[i].include) {
                    probs.push(this.taskSettings.tasks[i].humanErrorProb);
                }
            }
            return probs;
        },

        /* ------------------------------
         * OPERATOR SETTINGS COMPUTED VALUES
         * ------------------------------ */

        // sum of all operator team sizes
        numRemoteOp () {
            var sum = 0;
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].size) {
                    sum += this.operatorSettings.teams[i].size;
                }
            }
            return sum;
        },
        
        // array containing operator team names
        opNames () {
            var names = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].name) {
                    names.push(this.operatorSettings.teams[i].name);
                }
            }
            return names;
        },

        // array containing operator team sizes
        teamSize () {
            var sizes = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].size) {
                    sizes.push(this.operatorSettings.teams[i].size);
                }
            }
            return sizes;
        },

        // array containing operator team tasks arrays
        opTasks () {
            var tasks = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].tasks) {
                    tasks.push(this.operatorSettings.teams[i].tasks);
                }
            }
            return tasks;
        },
        
        // array containing operator team communication types
        teamComm () {
            var comms = [];
            for (i = 0; i < this.operatorSettings.teams.length; i++) {
                if (this.operatorSettings.teams[i].comms) {
                    comms.push(this.operatorSettings.teams[i].comms);
                }
            }
            return comms;
        },

        /* ------------------------------
         * FLEET SETTINGS COMPUTED VALUES
         * ------------------------------ */

        // array with number of vehicles per fleet
        numVehicles () {
            var vehicles = [];
            for (i = 0; i < this.fleetSettings.fleets.length; i++) {
                if (this.fleetSettings.fleets[i].numVehicles) {
                    vehicles.push(this.fleetSettings.fleets[i].numVehicles);
                }
            }
            return vehicles;
        },

        // array containing fleet tasks arrays
        fleetHetero () {
            var tasks = [];
            for (i = 0; i < this.fleetSettings.fleets.length; i++) {
                if (this.fleetSettings.fleets[i].tasks) {
                    tasks.push(this.fleetSettings.fleets[i].tasks);
                }
            }
            return tasks;
        }
           
    },
    
    methods: {
        
        updateTrafficLvls () {
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
        
        disableAddTask (task) {
            if (task.include || !this.maxTasksReached) {
                return false;
            } 
            return true;
        },
        
        addCustomTask () {
            this.taskSettings.tasks.push({
                name: "Custom Task",
                include: true,
                isCustom: true,
                priority: [],
                arrivalDistribution: "E",
                arrivalParam: [],
                serviceDistribution: "E",
                serviceParam: [],
                expireDistribution: "E",
                expireParamDefault: [],
                expireParamExo: [],
                affectedByTraffic: "n",
                affectByIROPS: [],
                humanErrorProb: []
            })
        },
        
        removeCustomTask (task) {
            if (confirm("Are you sure you want to delete this custom task?")) {
                this.taskSettings.tasks.splice(this.taskSettings.tasks.indexOf(task), 1); 
            }
        },
        
        isAffectedByTrafficPhases (task) {
            return task.affectedByTraffic === "y" && this.taskSettings.numPhases > 1;
        },
        
        updateOperatorTeams () {
            var teams = this.operatorSettings.teams;
            if (this.operatorSettings.numTeams > teams.length) {
                while (teams.length < this.operatorSettings.numTeams) {
                    teams.push({
                        name: "Operator Team",
                        size: 1,
                        strategy: "FIFO",
                        comms: "N",
                        tasks: [],
                        AIDA: {
                            equalOperator: false,
                            assistingIndividuals: "N",
                            assistingTeamCoord: "N"  
                        },
                        failTresh: 50
                    })
                }
            } else {
                teams.splice(this.operatorSettings.numTeams);
            }
        },
        
        removeOperatorTeam (team) {
            if (confirm("Are you sure you want to delete this operator team?")) {
                this.operatorSettings.teams.splice(this.operatorSettings.teams.indexOf(team), 1); 
            }
            this.operatorSettings.numTeams = this.operatorSettings.teams.length;
        },
        
        updateFleets () {
            var fleets = this.fleetSettings.fleets;
            if (this.fleetSettings.numFleets > fleets.length) {
                while (fleets.length < this.fleetSettings.numFleets) {
                    fleets.push({
                        name: "Fleet",
                        numVehicles: 1,
                        comms: "N",
                        tasks: []
                    })
                }
            } else {
                fleets.splice(this.fleetSettings.numFleets);
            }
            
        },
        
        removeFleet (fleet) {
            if (confirm("Are you sure you want to delete this fleet?")) {
                this.fleetSettings.fleets.splice(this.fleetSettings.fleets.indexOf(fleet), 1); 
            }
            this.fleetSettings.numFleets = this.fleetSettings.fleets.length;
            
        }
    }
    
    
})

sim.$mount("#shado-sim");