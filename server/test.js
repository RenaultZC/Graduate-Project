const puppeteer = require('puppeteer');

(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://www.baidu.com');
  await page.waitForSelector('title');

  // 截屏整个视图
  await page.screenshot({ path: 'screenshot.png' });

  await browser.close();
})();
