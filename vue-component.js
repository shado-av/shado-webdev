Vue.component('distribution-params', {
    props: {
        dist: {     // "ELUCTN"
            type: String,
            default: "E",
        },
			  leadTask: {
					 type: Number,
					 default: -1,
				},
        params: {   // [4, 6, 8]
            type: Array,
            default: () => []
        },
        distLabel: {
            type: String,
            default: ""
        },
        paramsLabel: {
            type: String,
            default: ""
        },
        nOption: {  // 0 - arrival, 1 - duration, 2 - expiration
            type: Number,
            default: 1
        },
    },
    data: function() {
        return { errors: [] };
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
        },
        // check whether the params is numbers and greater than zero
        checkNumbers(params, length) {
            for(var i=0;i<length;i++) {
               if (typeof params[i] !== 'number' || params[i] <= 0)
                    return false;
            }
            return true;
        },
        validateInput(isDisplying) {
            // check whether the current distribution setting is correct
            // bigger than 0
            // min < max (uniform)
            // min < mode < max (triangular)
            const paramSize = { 'E': 1, 'C':1, 'U':2, 'L':2, 'T': 3};

            this.errors = [];
            //console.log("ValidateInput", this.params, this.dist);
            if (!this.checkNumbers(this.params, paramSize[this.dist])) {
                this.errors.push("Distribution parameters should be greater than 0. ");
            }
            switch(this.dist) {
                case 'U':
                    if (this.params[0] > this.params[1]) {
                        this.errors.push("X should be smaller than Y.");
                    }
                    break;
                case 'T':
                    if (this.params[0] > this.params[1] || this.params[0] > this.params[2]
                        || this.params[1] > this.params[2]) {
                        this.errors.push("X < Z < Y");
                    }
                    break;
            }

            if (this.errors.length > 0)
                return false;

            return true;
        },
    },
    mounted() {
        EventBus.$on("validateInput", this.validateInput);
    },
    template:  `<div class="form-group form-row">
                    <div class="col-12" v-if='distLabel !== ""'>
                        <label>{{distLabel}}</label>
                    </div>
                    <div class="col-sm-12">
                        <select class="custom-select" id="transition" :value="dist" @change="onChangeDist" v-if="leadTask >= 0">
                            <option value="E">On average, X minutes later.</option>
                            <option value="L">On average, X minutes +/- Y minutes later.</option>
                            <option value="U">On average, X to Y minutes later.</option>
                            <option value="T">On average, X to Y minutes, usually around Z minutes later.</option>
                            <option value="C">Exactly X minutes later.</option>
                        </select>
                        <select class="custom-select" id="transition" :value="dist" @change="onChangeDist" v-else-if="nOption === 0">
                            <option value="E">On average, once every X minutes.</option>
                            <option value="L">On average, once every X minutes +/- Y minutes.</option>
                            <option value="U">Once every X to Y minutes.</option>
                            <option value="T">Once every X to Y minutes, usually around Z minutes.</option>
                            <option value="C">Exactly once every X minutes.</option>
                        </select>
                        <select class="custom-select" id="transition" :value="dist" @change="onChangeDist" v-if="nOption === 1">
                            <option value="E">On average, X minutes.</option>
                            <option value="L">On average, X minutes +/- Y minutes.</option>
                            <option value="U">X to Y minutes.</option>
                            <option value="T">X to Y minutes, usually around Z minutes.</option>
                            <option value="C">Exactly X minutes.</option>
                        </select>
                        <select class="custom-select" id="transition" :value="dist" @change="onChangeDist" v-if="nOption === 2">
                            <option value="N" v-show="nOption">It can wait the whole shift time.</option>
                            <option value="E">It must be done, on average, by X minutes after it appears.</option>
                            <option value="L">It must be done, on average, by X minutes +/- Y minutes after it appears.</option>
                            <option value="U">It must be done within X to Y minutes after it appears.</option>
                            <option value="T">It must be done within X to Y minutes, usually around Z minutes, after it appears.</option>
                            <option value="C">It must be done by exactly X minutes after it appears.</option>
                        </select>
                        <small class="form-text text-muted mb-3">Choose Your Estimation</small>
                    </div>

                    <!-- distribution parameters (task.arrivalParam) -->
                    <div class="col-sm-12">
                        <div v-if="dist === 'E'" class="form-inline no-gutters">
                            <span v-if="nOption === 2">It must be done, on average, by </span>
                            <span v-else-if="nOption === 1 || leadTask >= 0">On average, </span>
                            <span v-else-if="nOption === 0">On average, once every </span>
                            <span class="mr-2 ml-2 form-group">
                                <input class="form-control width-100" type="number" step="any" placeholder="X" v-model.number="params[0]" @change="validateInput">
                            </span>
                            <span>minutes</span>
                            <span class="ml-2" v-if="nOption === 2">after it appears.</span>
														<span class="ml-2" v-if="leadTask >=0">later.</span>
                        </div>
                        <div v-if="dist === 'L'" class="form-inline  no-gutters">
                            <span v-if="nOption === 2">It must be done, on average, by </span>
                            <span v-else-if="nOption === 1 || leadTask >= 0">On average, </span>
                            <span v-else-if="nOption === 0">On average, once every </span>
                            <div class="ml-2 mr-2 form-group">
                                <input class="form-control width-100" type="number" step="any" placeholder="X" v-model.number="params[0]" @change="validateInput">
                            </div>
                            <span>minutes +/-</span>
                            <div class="ml-2 mr-2 form-group">
                                <input class="form-control width-100" type="number" step="any" placeholder="Y" v-model.number="params[1]" @change="validateInput">
                            </div>
                            <span>minutes</span>
                            <span class="ml-2" v-if="nOption === 2">after it appears.</span>
														<span class="ml-2" v-if="leadTask >=0">later.</span>
                        </div>
                        <div v-if="dist === 'U'" class="form-inline  no-gutters">
                            <span class="mr-2" v-if="leadTask >= 0">On average, </span>
                            <span class="mr-2" v-else-if="nOption === 0">Once every</span>
                            <span class="mr-2" v-else-if="nOption === 2">It must be done by</span>
                            <div class="mr-2 form-group">
                                <input class="form-control width-100" type="number" step="any" placeholder="X" v-model.number="params[0]" @change="validateInput">
                            </div>
                            <span>to</span>
                            <div class="ml-2 mr-2 form-group">
                                <input class="form-control width-100" type="number" step="any" placeholder="Y" v-model.number="params[1]" @change="validateInput">
                            </div>
                            <span>minutes</span>
                            <span class="ml-2" v-if="nOption === 2">after it appears.</span>
														<span class="ml-2" v-if="leadTask >=0">later.</span>
                       </div>
                        <div v-if="dist === 'C'" class="form-inline no-gutters">
                            <span v-if="nOption === 1 || leadTask >= 0">Exactly</span>
                            <span v-else-if="nOption === 2">It must be done by exactly</span>
                            <span v-else-if="nOption === 0">Exactly once every</span>
                            <div class="ml-2 mr-2 form-group">
                                <input class="form-control width-100" type="number" step="any" placeholder="X" v-model.number="params[0]" @change="validateInput">
                            </div>
                            <span>minutes</span>
                            <span class="ml-2" v-if="nOption === 2">after it appears</span>
														<span class="ml-2" v-if="leadTask >=0">later.</span>
                        </div>
                        <div v-if="dist === 'T'" class="form-inline  no-gutters">
                            <span class="mr-2" v-if="nOption === 2">It must be done by</span>
                            <span class="mr-2" v-else-if="leadTask >= 0">On average,</span>
                            <span class="mr-2" v-else-if="nOption === 0">Once every</span>
                            <div class="mr-2 form-group">
                                <input class="form-control width-100" type="number" step="any" placeholder="X" v-model.number="params[0]" @change="validateInput">
                            </div>
                            <span>to</span>
                            <div class="ml-2 mr-2 form-group">
                                <input class="form-control width-100" type="number" step="any" placeholder="Y" v-model.number="params[2]" @change="validateInput">
                            </div>
                            <span>minutes, usually around</span>
                            <div class="ml-2 mr-2 form-group">
                                <input class="form-control width-100" type="number" step="any" placeholder="Z" v-model.number="params[1]" @change="validateInput">
                            </div>
                            <span>minutes</span>
                            <span class="ml-2" v-if="nOption === 2">after it appears.</span>
														<span class="ml-2" v-if="leadTask >=0">later.</span>
                        </div>
                        <div class="mt-3 alert alert-danger" v-if="errors.length">
                            <span v-for="error in errors">{{ error }}</span>
                        </div>
                    </div>
                </div>`
});

Vue.component('number-input', {
    props: {
        value: {
            type: Number,
            default: 50
        },
		float: {
			type: Boolean,
			default: false
		},
		fixed: {
			type: Number,
			default: 2
		},
        textEnd: {
            type:String,
            default: ""
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
            default: false
        }
    },
    methods: {
        stepNumberInput(step) {
            this.validateInput(this.value + step);
        },

        validateInput(val) {
			if (!this.float) {
				val = parseInt(val);
			} else {
				val = 1 * val.toFixed(this.fixed);
			}
            if (val < this.min) val = this.min;
            if (val > this.max) val = this.max;

            this.$emit('update:value', val);
            this.$forceUpdate();    // not updating when you input more than max twice
            this.$emit('change');   // change event...
        }
    },
    template: `<div :class="['number-input', {'mt-3' : margin}, {'mb-3' : margin}]">
                <button @click="stepNumberInput(-step)" class="minus"><i class="fas fa-minus fa-lg"></i></button>
                <input type="number" @change="validateInput(parseFloat($event.target.value))"
                    :value="value">
                <button @click="stepNumberInput(step)" :class="['plus', {'number-only' : textEnd==='' }]"><i class="fas fa-plus fa-lg"></i></button>
                <div class="input-group-append" v-if="textEnd!==''">
                        <span class="input-group-text"><span v-html="textEnd"></span></span>
                </div>
            </div>`
});
