const Koa = require("koa");
const Router = require("koa-router");
const mysql = require("mysql");

const app = new Koa();
const router = new Router();

const connecttion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'123456'
})

connecttion.connect(err => {
    if (err) throw err;
    console.log('mysql connected success!');
})

router.get("/", (ctx) => {
    ctx.body = "hello!";
})

router.get("/query", (ctx) => {
    return new Promise(resolve => {
        let name = ctx.query.name;
        const sql = `SELECT * FROM nodesql.user WHERE username = '${name}'`;
        connecttion.query(sql, (err, result) => {
            if (err) throw err;
            ctx.body = {
                code: 200,
                data: result
            }
            resolve();
        })
    })
})

app.use(router.routes());

app.listen(3000, () => {
    console.log("mysql server is statring at port 3000")
})
