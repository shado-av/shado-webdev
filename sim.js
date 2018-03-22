var i;

var sim = new Vue({
   
    data: {
        globalSettings: {
            simType: "railroad",
            numHours: 8,
            diffTrafficLevels: "n",
            trafficLevels: ["m", "m", "m", "m", "m", "m", "m", "m"],
            exoFactors: "n",
            exoFactorsType: 1
        },
        taskSettings: {
            numPhases: 2,
            tasks: 
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
        operatorSettings: {
            numTeams: 2,
            teams: 
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
                    failTresh: 50
                } 
            ]
        },
        fleetSettings: {
            numFleets: 1,
            fleets: 
            [
                {
                    name: "Fleet",
                    numVehicles: 1,
                    comms: "N",
                    tasks: []
                } 
            ]
        },
        numReps: 1
    },
    
    computed: {
        
        maxTasksReached () {
            return this.getNumIncludedTasks() >= 15;
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
        
        getNumIncludedTasks () {
            var included = 0;
            for (i = 0; i < this.taskSettings.tasks.length; i++) {
                if (this.taskSettings.tasks[i].include) {
                    included++;
                }
            }
            return included;
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