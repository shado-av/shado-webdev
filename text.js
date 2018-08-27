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
        fleets: "Fleets",       // for fleets menu
        fleet_settings: "Fleet Settings",
        qFleets: "How many different fleets do the operators manage?",
        qNumVeh: "How many vehicles are in this fleet?",

        // Operator Teams
        operators: "Operators", // for operators menu
        operator_list: "Operator List",
        operator_settings: "Operator Settings",

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
        fleets: "Railroad",       // for fleets menu
        fleet_settings: "Railroad Settings",
        qFleets: "How many different railroads do the operators manage?",
        qNumVeh: "How many subdivisions are on this railroad?",

        // Operator Teams
        operators: "Dispatcher", // for operators menu
        operator_list: "Dispatcher List",
        operator_settings: "Dispatcher Settings",


        // Reviews

        // Results

        // Misc
        mainMenu: [ "Shift Settings", "Task Settings", "Railroad Settings", "Dispatcher Settings", "Review Settings" ],
        previousTab: "",
        nextTab: "Tasks",
    }
};
