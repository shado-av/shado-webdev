var textStrings = {
    General : {
        // Basic Settings
        //basic: "Basic Settings",
        questionHours: "1. How many hours are in this shift?",        
        questionTransition: "2. Check if there is a transitioning period at the beginning or ending of this shift.",
	tooltipTransition: "Transitioning period is the period where the incoming and outgoing operators discuss relevant issues from the prior shift.",
        optionTransition: [ "Beginning of shift", "Ending of shift" ],
        questionTransitionDuration: [
            "How long does the beginning of shift transition last?",
            "How long does the ending of shift transition last?",
        ],
        questionExtremeCondition: "3. Are there any extreme conditions?",
	tooltipExtremeCondition: "Abnormal issues that would increase dispatcher workload.",
        optionExtremeCondition: [ "Medical Emergency", "Weather"],
	//tooltipCondition0: "Essential task that lasts 20 to 40 minutes, arrives once every 8 hours of a shift on average.",
	//tooltipCondition1: "All tasks affected by weather will arrive 10% more frequently.",


        // Tasks
        tasks: "Task",
        qWeather: "2. Is the dispatcher's work on this task influenced by weather conditions?",
	//tooltipTaskWeather: "",
        qTraffic: "3. Is the dispatcher's work on this task influenced by hourly traffic levels of railroad(s)?",
	//tooltipTaskTraffic: "",
        qTeamCoordination: "4. Do dispatchers need to coordinate with other dispatchers here to complete this task?",
        //tooltipTaskCoord: "",
	qEssential: "5. Must a dispatcher prioritize this task over other tasks?",
        qInterruptible: "Is it OK for a dispatcher to be interrupted while working on this task?",
        tooltipInterruptible: "Yes means the dispatcher can put this task on hold to complete other tasks and return to this one later.",


        // Fleets
        fleet: "Fleet",         // singular for fleet
        fleets: "Fleets",       // for fleets menu
        fleetSettings: "Fleet Settings",
        vehicle: "Vehicle",
        qFleets: "How many different fleets do the operators manage?",
        qNumVeh: "How many vehicles are in this fleet?",
		otherSources: "Other Sources",

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
	tooltipTransition: "Transitioning period is the period where the incoming and outgoing operators discuss relevant issues from the prior shift.",
        tooltipExtremeCondition: "Abnormal issues that would increase dispatcher workload.",
	//tooltipCondition0: "Essential task that lasts 20 to 40 minutes, arrives once every 8 hours of a shift on average.",
	//tooltipCondition1: "All tasks affected by weather will arrive 10% more frequently.",


    },
    Rail: {
        // basic settings
        questionHours: "1. How many hours are your train dispatchers working this shift?",
        questionTransition: "2. If your dispatchers have transfer-of-duty periods, when do they occur?",
	tooltipTransition: "Transitioning period is the period where the incoming and outgoing operators discuss relevant issues from the prior shift.",
        questionTransitionDuration: [
            "At the beginning of their shifts, how long does this transfer-of-duty last?",
            "At the ending of their shifts, how long does this transfer-of-duty last?",
        ],
        questionExtremeCondition: "3. Will there be any extreme conditions during this shift?",
	tooltipExtremeCondition: "Abnormal issues that would increase dispatcher workload.",
        optionExtremeCondition: [ "Derailment", "Poor Weather"],
	tooltipCondition0: "Essential task that lasts 20 to 40 minutes, arrives once every 8 hours of a shift on average.",
	tooltipCondition1: "All tasks affected by weather will arrive 10% more frequently.",

        // Tasks
        tasks: "Task",
        qWeather: "2. Is this task affected by weather?",
	tooltipTaskWeather: "Yes means the task will arrive 10% more frequently.",
        qTraffic: "3. Is this task affected by traffic?",
	tooltipTaskTraffic: "Yes means the arrival rate of this task will be affected by traffic levels.",
        qTeamCoordination: "4. Is this task affected by team coordination?",
	tooltipTaskCoord: "Yes means the task is affected by level of team communication",
        qEssential: "5. Is this task essential?",
        qInterruptible: "Is this task interruptible?",
	tooltipTaskFreq: "This determines arrival time, or the time at which the task enters the system.",
	tooltipTaskWait: "This determines expiration time, the time at which a task will expire or the time by which it must exit the system.",
	tooltipTaskComplete: "This determines service time, the total time required for an operator to process the task.",
	tooltipTaskFollowTime: "This determines the dependent inter-arrival time",
	tooltipTaskFollow: "'Add Following Task' creates a new task with an arrival rate that is dependent on this original task’s arrival.",

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
