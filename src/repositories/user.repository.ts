import { CreateUserInput, User } from "../types/types";

export const createUser = async (input: CreateUserInput): Promise<User> => {
   throw new Error("Not implemented yet");
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
   throw new Error("Not implemented yet");
};
