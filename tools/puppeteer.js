const puppeteer = require('puppeteer');
const executablePath = process.pkg ?
  puppeteer.executablePath().replace(__dirname, '.') :
  puppeteer.executablePath();


(async () => {
  const browser = await puppeteer.launch({ executablePath });
  const page = await browser.newPage();
  await page.goto('http://xxx.com/Login', { waitUntil: 'networkidle2' });;
  //登录
  await page.type('input[type=text]', "kuan001");
  await page.type('input[type=password]', '123456');

  await page.click('.ant-btn-primary');

  await page.waitForSelector(".ant-modal-wrap");

  await page.click('.ant-modal-wrap button:last-child');

  await page.goto('http://xxx.com/')

  await page.waitForSelector("#id")
  //页面登录成功后，需要保证redirect 跳转到请求的页面
  // await page.waitForNavigation();

  setInterval(async () => {

    let time = await page.$eval("#id", el => el.innerText);
    console.log('=time=', time);

  }, 1000);

  await page.screenshot({
    path: '2.png',
    fullPage: true
  });
  // browser.close();
})();