const tracKit = require('./TracKit');
const config = require('./config.json')

async function main() {
    tracKit.setWebRoot(config.webRoot);
    tracKit.setUsername(config.username);
    tracKit.setPassword(config.password);
    
    let ticketIDs = config.ticketIDs;
    for (let ticketID of ticketIDs) {
        // return TracTicket
        await tracKit.downloadTicket(ticketID, {
            savepath: `${__dirname}/ticket-save/${ticketID}.md`,
            comments: true
        })
        .catch(err => console.log(`[Download #${ticketID} Failed] ${err}`));
    }

    await tracKit.close();
}

main()
.catch(err => console.log(err));