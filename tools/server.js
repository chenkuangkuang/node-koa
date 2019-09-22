var http = require('http');
var fs = require('fs');//引入文件读取模块
var url = require('url');
var mine = require('mine').types;
var path = require('path');
var httpProxy = require('http-proxy');

var documentRoot = 'C://dist';
//需要访问的文件的存放目录
//前端页面调用接口时包含的接口前缀 用来标识这是接口访问
var API_PRE_STR = 'api';
//真正要请求的api地址
var API_DOMAIN = 'http://xxx.com:8099';

var historyApiFallback = require('connect-history-api-fallback');

var browserSync = require('browser-sync').create()
var proxy = require('http-proxy-middleware') // require('http-proxy-middleware');

const serverProxy = proxy(['/login1', '/api'], { target: 'http://192.168.123.131:5005', changeOrigin: true, });

var jsonPlaceholderProxy = proxy('/api', {
    target: API_DOMAIN,
    changeOrigin: true,             // for vhosted sites, changes host header to match to target's host
    pathRewrite: {
        '^/api': ''
    },
    logLevel: 'debug'
})

/**
 * Add the proxy to browser-sync
 */
browserSync.init({
    server: {
        baseDir: documentRoot,
        middleware: [
            serverProxy,
            jsonPlaceholderProxy
        ],
        middleware: [
            serverProxy,
            historyApiFallback(),
        ]
    },
    port: 8083,
    files: [
        'C:/dist/*.html'
    ]
    //   startPath: '/'
})

console.log('[DEMO] Server: listening on port 8080')


console.log('服务器开启成功');