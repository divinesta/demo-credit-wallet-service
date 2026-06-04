import { db } from "../database/knex";
import { createTransaction } from "../repositories/transaction.repository";
import { findWalletByUserId, increaseWalletBalance, decreaseWalletBalance } from "../repositories/wallet.repository";

export const fundWallet = async (userId: number, amount: number) => {
   return db.transaction(async (trx) => {
      const wallet = await findWalletByUserId(userId, trx);

      if (!wallet) {
      throw new Error("Wallet not found");
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
         throw new Error("Wallet not found");
      }

      if (wallet.balance < amount) {
         throw new Error("Insufficient wallet balance");
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
}

export const transferWallet = async (
   senderUserId: number,
   receiverUserId: number,
   amount: number
) => {
   return db.transaction(async (trx) => {
      
      const sendWallet = await findWalletByUserId(senderUserId, trx);
      const receiverWallet = await findWalletByUserId(receiverUserId, trx);

      if (!sendWallet) {
         throw new Error("Sender wallet not found");
      }

      if (!receiverWallet) {
         throw new Error("Receiver wallet not found");
      }
      
      if (sendWallet.id === receiverWallet.id) {
         throw new Error("Cannot transfer to the same wallet");
      }
      
      if (sendWallet.balance <  amount) {
         throw new Error("Insufficient funds");
      }
      
      await decreaseWalletBalance(sendWallet.id, amount, trx);
      await increaseWalletBalance(receiverWallet.id, amount, trx);

      // Create transfer_debit transaction
      // Create transfer_credit transaction
      // Return new sender balance
   });
};