# TracKit

Download trac ticket (title, description, comments)

Close trac ticket (set resolve: fixed)

Example:
* run `npm install` on nodejs v8+
* cp config.example.json config.json
* set webRoot, username, password of trac
* run `node main.js`

Api:
* TracKit.downloadTicket
    ```js
    options = {
        savepath: 'save/to/path/filename',
        comments: true, // dowanload comments
    }
    TracKit.downloadTicket(ticketID, options)
    ```
* TracKit.getTicket
    ```js
    ticket = TracKit.getTicket(ticketID)
    ticket.getTitle()
    ticket.getDescription()
    ticket.getComment()
    ```
* TracKit.closeTicket
    ```js
    TracKit.closeTicket(ticketID)
    ```
