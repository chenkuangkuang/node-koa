const Koa = require("koa");
const app = new Koa();
const fs = require("fs");
const router = require("koa-router")();
const views = require('koa-views');
const path = require('path');
const static = require('koa-static')

app.use(static(__dirname+'/static'));

app.use(views(path.join(__dirname), {
    map: {
        html: 'ejs'
    }
}))

// app.use( async ( ctx ) => {
//     let title = 'hello koa2'
//     await ctx.render('index', {
//       title,
//     })
//   })

router.get("/", async (ctx) => {
    const files = fs.readdirSync("./douban/");
    console.log('=files=', files);
    await ctx.render('index.html',{arr:files})
})

router.get("/login", (ctx) => {
    ctx.body = {
        Code: 1,
        BackData: { user: "123", avatar: "1.png" },
        status: 200
    };
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8090, () => {
    console.log('server is starting ar port 8090');
})
