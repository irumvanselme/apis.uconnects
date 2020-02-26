const mongoose = require('mongoose')

//  Online db  = mongodb+srv://anselme:123@cluster0-gu14c.mongodb.net/uconnects
//  offline db  = mongodb://localhost/ideegrond

mongoose.connect('mongodb+srv://anselme:123@cluster0-gu14c.mongodb.net/uconnects', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useFindAndModify: true
})
.then(() => console.log('connected to mongodb successfully....'))
.catch(err =>console.log('failed to connect to mongodb',err));
