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
         newBalnce: wallet.balance - amount,
      }
   });
}