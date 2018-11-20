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
	tooltipCondition1: "All tasks affected by weather will arrive 10% more frequently.",


        // Tasks
        tasks: "Task",
	tooltipTask: "Tasks given to the operator(s) during their shift(s).",
        qWeather: "2. Is the dispatcher's work on this task influenced by weather conditions?",
	tooltipTaskWeather: "Yes means the task will arrive 10% more frequently.",
        qTraffic: "3. Is the dispatcher's work on this task influenced by hourly traffic levels of railroad(s)?",
	tooltipTaskTraffic: "Yes means the arrival rate of this task will be affected by traffic levels.",
        qTeamCoordination: "4. Do dispatchers need to coordinate with other dispatchers here to complete this task?",
        tooltipTaskCoord: "Yes means the task is affected by level of team communication",
	qEssential: "5. Must a dispatcher prioritize this task over other tasks?",
        qInterruptible: "Is it OK for a dispatcher to be interrupted while working on this task?",
        tooltipInterruptible: "Yes means the dispatcher can put this task on hold to complete other tasks and return to this one later.",
	tooltipTaskFreq: "This determines arrival time, or the time at which the task enters the system.",
	tooltipTaskWait: "This determines expiration time, the time at which a task will expire or the time by which it must exit the system.",
	tooltipTaskComplete: "This determines service time, the total time required for an operator to process the task.",
	tooltipTaskFollowTime: "This determines the dependent inter-arrival time",
	tooltipTaskFollow: "'Add Following Task' creates a new task with an arrival rate that is dependent on this original task’s arrival.",


        // Fleets
        fleet: "Fleet",         // singular for fleet
        fleets: "Fleets",       // for fleets menu
        fleetSettings: "Fleet Settings",
        vehicle: "Vehicle",
        qFleets: "How many different fleets do the operators manage?",
        qNumVeh: "How many vehicles are in this fleet?",
	otherSources: "Other Sources",
	tooltipFleetComm: "Vehicle-to-vehicle Communications: A vehicle with some level of local communications demands less from a dispatcher. Some: reduces rate of task arrivals by 30%. Full: reduces rate of task arrivals by 70%.",
	tooltipFleetTask: "These tasks arrive from the vehicle.",
	tooltipFleetTraffic: "Traffic levels affect the arrival rate of certain tasks. Low: tasks arrive half as often. Medium: tasks arrive as normal. High: Tasks arrive twice as often.",
	tooltipFleetOther: "Tasks from other sources do not arrive from the vehicles. E.g. Miscellaneous (Dispatcher break time)",
	tooltipFleetOtherTraffic: "Traffic levels affect the arrival rate of certain tasks. Low: tasks arrive half as often. Medium: tasks arrive as normal. High: Tasks arrive twice as often.",

        // Operator Teams
        operator: "Operator",
        operators: "Operators", // for operators menu
        operatorList: "Operator List",
        operatorSettings: "Operator Settings",

        AIDATypeStr: ["Equal Operator", "Assisting Individual", "Assisting Team Coordination"],
	    
	tooltipOperatorFlex: "Flex team assists all types of operators whenever their workload is above 70%.",
	tooltipOperatorFlexNum: "How many of these chief operators are on duty this shift?",
	tooltipOperatorTeam: "Does the operator share the same desk with other operators?",
	tooltipOperatorSize: "How many operators are on the team?",
	tooltipOperatorComm: "Partial: Communicate with team once every 10 minutes, lasting an average of 10 seconds; 30% more likely to catch a human error. Full: Communicate with team once every 5 minutes, lasting an average of 10 seconds ; 70% more likely to catch a human error.",
	tooltipOperatorTask: "What task types for which vehicles/sources are these operators expected to execute?",
	tooltipOperatorStrat: "Which strategy does the operator employ to handle tasks? First In First Out: In chronological order of arrival. Shortest Task First: In order from lowest service time. Priority: Based on order of importance.",
	tooltipOperatorPriority: "Essential tasks: highest priority, rise to the top of the queue, can interrupt any interruptible task that an operator is busy with, cannot be interrupted.",
	tooltipOperatorError: "Error: a task completed incorrectly.",
	tooltipOperatorAI: "Three types of artificial intelligence (AI) agents: Equal Operator, Assisting Individual, Assisting Team Coordination (must have some level of team communication).",
	tooltipOperatorAIequal: "AI that can handle any task that the operator handles. Employed when the human operators are unavailable, and a task arrives.",
	tooltipOperatorAIindiv: "AI that directly supports operators by reducing human error probability as well as how long it takes them to complete selected tasks.",
	tooltipOperatorAIindivLevel: "Level determines human performance speed. Partial: Human performance is 1.4 times faster. Service time decreases by 30% on each task that the AI assists. High: Human performance is 3.3 times faster. Service time decreases by 70% on each task that the AI assists.",
	tooltipOperatorAIteam: "AI that is available when there is some level of team coordination (more than one operator in a team during the same shift).",
	tooltipOperatorAIteamLevel: "Level determines team communication speed. Partial: Team communication is 1.4 times faster, reduces team communication time by 30%. High: Team communication is 3.3 times faster, reduces team communication time by 70%.",

        // Reviews
	//tooltipRunWarnings: "Run simulation with warnings. Results may not be as accurate. Fix blue warnings above to run simulation without warnings.",

        // Results

        // Misc
        mainMenu: [ "Shift", "Tasks", "Fleets", "Operators", "Review Settings" ],
        previousTab: "",
        nextTab: "Tasks",
    },
    Aviation: {
	//Basic Settings
	tooltipTransition: "Transitioning period is the period where the incoming and outgoing operators discuss relevant issues from the prior shift.",
        tooltipExtremeCondition: "Abnormal issues that would increase dispatcher workload.",
	//tooltipCondition0: "Essential task that lasts 20 to 40 minutes, arrives once every 8 hours of a shift on average.",
	tooltipCondition1: "All tasks affected by weather will arrive 10% more frequently.",
	
	//Tasks
	tooltipTask: "Tasks given to the operator(s) during their shift(s).",
	tooltipTaskWeather: "Yes means the task will arrive 10% more frequently.",
	tooltipTaskCoord: "Yes means the task is affected by level of team communication",
	tooltipTaskFreq: "This determines arrival time, or the time at which the task enters the system.",
	tooltipTaskWait: "This determines expiration time, the time at which a task will expire or the time by which it must exit the system.",
	tooltipTaskComplete: "This determines service time, the total time required for an operator to process the task.",
	tooltipTaskFollowTime: "This determines the dependent inter-arrival time",
	tooltipTaskFollow: "'Add Following Task' creates a new task with an arrival rate that is dependent on this original task’s arrival.",
	//Fleets
	tooltipFleetComm: "Vehicle-to-vehicle Communications: Aircraft with some level of local communications demands less from a dispatcher. Some: reduces rate of task arrivals by 30%. Full: reduces rate of task arrivals by 70%.",
	tooltipFleetTask: "These tasks arrive from the aircraft.",
	tooltipFleetTraffic: "Traffic levels affect the arrival rate of certain tasks. Low: tasks arrive half as often. Medium: tasks arrive as normal. High: Tasks arrive twice as often.",
	tooltipFleetOther: "Tasks from other sources do not arrive from the aircraft. E.g. Miscellaneous (Dispatcher break time)",
	tooltipFleetOtherTraffic: "Traffic levels affect the arrival rate of certain tasks. Low: tasks arrive half as often. Medium: tasks arrive as normal. High: Tasks arrive twice as often.",
	    
	    
	    
	    
	//Operator Teams
	tooltipOperatorFlex: "Flex team assists all types of dispatchers whenever their workload is above 70%.",
	tooltipOperatorFlexNum: "How many of these chief dispatchers are on duty this shift?",
	tooltipOperatorTeam: "Does the dispatcher share the same desk with other dispatchers?",
	tooltipOperatorSize: "How many dispatchers are on the team?",
	tooltipOperatorComm: "Partial: Communicate with team once every 10 minutes, lasting an average of 10 seconds; 30% more likely to catch a human error. Full: Communicate with team once every 5 minutes, lasting an average of 10 seconds ; 70% more likely to catch a human error.",
	tooltipOperatorTask: "What task types for which aircraft/sources are these dispatchers expected to execute?",
	tooltipOperatorStrat: "Which strategy does the dispatcher employ to handle tasks? First In First Out: In chronological order of arrival. Shortest Task First: In order from lowest service time. Priority: Based on order of importance.",
	tooltipOperatorPriority: "Essential tasks: highest priority, rise to the top of the queue, can interrupt any interruptible task that a dispatcher is busy with, cannot be interrupted.",
	tooltipOperatorError: "Error: a task completed incorrectly.",
	tooltipOperatorAI: "Three types of artificial intelligence (AI) agents: Equal Operator, Assisting Individual, Assisting Team Coordination (must have some level of team communication).",
	tooltipOperatorAIequal: "AI that can handle any task that the dispatcher handles. Employed when the human dispatchers are unavailable, and a task arrives.",
	tooltipOperatorAIindiv: "AI that directly supports dispatchers by reducing human error probability as well as how long it takes them to complete selected tasks.",
	tooltipOperatorAIindivLevel: "Level determines human performance speed. Partial: Human performance is 1.4 times faster. Service time decreases by 30% on each task that the AI assists. High: Human performance is 3.3 times faster. Service time decreases by 70% on each task that the AI assists.",
	tooltipOperatorAIteam: "AI that is available when there is some level of team coordination (more than one dispatcher in a team during the same shift).",
	tooltipOperatorAIteamLevel: "Level determines team communication speed. Partial: Team communication is 1.4 times faster, reduces team communication time by 30%. High: Team communication is 3.3 times faster, reduces team communication time by 70%.",
	
	    
	//Review
	//tooltipRunWarnings: "Run simulation with warnings. Results may not be as accurate. Fix blue warnings above to run simulation without warnings.",
	    
	    

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
	tooltipTask: "Tasks given to the operator(s) during their shift(s).",
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
	tooltipFleetComm: "Subdivision-to-subdivision Radio Communications: A railroad with some level of local communications demands less from a dispatcher. Some: reduces rate of task arrivals by 30%. Full: reduces rate of task arrivals by 70%.",
	tooltipFleetTask: "These tasks arrive from the railroads.",
	tooltipFleetTraffic: "Traffic levels affect the arrival rate of certain tasks. Low: tasks arrive half as often. Medium: tasks arrive as normal. High: Tasks arrive twice as often.",
	tooltipFleetOther: "Tasks from other sources do not arrive from the railroads. E.g. Miscellaneous (Dispatcher break time)",
	tooltipFleetOtherTraffic: "Traffic levels affect the arrival rate of certain tasks. Low: tasks arrive half as often. Medium: tasks arrive as normal. High: Tasks arrive twice as often.",

        // Operator Teams
        operator: "Dispatcher",
        operators: "Dispatchers", // for operators menu
        operatorList: "Dispatcher List",
        operatorSettings: "Dispatcher Settings",
	tooltipOperatorFlex: "Flex team assists all types of dispatchers whenever their workload is above 70%.",
	tooltipOperatorFlexNum: "How many of these chief dispatchers are on duty this shift?",
	tooltipOperatorTeam: "Does the dispatcher share the same desk with other dispatchers?",
	tooltipOperatorSize: "How many dispatchers are on the team?",
	tooltipOperatorComm: "Partial: Communicate with team once every 10 minutes, lasting an average of 10 seconds; 30% more likely to catch a human error. Full: Communicate with team once every 5 minutes, lasting an average of 10 seconds ; 70% more likely to catch a human error.",
	tooltipOperatorTask: "What task types for which railroads/sources are these dispatchers expected to execute?",
	tooltipOperatorStrat: "Which strategy does the dispatcher employ to handle tasks? First In First Out: In chronological order of arrival. Shortest Task First: In order from lowest service time. Priority: Based on order of importance.",
	tooltipOperatorPriority: "Essential tasks: highest priority, rise to the top of the queue, can interrupt any interruptible task that a dispatcher is busy with, cannot be interrupted.",
	tooltipOperatorError: "Error: a task completed incorrectly.",
	tooltipOperatorAI: "Three types of artificial intelligence (AI) agents: Equal Operator, Assisting Individual, Assisting Team Coordination (must have some level of team communication).",
	tooltipOperatorAIequal: "AI that can handle any task that the dispatcher handles. Employed when the human dispatchers are unavailable, and a task arrives.",
	tooltipOperatorAIindiv: "AI that directly supports dispatchers by reducing human error probability as well as how long it takes them to complete selected tasks.",
	tooltipOperatorAIindivLevel: "Level determines human performance speed. Partial: Human performance is 1.4 times faster. Service time decreases by 30% on each task that the AI assists. High: Human performance is 3.3 times faster. Service time decreases by 70% on each task that the AI assists.",
	tooltipOperatorAIteam: "AI that is available when there is some level of team coordination (more than one dispatcher in a team during the same shift).",
	tooltipOperatorAIteamLevel: "Level determines team communication speed. Partial: Team communication is 1.4 times faster, reduces team communication time by 30%. High: Team communication is 3.3 times faster, reduces team communication time by 70%.",


        // Reviews
	//tooltipRunWarnings: "Run simulation with warnings. Results may not be as accurate. Fix blue warnings above to run simulation without warnings.",

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
