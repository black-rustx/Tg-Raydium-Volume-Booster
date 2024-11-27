import { PublicKey } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export const validatorAddr = (privateKey: string) => {
    try {
        const walletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
        return walletKeypair.publicKey.toString();
    } catch (e) {
        return ''
    }
}

export const validatorPubkey = (pupbkey: string) => {
    try {
        new PublicKey(pupbkey)
        return true
    } catch (e) {
        return false
    }
}

export const waitFor = (delay: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, delay));
};
