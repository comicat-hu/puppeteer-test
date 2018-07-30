const tracKit = require('./tracKit');

async function main() {
    // TODO
    tracKit.setWebRoot('');
    tracKit.setUsername('');
    tracKit.setPassword('');
    
    let ticketIDs = [4080,7079,4111,4081];
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