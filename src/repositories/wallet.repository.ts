import { db } from "../database/knex";
import { Wallet, WalletRow } from "../types/types";

const mapWalletRowToWallet = (row: WalletRow): Wallet => ({
   id: row.id,
   userId: row.user_id,
   balance: Number(row.balance),
   createdAt: row.created_at,
   updatedAt: row.updated_at,
});

export const createWalletForUser = async (userId: number): Promise<Wallet> => {
   const [id] = await db<WalletRow>('wallets').insert({
      user_id: userId,
      balance: 0,
   });

   const createdWallet = await db<WalletRow>('wallets').where({ id }).first();

   if (!createdWallet) {
      throw new Error("Wallet creation failed");
   }

   return mapWalletRowToWallet(createdWallet);
};