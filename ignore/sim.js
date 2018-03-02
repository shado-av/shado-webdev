var defaultParams = {
    numHours: 1,
    traffLevels: ["l"],
    numReps: 1,
    numPhases: 1,
    numOps: 1,
    numTaskTypes: 1
};

Vue.component("operator", {
    template: "\
        <div class='card'>\
            <div class='card-header row'>\
                <h5 class='col-11 mb-0'>\
                    Operator {{ number }}: {{ name }}\
                </h5>\
                <div class='col-1'>\
                    <button type='button' class='close' aria-label='Close'>\
                        <span aria-hidden='true'>&times;</span>\
                    </button>\
                </div> \
            </div>\
            <div class='card-body'>\
                <form>\
                    <div class='form-group row'>\
                        <label class='col-sm-3 col-md-2 col-form-label'>\
                            Operator Name:\
                        </label>\
                        <div class='col-sm-9 col-md-10'>\
                            <input ref='input'\
                                v-bind:value='name'\
                                v-on:input='updateValue($event.target.value)'\
                            >\
                        </div>\
                    </div>\
                </form>\
            </div>\
        </div>",
    
    props: {
        name: {
            type: String,
            default: ""
        },
        
        number: {
            type: Number,
            default: 0
        },
        tasks: {
            type: Array,
            default: []
        }
    }
})

var app = new Vue({
    
    data: {
        params: defaultParams,
        operators: [
            {
                name: "",
                tasks: []
            } 
        ],
        tasks: [
            {
                name: "",
                priority: [],
                arrDist: "",
                arrPms: [],
                serDist: "",
                serPms: [],
                expDist: "",
                expPmsLo: [],
                expPmsHi: [],
                affByTraff: []
            }
        ]
    },
    
    methods: {
        
        addTraffLvl() {
            
        },
        
        addOperator() {
            
            
        },
        
        addTask() {
            
        },
        
        updateOperator(field) {
            
        }
        
        
        
        
    }
})