export const commandList = [
    { command: 'start', description: 'Start the bot' },
];

import { ComputeBudgetProgram, Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { ADDITIONAL_FEE, BUY_INTERVAL_MAX, BUY_INTERVAL_MIN, BUY_LOWER_AMOUNT, BUY_UPPER_AMOUNT, CONFIRM_FEE, DISTRIBUTE_WALLET_NUM, DISTRIBUTION_AMOUNT, LAMPORTS_PER_SOL, OWNER_PUBLIC_KEY, RPC_ENDPOINT, RPC_WEBSOCKET_ENDPOINT, SELL_ALL_BY_TIMES, SLIPPAGE, solanaConnection, webSite } from "../config";
import { validatorAddr } from "../utils";
import * as helper from "./helper"
import { printSupply } from "@metaplex-foundation/mpl-token-metadata";
import { startVolumeBot } from "../volume_bot";

export const welcome = async (chatId: number, username?: string) => {
    const userInfo = await helper.findOfUser(chatId, username);

    if (userInfo?.publicKey) {
        const publicKey: PublicKey = new PublicKey(userInfo?.publicKey!);
        const solAmount = (await solanaConnection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
        const title = `You are already registered in Volume Booster
    💹 Your Publickey: ${userInfo.publicKey}
    💰 Your Ballence: ${solAmount} sol`
        const content = [[{ text: '✏️ Boost Volume', callback_data: 'boostVolume' }]]

        return { title, content }
    } else {
        const title = `👨‍💻 Welcome to Radium Trading Volumn Bot!
        Experience the unique power of Radium Trading Volumn Bot, designed to attract new organic investors.
                        
        Here's How:
        🔄 Volume Generation: Continuous trading volume for 24 hours.
        📦 Package Selection: Various packages tailored to your needs.
        🚀 Multiple Transactions: Adding VolumnBots, you get up to 130tx per minute, each from a unique wallet showcasing new holders.
        🌟 Organic Trending: High transaction rates and volume naturally improve visibility on various crypto platforms.
                        
        Get Started! Reply with your adddress to receive tokens`
        const content = [[{ text: 'Boost Volume 🚀', callback_data: 'boostVolume' }]]
        return { title, content }
    }
}

export const selectOption = async (chatId: number) => {
    const title = `⚠️ You can select any options to run volume booster ⚠️`
    const content = [[{ text: 'Package 1 🚀', callback_data: 'package1' }, { text: 'Custom Option 🚈', callback_data: 'customOption' }]]
    return { title, content }
}

export const customOption = async (chatId: number, username?: string) => {
    const userData = {
        username: username,
        distributionAmount: DISTRIBUTION_AMOUNT,
        buyUpperAmount: BUY_UPPER_AMOUNT,
        buyLowerAmount: BUY_LOWER_AMOUNT,
        buyIntervalMax: BUY_INTERVAL_MAX,
        buyIntervalMin: BUY_INTERVAL_MIN,
        distributeWalletNum: DISTRIBUTE_WALLET_NUM,
        sellAllByTimes: SELL_ALL_BY_TIMES
    }
    const userInfo = await helper.findOfUser(chatId, username);

    if (userInfo) {
        const title = `Variables for Trading
    Amount of SOL to distribute to each wallet: ${userInfo.distributionAmount}
    Number of wallets to distribute SOL to: ${userInfo.distributeWalletNum}

    Upper amount for Buying per Transaction: ${userInfo.buyUpperAmount} 
    Lower amount for Buying per Transaction: ${userInfo.buyLowerAmount}

    Maximum interval between buys in milliseconds: ${userInfo.buyIntervalMax}
    Minimum interval between buys in milliseconds: ${userInfo.buyIntervalMin}

    Number of times to sell all tokens in sub-wallets gradually: ${userInfo.sellAllByTimes}
    Slipage: ${userInfo.slippage}
       `
        const content = [[{ text: 'DISTRIBUTION_AMOUNT', callback_data: 'setDistributionAmt' }, { text: 'DISTRIBUTE_WALLET_NUM', callback_data: 'setDistributionWalletNum' }],
        [{ text: 'BUY_UPPER_AMOUNT', callback_data: 'setBuyUpperAmount' }, { text: 'BUY_LOWER_AMOUNT', callback_data: 'setBuyLowerAmount' }],
        [{ text: 'BUY_INTERVAL_MAX', callback_data: 'setBuyIntervalMax' }, { text: 'BUY_INTERVAL_MIN', callback_data: 'setBuyIntervalMin' }],
        [{ text: 'SELL_ALL_BY_TIMES', callback_data: 'setSellAllByTimes' }, { text: 'SLIPPAGE', callback_data: 'setSlippage' }],
        [{ text: 'FINISH', callback_data: 'sendTokenAddr' }]]

        return { title, content };
    } else {
        const userInfo = await helper.saveInfo(chatId, userData);
        const title = `Variables for Trading
        Amount of SOL to distribute to each wallet: ${DISTRIBUTION_AMOUNT}
        Number of wallets to distribute SOL to: ${DISTRIBUTE_WALLET_NUM}

        Upper amount for Buying per Transaction: ${BUY_UPPER_AMOUNT} 
        Lower amount for Buying per Transaction: ${BUY_LOWER_AMOUNT}

        Maximum interval between buys in milliseconds: ${BUY_INTERVAL_MAX}
        Minimum interval between buys in milliseconds: ${BUY_INTERVAL_MIN}

        Number of times to sell all tokens in sub-wallets gradually: ${SELL_ALL_BY_TIMES}
        Slippage: ${SLIPPAGE}
           `
        const content = [[{ text: 'DISTRIBUTION_AMOUNT', callback_data: 'setDistributionAmt' }, { text: 'DISTRIBUTE_WALLET_NUM', callback_data: 'setDistributionWalletNum' }],
        [{ text: 'BUY_UPPER_AMOUNT', callback_data: 'setBuyUpperAmount' }, { text: 'BUY_LOWER_AMOUNT', callback_data: 'setBuyLowerAmount' }],
        [{ text: 'BUY_INTERVAL_MAX', callback_data: 'setBuyIntervalMax' }, { text: 'BUY_INTERVAL_MIN', callback_data: 'setBuyIntervalMin' }],
        [{ text: 'SELL_ALL_BY_TIMES', callback_data: 'setSellAllByTimes' }, { text: 'SLIPPAGE', callback_data: 'setSlippage' }],
        [{ text: 'FINISH', callback_data: 'sendTOkenAddr' }]]

        return { title, content };
    }

}

export const displaySettings = async (chatId: number, username?: string) => {
    const userData = {
        username: username,
        distributionAmount: DISTRIBUTION_AMOUNT,
        buyUpperAmount: BUY_UPPER_AMOUNT,
        buyLowerAmount: BUY_LOWER_AMOUNT,
        buyIntervalMax: BUY_INTERVAL_MAX,
        buyIntervalMin: BUY_INTERVAL_MIN,
        distributeWalletNum: DISTRIBUTE_WALLET_NUM,
        sellAllByTimes: SELL_ALL_BY_TIMES
    }
    const userInfo = await helper.saveInfo(chatId, userData);
    const title = `Variables for Trading
    Amount of SOL to distribute to each wallet: ${DISTRIBUTION_AMOUNT}   
    Number of wallets to distribute SOL to: ${DISTRIBUTE_WALLET_NUM}

    Upper amount for Buying per Transaction: ${BUY_UPPER_AMOUNT} 
    Lower amount for Buying per Transaction: ${BUY_LOWER_AMOUNT}
    
    Maximum interval between buys in milliseconds: ${BUY_INTERVAL_MAX}
    Minimum interval between buys in milliseconds: ${BUY_INTERVAL_MIN}
    Number of times to sell all tokens in sub-wallets gradually: ${SELL_ALL_BY_TIMES}
       `
    const content = [[{ text: ' Send Token Address 📨', callback_data: 'sendTokenAddr' }]]
    return { title, content }
}

export const sendTokenAddr = async (chatId: number, tokenAddr: String) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateTokenAddr(chatId, tokenAddr);
    const title = `💵 Token address for volume market making is set correctly: ${tokenAddr}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `Continue`, callback_data: `makeVolumeWallet` }, { text: `Reset`, callback_data: `sendTokenAddr` }]]


    return { title, content };
}
export const makeVolumeWallet = async (chatId: number, username?: string) => {
    const userData = await helper.findOfUser(chatId);
    const publicKey: PublicKey | undefined = userData?.publicKey ? new PublicKey(userData.publicKey) : undefined;
    if (publicKey) {
        const solBalance = (await solanaConnection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
        const volumeAmt = DISTRIBUTION_AMOUNT * DISTRIBUTE_WALLET_NUM * (100 + CONFIRM_FEE) / 100;
        if (solBalance >= volumeAmt) {
            const title = `Volume bot Publick Key: 
            ${publicKey}
    sol Balance in wallets: ${solBalance}
    sol amount for volume booster: ${volumeAmt}
    Your wallet Sol balance is enough for trading`
            const content = [[{ text: '🏆 OK', callback_data: 'confirmWallet' }]]
            return { title, content }
        } else {
            const depositAmt = volumeAmt - solBalance;
            const title = `Volume bot Publick Key: 
                ${publicKey}
        sol Balance in wallets: ${solBalance}
        sol amount for volume booster: ${volumeAmt}
        💹 Please Deposit ${depositAmt} sol for volume booster:`
            const content = [[{ text: '💰 Deposit Sol', callback_data: 'deposit' }]]
            return { title, content }
        }
    } else {
        const wallet = Keypair.generate();
        const newpublicKey = await helper.addWallet(chatId, wallet);
        const volumeAmt = DISTRIBUTION_AMOUNT * DISTRIBUTE_WALLET_NUM * (100 + CONFIRM_FEE) / 100;

        const title = `Volume bot Publick Key: 
            ${newpublicKey}
    💹 Please input ${volumeAmt} sol for volume booster:`
        const content = [[{ text: '💰 Deposit Sol', callback_data: 'deposit' }]]
        return { title, content }
    }
}

export const checkDeposit = async (chatId: number) => {
    const title = `Did you deposit sol for volume booster?`
    const content = [[{ text: '🏆 OK', callback_data: 'confirmWallet' }, { text: '❌ CANCEL', callback_data: 'deposit' }]]
    return { title, content }
}


export const confirmWallet = async (chatId: number) => {
    try {
        const userData = await helper.findOfUser(chatId);
        const publicKey: PublicKey | undefined = userData?.publicKey ? new PublicKey(userData.publicKey) : undefined;
        const privateKey: string = userData?.privateKey!;

        // Create a Keypair from the private key
        const keypair = Keypair.fromSecretKey(new Uint8Array(privateKey.split(',').map(Number)))
        const ownerPublicKey: PublicKey = new PublicKey(OWNER_PUBLIC_KEY);
        const minSolBalance = (BUY_LOWER_AMOUNT + ADDITIONAL_FEE) * DISTRIBUTE_WALLET_NUM;


        if (publicKey) {
            const solBalance = (await solanaConnection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
            const confirmFee = DISTRIBUTION_AMOUNT * DISTRIBUTE_WALLET_NUM * CONFIRM_FEE / 100;
            console.log(`SOL Balance: ${solBalance}`);

            if (solBalance != 0) {
                if (solBalance > minSolBalance) {
                    const sendSolTx: TransactionInstruction[] = []
                    sendSolTx.push(
                        ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 }),
                        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 250_000 })
                    )
                    sendSolTx.push(
                        SystemProgram.transfer({
                            fromPubkey: publicKey,
                            toPubkey: ownerPublicKey,
                            lamports: Math.round(confirmFee * LAMPORTS_PER_SOL)
                        })
                    )
                    const solanaConnection = new Connection(RPC_ENDPOINT, {
                        wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
                    })
                    const siTx = new Transaction().add(...sendSolTx)
                    const latestBlockhash = await solanaConnection.getLatestBlockhash()
                    siTx.feePayer = publicKey
                    siTx.recentBlockhash = latestBlockhash.blockhash
                    const messageV0 = new TransactionMessage({
                        payerKey: publicKey,
                        recentBlockhash: latestBlockhash.blockhash,
                        instructions: sendSolTx,
                    }).compileToV0Message()
                    const transaction = new VersionedTransaction(messageV0)
                    transaction.sign([keypair])

                    const simRes = (await solanaConnection.simulateTransaction(transaction))
                    console.log('remove lp sim', simRes.value.logs)

                    const signature = await solanaConnection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })

                    let i = 0;
                    while (i < 5) {
                        const confirmation = await solanaConnection.confirmTransaction(
                            {
                                signature,
                                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
                                blockhash: latestBlockhash.blockhash,
                            }
                        );

                        if (confirmation.value.err) {
                            i++;
                        } else {
                            const tokenBuyTx = signature ? `https://solscan.io/tx/${signature}` : ''
                            const volumeWalletAmount = (await solanaConnection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
                            const title = `SOL Balance: ${volumeWalletAmount}`;
                            const content = [[{ text: '🏆 Start', callback_data: 'start' }]]
                            return { title, content }
                        }
                    }

                    const title = `Retry to Confirm`;
                    const content = [[{ text: '🔁 Retry', callback_data: 'confirmWallet' }]]
                    return { title, content }

                } else {
                    const title = `SOL Balance: ${solBalance}
    You must deposit ${minSolBalance} at least for Trading. `
                    const content = [[{ text: '💰 Deposit Sol', callback_data: 'deposit' }]]
                    return { title, content }
                }
            } else {
                const title = `Retry to Confirm`;
                const content = [[{ text: '🔁 Retry', callback_data: 'confirmWallet' }]]
                return { title, content }
            }

        } else {
            console.log("Public key not found.");

            const title = `ReTry Confirm`;
            const content = [[{ text: '🔁 Retry', callback_data: 'confirmWallet' }]]
            return { title, content }
        }
    } catch (error) {
        console.error("Error confirming wallet:", error);

        const title = `An error occurred`;
        const content = [[{ text: '🔁 Retry', callback_data: 'confirmWallet' }]];
        return { title, content };
    }


}

export const setDistributionAmt = async (chatId: number, distributionAmt: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateDistributionAmt(chatId, distributionAmt);
    const title = `💵 Amount of SOL to distribute to each wallet is set correctly: ${distributionAmt} sol
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setDistributionAmt` }]]


    return { title, content };
}

export const setDistributionWalletNum = async (chatId: number, distributionWalletNum: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateDistributionWalletNum(chatId, distributionWalletNum);
    const title = `💵 Number of wallets for trading is set correctly: ${distributionWalletNum}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setDistributionWalletNum` }]]


    return { title, content };
}

export const setBuyUpperAmount = async (chatId: number, buyUpperAmount: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateBuyUpperAmount(chatId, buyUpperAmount);
    const title = `💵 Upper limit for random buy amount is set correctly: ${buyUpperAmount}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setBuyUpperAmount` }]]


    return { title, content };
}

export const setBuyLowerAmount = async (chatId: number, buyLowerAmount: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateBuyLowerAmount(chatId, buyLowerAmount);
    const title = `💵 Lower limit for random buy amount is set correctly: ${buyLowerAmount}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setBuyLowerAmount` }]]


    return { title, content };
}

export const setBuyIntervalMax = async (chatId: number, buyIntervalMax: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateBuyIntervalMax(chatId, buyIntervalMax);
    const title = `💵 Maximum interval between buys in milliseconds is set correctly: ${buyIntervalMax}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setBuyIntervalMax` }]]


    return { title, content };
}

export const setBuyIntervalMin = async (chatId: number, buyIntervalMin: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateBuyIntervalMin(chatId, buyIntervalMin);
    const title = `💵lMinimum interval between buys in milliseconds is set correctly: ${buyIntervalMin}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setBuyIntervalMlMin` }]]


    return { title, content };
}

export const setSellAllByTimes = async (chatId: number, sellAllByTimes: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateSellAllByTimes(chatId, sellAllByTimes);
    const title = `💵Number of times to sell all tokens in sub-wallets gradually is set correctly: ${sellAllByTimes}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setSellAllByTimes` }]]


    return { title, content };
}

export const setSlippage = async (chatId: number, slippage: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateSlippage(chatId, slippage);
    const title = `💵Number of times to sell all tokens in sub-wallets gradually is set correctly: ${slippage}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setSlippage` }]]


    return { title, content };
}

export const start = async (chatId: number) => {
    const userInfo = await helper.findOfUser(chatId);
    startVolumeBot(userInfo);
    const title = `💵Now Trading.....`
    const content = [[{ text: `✏️ Open In Dexscreener`, callback_data: `openDexscreener` }], [{ text: `✏️Cancel`, callback_data: `cancel` }]]


    return { title, content };
}

