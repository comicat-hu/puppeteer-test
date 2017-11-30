const puppeteer = require("puppeteer");

var screenshot = async(url, filename) => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({
        width: 1024,
        height: 768
    });
    await page.screenshot({
        path: "screenshot/" + filename
    });
    browser.close();
};

var scrape = async(url, selector) => {

    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url);

    const data = await page.evaluate((selector) => {
        const dom = document.querySelector(selector);
        return dom ? dom.textContent : null;
    }, selector);

    browser.close();
    return data;
};

// screenshot("url", "filename");

// scrape("url", "selector").then((data) => {
//     console.log(data);
// });
