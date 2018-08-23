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
        nOption: {  // 0 - arrival, 1 - duration, 2 - expiration
            type: Number,
            default: 1
        },
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
                    <div class="col-12">
                        <label>{{distLabel}}</label>
                    </div>
                    <div class="col-sm-6">
                        <select class="custom-select" id="transition" :value="dist" @change="onChangeDist" v-if="nOption === 0">
                            <option value="E">On average, once every X minutes</option>
                            <option value="L">On average, once every X minutes +/- Y minutes</option>
                            <option value="U">Once every X to Y minutes</option>
                            <option value="T">Once every X to Y minutes, usually around Z minutes</option>
                            <option value="C">Exactly once every X minutes</option>
                        </select>
                        <select class="custom-select" id="transition" :value="dist" @change="onChangeDist" v-if="nOption === 1">
                            <option value="E">On average, X minutes</option>
                            <option value="L">On average, X minutes +/- Y minutes</option>
                            <option value="U">X to Y minutes</option>
                            <option value="T">X to Y minutes, usually around Z minutes</option>
                            <option value="C">Exactly X minutes</option>
                        </select>
                        <select class="custom-select" id="transition" :value="dist" @change="onChangeDist" v-if="nOption === 2">
                            <option value="N" v-show="nOption">It can wait the whole shift time</option>
                            <option value="E">It must be done on average by X minutes after it appears</option>
                            <option value="L">It must be done on average by X minutes +/- Y minutes after it appears</option>
                            <option value="U">It must be done by X to Y minutes after it appears</option>
                            <option value="T">It must be done by X to Y minutes, usually around Z minutes after it appears</option>
                            <option value="C">It must be done by exactly X minutes after it appears</option>
                        </select>
                        <small class="form-text text-muted">Select Type</small>
                    </div>

                    <!-- distribution parameters (task.arrivalParam) -->
                    <div class="col-sm-6">
                        <div v-if="dist === 'E'" class="row no-gutters">
                            <div class="col">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">X Minutes</small>
                            </div>
                        </div>
                        <div v-if="dist === 'L'" class="row no-gutters">
                            <div class="col-sm mr-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">X Minutes</small>
                            </div>
                            <div class="col-sm ml-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[1]">
                                <small class="form-text text-muted">Y Minutes</small>
                            </div>
                        </div>
                        <div v-if="dist === 'U'" class="row no-gutters">
                            <div class="col-sm mr-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">X Minutes</small>
                            </div>
                            <div class="col-sm ml-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[1]">
                                <small class="form-text text-muted">Y Minutes</small>
                            </div>
                        </div>
                        <div v-if="dist === 'C'" class="row no-gutters">
                            <div class="col-sm mr-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">X Minutes</small>
                            </div>
                        </div>
                        <div v-if="dist === 'T'" class="row no-gutters">
                            <div class="col-sm mr-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[0]">
                                <small class="form-text text-muted">X Minutes</small>
                            </div>
                            <div class="col-sm ml-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[2]">
                                <small class="form-text text-muted">Y Minutes</small>
                            </div>
                            <div class="col-sm mx-1">
                                <input class="form-control" type="number" step="any" placeholder="Enter #" v-model.number="params[1]">
                                <small class="form-text text-muted">Z Minutes</small>
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
