Vue.component('distribution-params', {
    props: {
        dist: {     // "ELUCTN"
            type: String,
            default: "E",
        },
        params: {   // [4, 6, 8]
            type: Array,
            default: []
        },
        distLabel: {
            type: String,
            default: ""
        },
        paramsLabel: {
            type: String,
            default: ""
        },
        nOption: {
            type: Boolean,
            default: false
        }
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
        }
    },
    template:  `<div class="form-group form-row">
                    <div class="col-3">
                        <label>{{distLabel}}</label>
                        <select class="custom-select" id="transition" :value="dist" @change="onChangeDist">
                            <option value="E">Exponential</option>
                            <option value="L">Log Normal</option>
                            <option value="U">Uniform</option>
                            <option value="C">Constant</option>
                            <option value="T">Triangular</option>
                            <option value="N" v-show="nOption">Never Expires</option>
                        </select>
                        <small class="form-text text-muted">Type</small>
                    </div>

                    <!-- distribution parameters (task.arrivalParam) -->
                    <div class="col-9">
                        <label>{{paramsLabel}}</label>
                        <div v-if="dist === 'E'" class="row no-gutters">
                            <div class="col">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">Mean (Minutes)</small>
                            </div>
                        </div>
                        <div v-if="dist === 'L'" class="row no-gutters">
                            <div class="col mr-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">Mean (Minutes)</small>
                            </div>
                            <div class="col ml-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[1]">
                                <small class="form-text text-muted">Standard Deviation (Minutes)</small>
                            </div>
                        </div>
                        <div v-if="dist === 'U'" class="row no-gutters">
                            <div class="col mr-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">Minimum (Minutes)</small>
                            </div>
                            <div class="col ml-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[1]">
                                <small class="form-text text-muted">Maximum (Minutes)</small>
                            </div>
                        </div>
                        <div v-if="dist === 'C'" class="row no-gutters">
                            <div class="col mr-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">Number (Minutes)</small>
                            </div>
                        </div>
                        <div v-if="dist === 'T'" class="row no-gutters">
                            <div class="col mr-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">Minimum (Minutes)</small>
                            </div>
                            <div class="col mx-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[1]">
                                <small class="form-text text-muted">Mode (Minutes)</small>
                            </div>
                            <div class="col ml-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[2]">
                                <small class="form-text text-muted">Maximum (Minutes)</small>
                            </div>
                        </div>
                    </div>
                </div>`
});

Vue.component('percentage-input', {
    props: {
        value: {
            type: Number,
            default: 50
        },
        numberOnly: {
            type:Boolean,
            default: false
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
            default: true
        }
    },
    methods: {
        stepNumberInput(step) {
            this.validateInput(this.value + step);
        },

        validateInput(val) {
            if (val < this.min) val = this.min;
            if (val > this.max) val = this.max;

            this.$emit('update:value', val);
            this.$forceUpdate();    // not updating when you input more than max twice
            this.$emit('change');   // change event...
        }
    },
    template: `<div :class="['number-input', {'mt-3' : margin}, {'mb-3' : margin}]">
                <button @click="stepNumberInput(-step)" class="minus"></button>
                <input type="number" @change="validateInput(parseInt($event.target.value))"
                    :value="value">
                <button @click="stepNumberInput(step)" :class="['plus', {'number-only' : numberOnly }]"></button>
                <div class="input-group-append" v-if="!numberOnly">
                        <span class="input-group-text">%</span>
                </div>
            </div>`
});
