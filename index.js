'use strict';

const path = require('path');
const mongoose = require('mongoose');
const env = process.env.NODE_ENV || 'development';

module.exports = modelLoader;

function modelLoader(config) {

    // make db connection
    config = config[env];
    const endpoint = config.use_env_variable ? process.env[config.env_variable] : config.db.endpoint;
    mongoose.connect(endpoint);

    const db = {
        models: {},
        Mongoose: mongoose
    };

    // model loader func
    return (modelPaths, services, options) => {
        modelPaths.forEach(thePath => {
            const Model = require(thePath)(db, services, options);
            let modelName = Model.name;

            if (!modelName) {
                let pathFinalSegment = thePath.split('/').pop(),
                    modelName = path.basename(pathFinalSegment, '.model.js');
            }

            db.models[modelName] = Model;
        });

        return db;
    };
}