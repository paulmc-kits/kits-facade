const pino = require('pino')

module.exports = pino(
    {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'SYS:standard',
                levelFirst: true,
                colorize: true,
                ignore: 'pid,hostname'
            }
        }
    }
)