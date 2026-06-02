import type { Knex } from "knex";

export type DatabaseClient = Knex | Knex.Transaction;

export type User = {
   id: number;
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   bvn: string;
   createdAt: Date;
   updatedAt: Date;
};

export type CreateUserInput = {
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   bvn: string;
};

export type Wallet = {
   id: number;
   userId: number;
   balance: number;
   createdAt: Date;
   updatedAt: Date;
};

export type TransactionType = "funding" | "withdrawal" | "transfer_debit" | "transfer_credit";

export type TransactionStatus = "successful" | "failed";

export type WalletTransaction = {
   id: number;
   walletId: number;
   relatedWalletId: number | null;
   type: TransactionType;
   amount: number;
   reference: string;
   status: TransactionStatus;
   narration: string | null;
   createdAt: Date;
   updatedAt: Date;
};

export type KarmaCheckInput = {
   email: string;
   phone: string;
   bvn: string;
};

export type KarmaCheckResult = {
   isBlacklisted: boolean;
};

// Database row types (if needed for direct DB interactions)
export type UserRow = {
   id: number;
   first_name: string;
   last_name: string;
   email: string;
   phone: string;
   bvn: string;
   created_at: Date;
   updated_at: Date;
};

export type WalletRow = {
   id: number;
   user_id: number;
   balance: number;
   created_at: Date;
   updated_at: Date;
};