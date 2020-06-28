const Koa = require("koa");
const app = new Koa();
const fs = require("fs");
const router = require("koa-router")();
const cors = require("koa2-cors");
const views = require('koa-views');
const path = require('path');
const static = require('koa-static')

const mysql = require('mysql')


const searchTxt = (txt) => {

    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host     : '127.0.0.1',   // 数据库地址
            user     : 'root',    // 数据库用户
            password : '123456',   // 数据库密码
            database : 'test'  // 选中数据库
        })
        // txt = '3';
        const querySql = "select * from books where name LIKE ?";
        console.log('=txt=', txt);
        connection.query(querySql, ['%'+txt+'%'], (error, result) => {
            console.log('=a, b, c=', error, result);
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
            connection.end();
        })
    })
}


const files = fs.readdirSync("./douban/");

const addSql = "INSERT INTO books(id, name, author) VALUES ?";




// let sqlArr = [];

// var startId = 4;
// files.map(i => {
//     startId++;
//     console.log('=i=['+i+']');
//     const name = i.split("-")[0].replace(/\s+/, '');
//     const author = i.split("-")[1].replace('.mobi', '').replace(/\s+/, '');
//     sqlArr.push([startId, name, author])
// })

// console.log('=sqlArr=', sqlArr);


// 执行sql脚本对数据库进行读写 
// connection.query(addSql, [sqlArr]);

// connection.end();



// app.use(cors());

const staticPath = './static/'

// app.use(static(
//     path.join(__dirname, staticPath)
// ))

app.use(static(__dirname+'/static'));

app.use(views(path.join(__dirname), {
    // extension: 'html',
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
    // const files = fs.readdirSync("./douban/");
    console.log('=111=', ctx.request.search, ctx.request.query);
    let keyWord = '';
    if (ctx.request.query && ctx.request.query.search) {
        keyWord = ctx.request.query.search;
    }
    const re = await searchTxt(keyWord);
    console.log('=keyWord=['+keyWord+']', re);
    // console.log('=files=', files);
    await ctx.render('index', { arr: re.map(i=>i.name + '-' + i.author) })
    // console.log('=111=', 111);
    // return new Promise(function(resolve, reject){
    //     return fs.readdir("./douban/", (error, files) => {
    //         console.log('=files=', files);
    //         var dom = `${files.map(i=>(i+'\n')).join("")}`
    //         // ctx.body = dom;
    //         ctx.render('books.html',{arr:files})
    //         resolve(dom);
    //     })
    // })
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

app.listen(3000, () => {
    console.log('server is starting ar port 3000……');
})
