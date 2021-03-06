'use strict';

const { Thing } = require('abstract-things');
const Sensor = require('abstract-things/sensors/sensor');
const { boolean, duration } = require('abstract-things/values/index');

const idleTimer = Symbol('autoIdle');

module.exports = Thing.mixin(Parent => class extends Parent.with(Sensor) {
	static get capability() {
		return 'water';
	}

	static availableAPI(builder) {
		builder.event('waterChanged')
			.type('boolean')
			.description('Change in water detected')
			.done();

		builder.event('waterLeak')
			.description('Water has been detected')
			.done();

		builder.event('waterCleared')
			.description('Water is no longer detected')
			.done();

		builder.action('water')
			.description('Get if water is currently detected')
			.returns('boolean', 'Current water detected status')
			.done();
	}

	get sensorTypes() {
		return [ ...super.sensorTypes, 'water' ];
	}

	water() {
		return this.value('water');
	}

	updateWaterDetected(water, autoIdleTimeout=null) {
		water = boolean(water);
		if(this.updateValue('water', water)) {
			if(water) {
				this.emitEvent('waterLeak');
			} else {
				this.emitEvent('waterCleared');
			}
		}

		// Always clear the idle timer
		clearTimeout(this[idleTimer]);

		if(water && autoIdleTimeout) {
			/*
			 * When water has been detected and automatic idle is requested
			 * set a timer.
			 */
			const ms = duration(autoIdleTimeout).ms;
			this[idleTimer] = setTimeout(() => this.updateWaterDetected(false), ms);
		}
	}
});
