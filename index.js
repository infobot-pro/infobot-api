const SwaggerClient = require('swagger-client');
const EventEmitter = require('events');

const API_URL = 'https://admin.v2.infobot.pro/api-docs/api/v1.json';

class InfobotAPI {
    constructor(apiKey) {
        this._events = new EventEmitter();
        this._apiKey = apiKey;

        new SwaggerClient({
            url: API_URL,
            requestInterceptor: req => {
                req.headers['Authorization'] = `Bearer ${this._apiKey}`;
                return req;
            }
        })
            .then(
                client => {
                    this._client = client;
                    this._events.emit('ready');
                },
                reason => {
                    throw(reason);
                }
            );
    }

    on(event, callback) {
        this._events.on(event, callback);
    };

    once(event, callback) {
        this._events.on(event, callback);
    };

    call(scope, method, data = {}) {
        return this._client.apis[scope][method](data);
    }
}

module.exports = InfobotAPI;