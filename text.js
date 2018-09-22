var textStrings = {
    General : {
        // Basic Settings
        //basic: "Basic Settings",
        questionHours: "1. How many hours are in this shift?",
        tooltipHours: "This is an example tooltip",
        questionTransition: "2. Check if there is a transitioning period at the beginning or ending of this shift.",
        optionTransition: [ "Beginning of shift", "Ending of shift" ],
        questionTransitionDuration: [
            "How long does the beginning of shift transition last?",
            "How long does the ending of shift transition last?",
        ],
        questionExtremeCondition: "3. Are there any extreme conditions?",
        optionExtremeCondition: [ "Medical Emergency", "Weather"],

        // Tasks
        tasks: "Task",
        qWeather: "2. Is the dispatcher's work on this task influenced by weather conditions?",
        qTraffic: "3. Is the dispatcher's work on this task influenced by hourly traffic levels of railroad(s)?",
        qTeamCoordination: "4. Do dispatchers need to coordinate with other dispatchers here to complete this task?",
        qEssential: "5. Must a dispatcher prioritize this task over other tasks?",
        qInterruptable: "Is it OK for a dispatcher to be interrupted while working on this task?",
        tooltipInterruptable: "Yes means the dispatcher can put this task on hold to complete other tasks and return to this one later.",


        // Fleets
        fleet: "Fleet",         // singular for fleet
        fleets: "Fleets",       // for fleets menu
        fleetSettings: "Fleet Settings",
        vehicle: "Vehicle",
        qFleets: "How many different fleets do the operators manage?",
        qNumVeh: "How many vehicles are in this fleet?",

        // Operator Teams
        operator: "Operator",
        operators: "Operators", // for operators menu
        operatorList: "Operator List",
        operatorSettings: "Operator Settings",

        AIDATypeStr: ["Equal Operator", "Assisting Individual", "Assisting Team Coordination"],

        // Reviews

        // Results

        // Misc
        mainMenu: [ "Shift", "Tasks", "Fleets", "Operators", "Review Settings" ],
        previousTab: "",
        nextTab: "Tasks",
    },
    Aviation: {

    },
    Rail: {
        // basic settings
        questionHours: "1. How many hours are your train dispatchers working this shift?",
        questionTransition: "2. If your dispatchers have transfer-of-duty periods, when do they occur?",
        questionTransitionDuration: [
            "At the beginning of their shifts, how long does this transfer-of-duty last?",
            "At the ending of their shifts, how long does this transfer-of-duty last?",
        ],
        questionExtremeCondition: "3. Will there be any extreme conditions during this shift?",
        optionExtremeCondition: [ "Derailment", "Poor Weather"],

        // Tasks
        tasks: "Task",
        qWeather: "2. Is this task affected by weather?",
        qTraffic: "3. Is this task affected by traffic?",
        qTeamCoordination: "4. Is this task affected by team coordination?",
        qEssential: "5. Is this task essential?",
        qInterruptable: "Is this task interruptable?",

        // Fleets
        fleet: "Railroad",
        fleets: "Railroads",       // for fleets menu
        fleetSettings: "Railroad Settings",
        vehicle: "Subdivision",
        qFleets: "How many different railroads do the dispatchers manage?",
        qNumVeh: "How many subdivisions are on this railroad?",

        // Operator Teams
        operator: "Dispatcher",
        operators: "Dispatchers", // for operators menu
        operatorList: "Dispatcher List",
        operatorSettings: "Dispatcher Settings",


        // Reviews

        // Results

        // Misc
        mainMenu: [ "Shift", "Tasks", "Railroads", "Dispatchers", "Review Settings" ],
        previousTab: "",
        nextTab: "Tasks",
    }
};

// Customize settings for human error probability
// If you remove an option, please change the default 3 json files respectivley.
// Please don't remove "0" option.
var humanErrorProbConfig = {
    "0" : {
        value: [0.000006, 0.00002, 0.0009],
        text: "Well-designed, human-centered automation."
    },
    "1" : {
        value: [0.00008, 0.0004, 0.007],
        text: "Straightforward, completely familiar, highly practiced, routine."
    },
    "2" : {
        value: [0.00008, 0.0004, 0.007],
        text: "Straightforward, requiring simple response to a dedicated alarm, covered in procedures."
    },
    "3" : {
        value: [0.002, 0.003, 0.004],
        text: "Manual, visual or communication with opportunity for confusion between data."
    },
    "4" : {
        value: [0.06, 0.09, 0.13],
        text: "Simple but quickly performed with reduced attention or accuracy."
    },
    "5" : {
        value: [0.0008, 0.003, 0.007],
        text: "Not automated nor routine; procedures must be followed to restore or shift system state."
    },
    "6" : {
        value: [0.02, 0.07, 0.17],
        text: "Requiring rules to identify situation and interpret alarm or indication patterns."
    },
    "7" : {
        value: [0.12, 0.16, 0.28],
        text: "Complex, requiring a high level of understanding and skill."
    },
    "8" : {
        value: [0.0001, 0.0001, 0.0001],
        text: "Other, with no decision support."
    },
    "9" : {
        value: [0.00001, 0.00001, 0.00001],
        text: "Other, with decision support."
    },
};
