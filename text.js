var textStrings = {
    General : {
        // Basic Settings
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

        // Fleets
        fleets: "Fleets",       // for fleets menu

        // Operator Teams
        operators: "Operators", // for operators menu

        // Reviews

        // Results
    },
    Aviation: {

    },
    Rail: {
        questionHours: "1. How many hours are your train dispatchers working?",
        questionTransition: "2. If your dispatchers have transfer-of-duty periods, when do they occur?",
        questionTransitionDuration: [
            "At the beginning of their shifts, how long does this transfer-of-duty last?",
            "At the ending of their shifts, how long does this transfer-of-duty last?",
        ],
        questionExtremeCondition: "3. Will there be any extreme conditions during this shift?",
        optionExtremeCondition: [ "Derailment", "Poor Weather"],
    }
};
