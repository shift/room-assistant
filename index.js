require('scribe-js')();

var config = require('config');
var console = process.console;

var MQTTPublisher = require('./components/mqtt');
var BLEScanner = require('./components/ble');
var Temper = require('./components/temper');

function RoomAssistantApp() {
    console.info('Starting Room Assistant...');
    this._init();
}

RoomAssistantApp.prototype._init = function () {
    // publishers
    if (config.get('mqtt.enabled')) {
        this.publisher = this._setupMQTT();
    }

    // components
    if (config.get('ble.enabled')) {
        this._setupBLE();
    }
    if (config.get('temper.enabled')) {
        this._setupTemper();
    }
};

RoomAssistantApp.prototype._setupMQTT = function () {
    return new MQTTPublisher();
};

RoomAssistantApp.prototype._setupBLE = function () {
    return new BLEScanner(this.publisher.publish.bind(this.publisher));
};

RoomAssistantApp.prototype._setupTemper = function () {
    return new Temper(this.publisher.publish.bind(this.publisher));
};

// start the app
var app = new RoomAssistantApp();
