var i;

var sim = new Vue({
   
    data: {
        globalSettings: {
            simType: "railroad",
            numHours: 8,
            diffTrafficLevels: "n",
            trafficLevels: ["m", "m", "m", "m", "m", "m", "m", "m"]
        },
        taskSettings: {
            numPhases: 2,
            tasks: []
        },
        operatorSettings: {
            numTeams: 1,
            teams: []
        },
        fleetSettings: {
            numFleets: 1,
            fleets: []
        },
        numReps: 1
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
        }
    }
    
    
})

sim.$mount("#shado-sim");