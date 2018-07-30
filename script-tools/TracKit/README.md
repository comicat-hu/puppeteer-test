# TracKit

Download trac ticket (title, description, comments)

Example:
* run `npm install` on nodejs v8+
* set webroot(host), username, password of trac
* run `node main.js`

Api:
* TracKit.downloadTicket
    ```
    options = {
        savepath: 'save/to/path/filename',
        comments: true, // dowanload comments
    }
    TracKit.downloadTicket(ticketID, options)
    ```
* TracKit.getTicket
    ```
    ticket = TracKit.getTicket(ticketID)
    ticket.getTitle()
    ticket.getDescription()
    ticket.getComment()
    ```
