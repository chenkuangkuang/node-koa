const Koa = require("koa");
const app = new Koa();
const fs = require("fs");
const router = require("koa-router")();
const cors = require("koa2-cors");
const views = require('koa-views');
const path = require('path');
const static = require('koa-static')
var bodyParser = require('koa-bodyparser');

const mysql = require('mysql')

app.use(bodyParser());

const searchDataById = (id) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: '127.0.0.1',   // 数据库地址
            user: 'root',    // 数据库用户
            password: '123456',   // 数据库密码
            database: 'test'  // 选中数据库
        })
        const querySql = "select * from tianbao where id = ?";
        console.log('=txt=', id);
        connection.query(querySql, [id], (error, result) => {
            console.log('=error, result=', error, result);
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
            connection.end();
        })
    })
}

// newArr = [id, years, type, status, values];
const addData = (newArr) => {
    console.log('=newArr=', newArr);
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: '127.0.0.1',   // 数据库地址
            user: 'root',    // 数据库用户
            password: '123456',   // 数据库密码
            database: 'test'  // 选中数据库
        })
        const addSql = "INSERT INTO tianbao SET ?";
        connection.query(addSql, newArr, (error, result) => {
            console.log('=error, result=', error, result);
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
            connection.end();
        })
    })
}

router.post("/biz-tgj/fillIn", async (ctx) => {
    const query = ctx.request.query;
    console.log('=query=', query);
    const re = await addData(query);
    // const re = await searchDataById(1);
    console.log('=re=', re);
    ctx.body = {
        status: !!re.insertId,
        id:re.insertId
    }
})

router.get("/biz-tgj/fillIn", async (ctx) => {
    const query = ctx.request.query;
    console.log('=query=', query);
    // const re = await addData(query);
    const re = await searchDataById(query.id);
    console.log('=re=', re);
    ctx.body = {
        status: true,
        data:re
    }
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

app.listen(3001, () => {
    console.log('server is starting ar port 3001……');
})
