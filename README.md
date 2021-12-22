# snowbank-anti-scammer

A bot to fight against scammers.

## How does it work?

Every time a new member joins, it temporarily assigns a score to them, checking for typical signs of scammers.
(By default) any new user with a score of or above 3 is automatically banned, and the instance gets logged.

### Suspicious signs

- Username contains a moderator's username +2
- Username contains the word "Snowbank" +1
- Username contains either "Official", "Admin", "Support", "DAO", "Labs", "Announce" or "Moderator" +1
- User account was made less than a week ago +1

## Setup & Installation

### Development

```bash
git clone https://github.com/cybertelx/snowbank-anti-scammer.git # Clone this repository to your local machine
cd snowbank-anti-scammer # Enter the repo
npm install # Install dependencies
npm run dev # Run the bot
```

The bot works out-of-the-box, just add your own token!
(Change .env.EXAMPLE to .env)

### Compile

```bash
npm i
npm run build
```
