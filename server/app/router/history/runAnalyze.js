const puppeteer = require('puppeteer');
const path = require('path');
import { makePromiseForQuery } from '../../dao/common';

const insertConsums = async consums => {
  const query = 'INSERT INTO consum(historyId, action, delay, remarks, status) VALUES ?';
  await makePromiseForQuery(query, [consums]);
};

const insertScreenshot = async screenshots => {
  const query = 'INSERT INTO screenshot(historyId, path) VALUES ?';
  await makePromiseForQuery(query, [screenshots]);
};

const performance = async(page) => {
  const data = {
    cache: ['domainLookupStart', 'fetchStart'], // 读取缓存时间
    dns: ['domainLookupEnd', 'domainLookupStart'], // DNS 解析耗时
    tcp: ['connectEnd', 'connectStart'], // TCP 连接耗时
    req: ['responseStart', 'requestStart'], // 网络请求耗时
    res: ['responseEnd', 'responseStart'], // 数据传输耗时
    dom: ['domContentLoadedEventStart', 'domLoading'], // DOM 解析耗时
    readycb: ['domContentLoadedEventEnd', 'domContentLoadedEventStart'], // domContentLoaded回调函数耗时
    fasrt: ['domComplete', 'domContentLoadedEventEnd'], // 首屏异步资源加载耗时，即domContentLoaded和load之间加载的资源，一般为图片加载，JS异步加载的资源
    loadcb: ['loadEventEnd', 'loadEventStart'], // load回调函数耗时
    ready: ['domContentLoadedEventEnd', 'fetchStart'], // 	DOM Ready耗时，白屏时间
    load: ['loadEventEnd', 'fetchStart'] //	页面完全加载时间
  };

  const getData = {};
  // eslint-disable-next-line
  const metrics = await page.evaluate(() => JSON.stringify(window.performance));
  const performance = JSON.parse(metrics);

  if (!performance || !performance.timing) {
    return null;
  }

  const timing = performance.timing;

  Object.keys(data).map(item => {
    const firstParams = timing[data[item][0]];
    const secondParams = timing[data[item][1]];
    const value = Math.round(firstParams - secondParams);
    value >= 0 && value < 36e5 && (getData[item] = value);
  });

  return getData;
};

const handleKeyDown = async(page, selector, value) => {
  await page.waitForSelector(selector);
  await page.$eval(selector, el => {
    el.value = '';
  });
  await page.type(selector, value);
};

const handleClick = async(page, selector, clientRect) => {
  if (clientRect) {
    const { x, y } = clientRect;
    await page.mouse.click(x, y);
  } else {
    await page.waitForSelector(selector);
    await page.click(selector);
  }
};

const handleGoto = async(page, href) => {
  await page.goto(href);
};

const handleViewport = async(page, width, height) => {
  await page.setViewport({ width, height });
};

const analyze = async(snippet, historyId, headless, delayTime) => {
  const event = JSON.parse(snippet);
  const frame = {
    frameId: 0
  };
  headless = !headless;
  const browser = await puppeteer.launch({ headless, args: ['--start-maximized'] });
  frame['0'] = await browser.newPage();
  let page = frame['0'];
  const analyzeFile = `/static/file/${historyId}.json`;
  const fileName = path.resolve(__dirname, `../..${analyzeFile}`);
  console.log(fileName);
  let successTemp = 0;
  let failTemp = 0;
  const consums = [];
  const urls = {};
  const screenshots = [];
  const consoles = [];
  page.on('request', async(request) => {
    if (/^https{0,1}:\/\//.test(request.url())) {
      urls[request.url()] = Date.now();
    }
  });

  page.on('response', async(response) => {
    const responseUrl = response.url();
    if (/^https{0,1}:\/\//.test(responseUrl)) {
      urls[responseUrl] = {
        delay: Date.now() - urls[responseUrl],
        url: responseUrl,
        status: response.status(),
        fromCache: response.fromCache(),
        fromServiceWorker: response.fromServiceWorker(),
      };
      if (response.ok()) {
        successTemp++;
      } else {
        failTemp++;
      }
    }
  });

  await page.tracing.start({ path: fileName });
  page.on('console', async msg => {
    const res = [];
    for (let i = 0; i < msg.args().length; ++i)
      res.push(await msg.args()[i].jsonValue());
    consoles.push(res.join(','));
  });

  for (let i = 0, len = event.length; i < len; i++) {
    const startTime = Date.now();
    const { action, selector, value, tagName, frameId, frameUrl, clientRect, check, checkValue } = event[i];
    const { x, y } = clientRect || {};
    let selectorArr = [];

    frame.frameId = frameId;

    if (selector) {
      selectorArr = selector.split(' > ')[4];
    }

    if (!frame[`${frameId}`]) {
      const frames = await frame['0'].frames();
      frame[`${frameId}`] = await frames.find(f => f.url() === frameUrl);
    }

    page = frame[`${frameId}`];
    const mouse = page.mouse;

    if (x && y) {
      await mouse.move(x, y);
    }

    switch (action) {
      case 'keydown':
        await handleKeyDown(page, selectorArr, value);
        break;
      case 'click':
        await handleClick(page, selectorArr, clientRect);
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
    const delay = Date.now() - startTime;
    event[i].delay = delay;
    await page.waitFor(delayTime);
    switch (check) {
      case 'element':
        try {
          await page.waitForSelector(checkValue);
          event[i].result = true;
        } catch (e) {
          event[i].result = false;
        }
        break;
      case 'console':
        if (consoles[consoles.length - 1] === checkValue) {
          event[i].result = true;
        } else {
          event[i].result = false;
        }
        break;
      default: break;
    }
    const screenshotPath = `/static/img/${historyId}_${i}.png`;
    await page.screenshot({ path: path.resolve(__dirname, `../..${screenshotPath}`), fullPage: true });
    screenshots.push([ historyId, screenshotPath ]);
  }

  await page.tracing.stop();

  const analyzeData = await performance(page);
  Object.keys(urls).forEach(v => {
    const value = urls[v];
    if (typeof value !== typeof{} || !value)  return;
    const remarks = JSON.stringify(value);
    consums.push([ historyId, 'request', value.delay, remarks, value.status ]);
  });
  await browser.close();
  await insertConsums(consums);
  await insertScreenshot(screenshots);
  return {
    analyzeData: JSON.stringify(analyzeData),
    successTemp,
    failTemp,
    analyzeFile,
    snippet: JSON.stringify(event),
  };
};

export default analyze;
