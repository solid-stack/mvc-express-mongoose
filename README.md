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

When the app exits, it's good practice to close all open mongoose connection using [`mongoose.disconnect`](http://mongoosejs.com/docs/api.html#index_Mongoose-disconnect).

## Config

The config object should include the following values for the current environment. Below is an example for 
the `development` environment:

```
let config = {
    development: {
        db: {
            endpoint: String, // 'mongodb://username:password@host:port/database',
        },
        env_variable: String, // the property from `process.env` that will be used to extract the db connection defaults to empty string
    }
}
```

The current environment is taken form `process.env.NODE_ENV`. If this is absent, the environment defaults
to `development`.

## Creating models

Each model file will receive as arguments: `db`, `services`, and `options`. The `db` param will include the 
properties `connection`, `Mongoose`, and `models`, which is a reference to all other models in the project. 

You can access the connection via `db.connection`

Here is a sample model:

```javascript
'use strict';

module.exports = TestModel;

function TestModel(db, services, options) {
    // db looks like this:
    // {
    //   connection: Object, // result of Mongoose.createConnection()
    //   Mongoose: Object, // result of require('mongoose')
    //   models: {
    //       ModelName: Object // result of db.connection.model('ModelName', <schema object>),
    //   }

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

    return db.connection.model(
        modelName, // db[modelName] will be available for use
        new db.Mongoose.Schema(schema, {collection: collectionName})
    );
}
```

See the [mongoose docs](http://mongoosejs.com/docs) for more info.
