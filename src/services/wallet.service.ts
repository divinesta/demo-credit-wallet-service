import { db } from "../database/knex";
import { createTransaction } from "../repositories/transaction.repository";
import { findWalletByUserId, increaseWalletBalance, decreaseWalletBalance } from "../repositories/wallet.repository";
import { AppError } from "../utils/app-error";


export const getCurrentUserWallet = async (userId: number) => {
   const wallet = await findWalletByUserId(userId);

   if (!wallet) {
      throw new AppError(404, "Wallet not found");
   }

   return wallet;
};

export const fundWallet = async (userId: number, amount: number) => {
   return db.transaction(async (trx) => {
      const wallet = await findWalletByUserId(userId, trx);

      if (!wallet) {
         throw new AppError(404, "Wallet not found");
      }

      await increaseWalletBalance(wallet.id, amount, trx);

      await createTransaction(
         {
            walletId: wallet.id,
            type: "funding",
            amount,
            reference: `funding-${Date.now()}-${wallet.id}`,
            narration: "Wallet funding"
         },
         trx
      );

      return {
         walletId: wallet.id,
         userId: wallet.userId,
         newBalance: wallet.balance + amount,
      }
   });
};

export const withdrawWallet = async (userId: number, amount: number) => {
   return db.transaction(async (trx) => {
      const wallet = await findWalletByUserId(userId, trx);

      if (!wallet) {
         throw new AppError(404, "Wallet not found");
      }

      if (wallet.balance < amount) {
         throw new AppError(400, "Insufficient wallet balance");
      }

      await decreaseWalletBalance(wallet.id, amount, trx);

      await createTransaction(
         {
            walletId: wallet.id,
            type: "withdrawal",
            amount,
            reference: `withdrawal-${Date.now()}-${wallet.id}`,
            narration: "Wallet withdrawal",
         },
         trx
      );

      return {
         walletId: wallet.id,
         userId: wallet.userId,
         newBalance: wallet.balance - amount,
      }
   });
};

export const transferWallet = async (
   senderUserId: number,
   receiverUserId: number,
   amount: number
) => {
   return db.transaction(async (trx) => {
      
      const senderWallet = await findWalletByUserId(senderUserId, trx);
      const receiverWallet = await findWalletByUserId(receiverUserId, trx);

      if (!senderWallet) {
         throw new AppError(404, "Sender wallet not found");
      }

      if (!receiverWallet) {
         throw new AppError(404, "Receiver wallet not found");
      }
      
      if (senderWallet.id === receiverWallet.id) {
         throw new AppError(400, "Cannot transfer to the same wallet");
      }
      
      if (senderWallet.balance < amount) {
         throw new AppError(400, "Insufficient wallet balance");
      }
      
      await decreaseWalletBalance(senderWallet.id, amount, trx);
      await increaseWalletBalance(receiverWallet.id, amount, trx);

      const reference = `transfer-${Date.now()}-${senderWallet.id}-${receiverWallet.id}`;

      await createTransaction(
         {
            walletId: senderWallet.id,
            relatedWalletId: receiverWallet.id,
            type: "transfer_debit",
            amount,
            reference: `${reference}-debit`,
            narration: "Wallet transfer debit",
         },
         trx
      );

      await createTransaction(
         {
            walletId: receiverWallet.id,
            relatedWalletId: senderWallet.id,
            type: "transfer_credit",
            amount,
            reference: `${reference}-credit`,
            narration: "Wallet transfer credit"
         },
         trx
      );

      return {
         senderWalletId: senderWallet.id,
         receiverWalletId: receiverWallet.id,
         amount,
         senderNewBalance: senderWallet.balance - amount,
      }
   });
};
