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

const searchDataAll = ({current, pageSize, type, status, isp}) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: '127.0.0.1',   // 数据库地址
            user: 'root',    // 数据库用户
            password: '123456',   // 数据库密码
            database: 'test',  // 选中数据库
            multipleStatements: true
        })
        console.log('=txt=', current, pageSize, type, status, isp);
        // const querySql = "select count(*) from tianbao;select * from tianbao limit "+(current-1)*10+","+pageSize+" where "+(status ? "status="+status : "")+" AND type="+type+" AND isp="+isp;
        const querySql = "select count(*) from tianbao;select * from tianbao where type="+type + (isp && isp!='' ? " AND isp="+isp :"")+ (status && status!=''? " AND status="+status :"") +" limit "+((current-1)*10)+","+pageSize;
        // const querySql = "select count(*) from tianbao";

        connection.query(querySql, (error, result) => {
            console.log('=error, result=', error, result);
            if (error) {
                reject(error);
            } else {
                resolve({
                    record: result[1],
                    total: result[0][0]['count(*)'],
                    current: current
                });
            }
            connection.end();
        })
    })
}

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
                resolve(result[0]);
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

const updateData = (newObj) => {
    let { values } = newObj;
    let newValues = values;
    console.log('=newObj=', newObj, typeof newValues);
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: '127.0.0.1',   // 数据库地址
            user: 'root',    // 数据库用户
            password: '123456',   // 数据库密码
            database: 'test'  // 选中数据库
        })
        const addSql = "UPDATE tianbao SET years='"+newObj.years+"', type="+newObj.type+", status="+newObj.status+", `values`='"+newValues+"' WHERE id = ?";
        connection.query(addSql, [newObj.id], (error, result) => {
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

router.get("/biz-tgj/fillIn/page", async (ctx) => {
    const query = ctx.request.query;
    console.log('=query=', query);
    // const re = await addData(query);
    const re = await searchDataAll(query);
    console.log('=re=', re);
    ctx.body = {
        status: true,
        data:re
    }
})

router.post("/biz-tgj/fillIn", async (ctx) => {
    const query = ctx.request.query;
    const body = ctx.body;
    console.log('=query=123', query, ctx.request.body);
    const re = await addData(ctx.request.body);
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

router.put("/biz-tgj/fillIn", async (ctx) => {
    const {query, body} = ctx.request;
    const data = JSON.stringify(query) == '{}' ? body : query;
    console.log('=query=123', data);
    const re = await updateData(data);
    // const re = await searchDataById(1);
    console.log('=re=', JSON.stringify(re));
    ctx.body = {
        status: !!re.affectedRows,
        id:data.id
    }
})

router.get("/login", (ctx) => {
    ctx.body = {
        Code: 1,
        BackData: { user: "123", avatar: "1.png" },
        status: 200
    };
})


router.get("/project/page", (ctx) => {
    console.log('=ctx=', ctx);
    ctx.throw(502);
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
