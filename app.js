const fs = require('fs')
const Koa = require('koa')
const Router = require('koa-router')
var serve = require('koa-static')

let app = new Koa()
let router = new Router()

app.use(serve(__dirname + '/assets/'))

const PORT = process.env.PORT || 8099
router.get('/', async (ctx,next) => {
	let html = fs.readFileSync('./views/index.html', 'utf-8').replace('{{PORT}}', PORT)
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


server.listen(PORT)
console.log(`server linsten on localhost:${PORT}`)