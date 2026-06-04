import { CreateUserInput, DatabaseClient, User, UserRow } from "../utils/types";

import { db } from "../database/knex";

const mapUserRowToUser = (row: UserRow): User => ({
   id: row.id,
   firstName: row.first_name,
   lastName: row.last_name,
   email: row.email,
   phone: row.phone,
   bvn: row.bvn,
   createdAt: row.created_at,
   updatedAt: row.updated_at,
});

export const createUser = async (input: CreateUserInput, database: DatabaseClient = db): Promise<User> => {
   const [id] = await database<UserRow>("users").insert({
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone: input.phone,
      bvn: input.bvn,
   });

   const createdUser = await database<UserRow>("users").where({ id }).first();

   if (!createdUser) {
      throw new Error("User creation failed");
   }

   return mapUserRowToUser(createdUser);
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
   const row = await db<UserRow>("users").where({ email }).first();

   if (!row) {
      return null;
   }

   return mapUserRowToUser(row);
};

export const findUserByEmailPhoneOrBvn = async (input: Pick<CreateUserInput, "email" | "phone" | "bvn">): Promise<User | null> => {
   const row = await db<UserRow>("users")
      .where({ email: input.email })
      .orWhere({ phone: input.phone })
      .orWhere({ bvn: input.bvn })
      .first();

   if (!row) {
      return null;
   }

   return mapUserRowToUser(row);
};
