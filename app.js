const fs = require('fs')
const Koa = require('koa')
const Router = require('koa-router')
var serve = require('koa-static')

let app = new Koa()
let router = new Router()

app.use(serve(__dirname + '/assets/'))

router.get('/', async (ctx,next) => {
	let html = fs.readFileSync('./views/index.html', 'utf-8')
	ctx.body = html
})
app.use(router.routes())

var server = require('http').createServer(app.callback())
let data = []
var io = require('socket.io')(server)
io.on('connection', function(client){ 
	client.on('send-msg', msg => {
		data.push(msg)
		msgUpdate(client, data)
	})
	msgUpdate(client, data)
})

function msgUpdate(client, data) {
	client.broadcast.emit('msg-update', data)
	client.emit('msg-update', data)
}


const PORT = process.env.PORT || 8099
server.listen(PORT)
console.log(`server linsten on localhost:${PORT}`)