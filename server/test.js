const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://www.qikegu.com');

  // 等待"后端开发"这部分内容呈现
  await page.waitForSelector('#pos-backend');

  // 将鼠标悬停在"后端开发"第一个条目处
  const mouse = page.mouse;
  await mouse.move(560, 530);

  // await browser.close();
})();
