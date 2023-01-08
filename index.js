const { app } = require("./app.js")

// settings
app.set('port', process.env.PORT || 5036)
app.set('json spaces', 2)

app.listen(app.get('port'), console.log(`server run in http://localhost:${app.get('port')}`))