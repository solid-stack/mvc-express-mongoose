# mvc-express-mongoose

This is a [Mongoose](http://mongoosejs.com/) model loader for [mvc-express](https://github.com/pajtai/mvc-express).

## Usage

```javascript
const config = require('../config');

const mvc = require('mvc-express');
const modelLoader = require('mvc-express-mongoose')(config);


mvc.boot({
    root: __dirname,
    modelLoader
})
```

## Config

The config object should include the following values for the current environment.

```
let config = {
    development: {
        endpoint: String, // 'mongodb://username:password@host:port/database',
        use_env_variable: Boolean, // defaults to false. If true, `process.env` is used to extract the configs.
        env_variable: String // the property from `process.env` that will be used to extract the db connection 
    }
}
```

It's important to know that the `development` property correlates to `process.env.NODE_ENV`. This defaults to 'development'.

## Creating models

Each model file will receive as arguments: `db`, `services`, and `options`. The `db` param will include the 
properties `Mongoose`, and `models`, which is a reference to all other models in the project. 

You can access the connection via `db.Mongoose.connection`

Here is a sample model:

```javascript
'use strict';

module.exports = TestModel;

function TestModel(db, services, options) {
    let modelName = 'TestModel',
        collectionName = 'testCollection',
        schema = {
            fields: {
                fieldOne: {type: String},
                fieldTwo: {type: 'int'}
            },
            slug: {type: String},
            meta: {
                type: {type: db.Mongoose.Schema.ObjectId, ref: 'content'},
                node: {type: db.Mongoose.Schema.ObjectId, ref: 'nodes'},
                lastmodified: {type: Date, default: Date.now},
                created: {type: Date, default: Date.now},
                typelabel: {type: String},
                labelfield: {type: String}
            }
        };

    return db.Mongoose.connection.model(
        modelName,
        new db.Mongoose.Schema(schema, {collection: collectionName})
    );
}
```

See the [Mongoose docs](http://mongoosejs.com/docs/connections.html) for more info.