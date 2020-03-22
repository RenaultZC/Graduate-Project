const puppeteer = require('puppeteer');

const handleKeyDown = async(page, selector, value) => {
  await page.waitForSelector(selector);
  await page.$eval(selector, el => {
    console.log(el.value);
    el.value = '';
  });
  await page.type(selector, value);
};

const handleClick = async(page, selector) => {
  await page.waitForSelector(selector);
  await page.click(selector);
};

const handleGoto = async(page, href) => {
  await page.goto(href);
};

const handleViewport = async(page, width, height) => {
  await page.setViewport({ width, height });
};

const analyze = async(snippet, historyId, headless) => {
  const event = JSON.parse(snippet);
  const frame = {
    frameId: 0
  };
  const browser = await puppeteer.launch({ headless });
  frame['0'] = await browser.newPage();
  let page = frame['0'];

  for (let i = 0, len = event.value.length; i < len; i++) {
    const { action, selector, value, tagName, frameId, frameUrl } = event.value[i];
    frame.frameId = frameId;
    let selectorArr = [];
    if (selector) {
      selectorArr = selector.split(' > ')[4];
    }
    if (!frame[`${frameId}`]) {
      const frames = await frame['0'].frames();
      frame[`${frameId}`] = await frames.find(f => f.url() === frameUrl);
    }

    page = frame[`${frameId}`];

    switch (action) {
      case 'keydown':
        await handleKeyDown(page, selectorArr, value);
        break;
      case 'click':
        await handleClick(page, selectorArr);
        break;
      case 'change':
        if (tagName === 'SELECT') {
          await handleClick(page, selectorArr);
        } else if (tagName === 'INPUT') {
          await handleKeyDown(page, selectorArr, value);
        }
        break;
      case 'goto*':
        await handleGoto(page, value);
        break;
      case 'viewport*':
        await handleViewport(page, value.width, value.height);
        break;
      default: break;
    }
  }
};

export default analyze;
