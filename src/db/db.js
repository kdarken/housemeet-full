const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, //avoid deprecation warnings with these
    useCreateIndex: true,
})
