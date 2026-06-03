import { db } from "../database/knex";
import { DatabaseClient, Wallet, WalletRow } from "../utils/types";

const mapWalletRowToWallet = (row: WalletRow): Wallet => ({
   id: row.id,
   userId: row.user_id,
   balance: Number(row.balance),
   createdAt: row.created_at,
   updatedAt: row.updated_at,
});

export const createWalletForUser = async (userId: number, database: DatabaseClient = db): Promise<Wallet> => {
   const [id] = await database<WalletRow>("wallets").insert({
      user_id: userId,
      balance: 0,
   });

   const createdWallet = await database<WalletRow>("wallets").where({ id }).first();

   if (!createdWallet) {
      throw new Error("Wallet creation failed");
   }

   return mapWalletRowToWallet(createdWallet);
};

export const fundWalletByUserId = async (
   userId: number, 
   database: DatabaseClient = db
): Promise<Wallet | null> => {
   const wallet = await database<WalletRow>("wallets").where({ user_id: userId }).first();

   return wallet ? mapWalletRowToWallet(wallet) : null;
};

export const increaseWalletBalance = async (
   walletId: number, 
   amount: number, 
   database: DatabaseClient = db
): Promise<void> => {
   await database<WalletRow>("wallets")
      .where({ id: walletId })
      .increment("balance", amount);
};