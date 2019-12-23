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

		this.defineProperty('status');
	}

	propertyUpdated(key, value, oldValue) {
		console.log(value, oldValue);
		if(key === 'status') {
			// Change the contact state
			const isLeak = value === 'leak';
			this.updateWaterDetected(isLeak);
		}

		super.propertyUpdated(key, value, oldValue);
	}
};
