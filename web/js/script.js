$(function () {
    console.log('start=');
    $.ajax("http://localhost:3000/login", function (a, b) {
        console.log('a, b=', a, b);
    })
})