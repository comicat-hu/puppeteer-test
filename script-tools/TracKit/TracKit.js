const puppeteer = require("puppeteer");
const fs = require("fs");
const mkdirp = require("mkdirp");

function TracKit() {
    let _webRoot, _username, _password;
    this.getWebRoot = () => _webRoot;
    this.getUsername = () => _username;
    this.getPassword = () => _password;

    this.setWebRoot = (webRoot) => {
        _webRoot = webRoot;
    };
    this.setUsername = (username) => {
        _username = username;
    };
    this.setPassword = (password) => {
        _password = password;
    };

    let _puppeteer;
    let puppeteer = () => {
        if (_puppeteer === undefined) {
            _puppeteer = new PuppeteerSingleton;
        }
        return _puppeteer;
    };

    let _tickets = {};
    this.downloadTicket = async (ticketID, options) => {
        let target = `${this.getWebRoot()}/ticket/${ticketID}`;
        let auth = new Buffer(`${this.getUsername()}:${this.getPassword()}`).toString('base64');
        let page = await puppeteer().getPage();
        await page.setExtraHTTPHeaders({
            'Authorization': `Basic ${auth}`                   
        });
        await page.goto(target);

        let ticket = new TracTicket;

        // select title
        await page.evaluate(() => {
            let dom = document.querySelector('#field-summary');
            return dom ? dom.value : Promise.reject('title not found');
        }).then(title => ticket.setTitle(title));
        

        // select description
        await page.evaluate(() => {
            let dom = document.querySelector('#field-description');
            return dom ? dom.innerHTML : Promise.reject('description not found');
        }).then(description => ticket.setDescription(description));

        if (options.savepath) {
            options.savepath = options.savepath.replace('/\\/g', '/');
            let lastPathSlash = options.savepath.lastIndexOf('/');
            let dir = options.savepath.substring(0, lastPathSlash);
            if (!fs.existsSync(dir)) {
                mkdirp.sync(dir);
            }
            fs.appendFile(options.savepath, ticket.getDescription(), (err) => {
                if (err) throw err;
            });
            console.log(ticketID + ' saved.');
        }

        _tickets[ticketID] = ticket;
        return ticket;
    };

    this.getTicketTitle = (ticketID) => ticketID ? _title[ticketID] : _title;
    this.getTicketDescription = (ticketID) => ticketID ? _description[ticketID] : _description;

    this.close = async () => {
        await puppeteer().closeBrowser();
    };
}

function TracTicket() {
    let _title, _description;
    let _comments = [];
    this.getTitle = () => _title;
    this.getDescription = () => _description;
    this.getComment = (commentID) => commentID ? _comments[commentID] : _comments;

    this.setTitle = (title) => {
        _title = title;
    };

    this.setDescription = (description) => {
        _description = description;
    };

    this.setComment = (index, comment) => {
        _comments[index] = comment;
    };
}

function PuppeteerSingleton() {
    let _browser, _page;
    this.getBrowser = async () => {
        if (_browser === undefined) {
            _browser = await puppeteer.launch({
                headless: true
            });
        }
        return _browser;
    };
    this.getPage = async () => {
        if (_page === undefined) {
            _page = await this.getBrowser().then(async (b) => {
                return await b.newPage();
            });
            // https://github.com/GoogleChrome/puppeteer/issues/1913#issuecomment-361224733
            await _page.setRequestInterception(true);
            _page.on('request', (request) => {
                if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
                    request.abort();
                } else {
                    request.continue();
                }
            });
        }
        return _page;
    };
    this.closeBrowser = async () => {
        if (_browser) {
            await _browser.close();
        }
    };
}

module.exports = new TracKit;