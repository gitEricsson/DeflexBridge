import axios from 'axios';
import winston from 'winston';

// Winston logging setup
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console(),
    ],
});

export class WebhookService {
    async sendWebhookNotification(url: string, data: object) {
        try {
            await axios.post(url, data);
        } catch (error) {
            logger.error(`Error sending webhook notification: ${error.message}`);
        }
    }
}
