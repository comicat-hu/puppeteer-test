const tracKit = require('./TracKit');
const config = require('./config.json')

async function main() {
    tracKit.setWebRoot(config.webRoot);
    tracKit.setUsername(config.username);
    tracKit.setPassword(config.password);
    
    let ticketIDs = config.ticketIDs;
    for (let ticketID of ticketIDs) {
        await tracKit.closeTicket(ticketID)
        .catch(err => console.log(`[Close #${ticketID} Failed] ${err}`));
    }

    await tracKit.close();
}

main()
.catch(err => console.log(err));