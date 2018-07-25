/**
 * Get jobNo & job links in 104jobbank full-time job search 
 */
const puppeteer = require("puppeteer");

var getJobLinks = async(url) => {

    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto(url);

    // click full-time
    await page.click('#js-job-tab > li:nth-child(2)');

    // get jobLinks
    const links = await page.evaluate(() => {
        let nth = 1;
        let links = [];

        while (1) {
            let selector = '#js-job-content > article:nth-child(' + nth + ') > div.b-block__left > h2 > a';
            let dom = document.querySelector(selector);
            if (!dom) {
                break;
            }
            links.push(dom.href);
            nth++;
        }
        return links;
    });

    browser.close();
    return links;
};

// search page
let page = 1;
let url = 'https://www.104.com.tw/jobs/search/';

if (page != '') {
    url += '?page=' + page; 
}

getJobLinks(url).then((links) => {
    console.log(links);
    let jobnos = links.map((link) => {
        let jobno = link.match(/jobno=(.*?)&/);
        return jobno ? parseInt(jobno[1], 36) : null;
    });
    jobnos = jobnos.filter((jobno) => jobno);
    console.log(jobnos);
});