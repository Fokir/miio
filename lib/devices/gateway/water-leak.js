'use strict';


const SubDevice = require('./subdevice');
const WaterDetection = require('../sensors/water');
const Voltage = require('./voltage');

/**
 * Magnet device, emits events `leak` and `no_leak` if the state changes.
 */
module.exports = class WaterLeak extends SubDevice.with(WaterDetection, Voltage) {
	constructor(parent, info) {
		super(parent, info);

		this.miioModel = 'lumi.generic.55';

		this.updateWaterDetected(false);
	}


	_report(data) {
		super._report(data);


		if (data.status === 'leak' || data.status === 'no_leak') {
			this.updateWaterDetected(data.status === 'leak');
		}
	}
};
