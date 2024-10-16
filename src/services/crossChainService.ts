import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/crossChain.did';
import { getCanisterId } from './../utils/canisterUtils';
import winston from 'winston';

import {WebhookService} from './webhookService'

const webhookService = new WebhookService();

// Winston logging setup
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console(),
    ],
});

export class CrossChainService {
  private actor: any;

  constructor() {
    const agent = new HttpAgent();
    this.actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: getCanisterId('crossChain'),
    });
  }

  async getTransaction(id: string) {
    return this.actor.getTransaction(id);
  }

  async createTransaction(    fromChain: string,
    toChain: string,
    fromAddress: string,
    toAddress: string,
    amount: string) {
    try {
        // Create transaction with PENDING status initially
        const transaction = await this.actor.createTransaction({ 
          fromChain,
          toChain,
          fromAddress,
          toAddress,
          amount, 
            status: 'PENDING' 
        });
        // Logging the transaction creation
        logger.info(`Transaction created with ID: ${transaction.id}`);
        return transaction;
    } catch (error) {
        logger.error(`Error creating transaction: ${error.message}`);
        throw error;
    }
}


async signTransaction(transactionId: string, signature: string, webhookUrl: string) {
  try {
    // Signing logic...
    const transaction = await this.actor.updateTransactionStatus(transactionId, signature, 'IN_PROGRESS');
    
    // Update transaction status to IN_PROGRESS
      logger.info(`Transaction with ID ${transactionId} is now in progress.`);

      // await webhookService.sendWebhookNotification(webhookUrl, {
      //     transactionId,
      //     status: 'IN_PROGRESS'
      // });

      return transaction;
  } catch (error) {
      logger.error(`Error signing transaction ${transactionId}: ${error.message}`);
      throw error;
  }
}

    async updateTransactionStatus(transactionId: string, webhookUrl: string) {
        try {
            // Execute the transaction and set the status to COMPLETED
            const transaction = await this.actor.updateTransactionStatus(transactionId, 'COMPLETED');

            logger.info(`Transaction with ID ${transactionId} has been completed.`);

          //   await webhookService.sendWebhookNotification(webhookUrl, {
          //     transactionId,
          //     status: 'COMPLETED'
          // });

            return transaction;
        } catch (error) {
            // In case of error, update the status to FAILED
            await this.actor.updateTransactionStatus(transactionId, 'FAILED');
            logger.error(`Error executing transaction ${transactionId}: ${error.message}`);
            throw error;
        }
    }
}
