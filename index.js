'use strict';

const mongoose = require('mongoose');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

module.exports = modelLoader;

function modelLoader(config) {

    // make db connection
    config = config[env];
    const endpoint = config.use_env_variable ? process.env[config.env_variable] : config.db.endpoint;
    mongoose.connect(endpoint);

    const db = {
        models: {},
        mongoose
    };

    // model loader function
    return (modelPaths, services, options) => {
        modelPaths.forEach(thePath => {
            let modelName = path.basename(thePath, '.model.js');
            const Model = require(thePath)(db.mongoose.connection, services, options);
            db.models[modelName] = Model;
        });

        return db;
    };
}