# botmeter-logger

This library allows to log your bot conversations in the Botmeter analytics platform.
It is currently designed to be used with Messenger or Microsoft Botbuilder bots.

Require the bot at the beginning of the code with the supplied URL and USER_KEY parameters.

To include it in a Facebook Messenger bot, require the botmeter-logger library at the start of your code and log both the user and bot message using the botmeter.logDocument(userMessage, botMessage, callback) function.

To include it in a Microsoft Botbuilder bot, require the botmeter-logger library at the start of your code and add "bot.use(botmeter); ". This will setup the Botbuilder middleware for use with the botmeter logger.
