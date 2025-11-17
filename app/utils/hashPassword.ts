import * as Crypto from "expo-crypto";

export const hashPassword = async (password: string) => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
};
