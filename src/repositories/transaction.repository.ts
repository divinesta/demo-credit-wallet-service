import { DatabaseClient, TransactionType } from "../utils/types";

type CreateTransactionInput = {
   walletId: number;
   relatedWalletId?: number | null;
   type: TransactionType;
   amount: number;
   reference: string;
   narration?: string | null;
};

export const createTransaction = async (
   input: CreateTransactionInput,
   database: DatabaseClient
): Promise<void> => {
   await database("transactions").insert({
      wallet_id: input.walletId,
      related_wallet_id: input.relatedWalletId ?? null,
      type: input.type,
      amount: input.amount,
      reference: input.reference,
      narration: input.narration ?? null,
      status: "successful",
   });
}