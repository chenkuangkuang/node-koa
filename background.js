const Koa = require("koa");
const app = new Koa();
const router = require("koa-router")();
const cors = require("koa2-cors");

app.use(cors());

router.get("/login", (ctx) => {
    ctx.body = {
        Code: 1,
        BackData: { user: "123", avatar: "1.png" },
        status:200
    };
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
    console.log('server is starting ar port 3000……');
})
