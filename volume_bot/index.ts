import {
  NATIVE_MINT,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  VersionedTransaction,
  TransactionInstruction,
  TransactionMessage,
  ComputeBudgetProgram,
  Transaction
} from '@solana/web3.js'
import {
  ADDITIONAL_FEE,
  IS_RANDOM,
  RPC_ENDPOINT,
  RPC_WEBSOCKET_ENDPOINT,
  TOKEN_MINT,
} from './constants'
import { Data, editJson, readJson, saveDataToFile, sleep } from './utils'
import base58 from 'bs58'
import { getBuyTx, getSellTx } from './utils/swapOnlyAmm'
import { execute } from './executor/legacy'
import { bundle } from './executor/jito'
import { getPoolKeys } from './utils/getPoolInfo'
import { SWAP_ROUTING } from './constants'

export const solanaConnection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
})

let quoteVault: PublicKey | null = null
let vaultAmount: number = 0
let poolId: PublicKey
let poolKeys = null
let sold: number = 0
let bought: number = 0
let totalSolPut: number = 0
let changeAmount = 0
let buyNum = 0
let sellNum = 0


export const startVolumeBot = async (initialData: any) => {
  console.log("-----initialData---", initialData)

  const DISTRIBUTION_AMOUNT = initialData.distributionAmount
  const BUY_AMOUNT = initialData.distributionAmount
  const BUY_UPPER_AMOUNT = initialData.buyUpperAmount
  const BUY_LOWER_AMOUNT = initialData.buyLowerAmount
  const BUY_INTERVAL_MIN = initialData.buyInternalMin
  const BUY_INTERVAL_MAX = initialData.buyInternalMax
  const SELL_ALL_BY_TIMES = initialData.sellAllByTimes
  const DISTRIBUTE_WALLET_NUM = initialData.distributeWalletNum
  const baseMint = new PublicKey(initialData.tokenAddr)

  const PRIVATE_KEY = initialData.privateKey
  const mainKp = Keypair.fromSecretKey(new Uint8Array(PRIVATE_KEY.split(',').map(Number)))

  const distritbutionNum = DISTRIBUTE_WALLET_NUM > 10 ? 10 : DISTRIBUTE_WALLET_NUM
  const solBalance = (await solanaConnection.getBalance(mainKp.publicKey)) / LAMPORTS_PER_SOL
  console.log(`Volume bot is running`)
  console.log(`Wallet address: ${mainKp.publicKey.toBase58()}`)
  console.log(`Pool token mint: ${baseMint.toBase58()}`)
  console.log(`Wallet SOL balance: ${solBalance.toFixed(3)}SOL`)
  console.log(`Buying interval max: ${BUY_INTERVAL_MAX}ms`)
  console.log(`Buying interval min: ${BUY_INTERVAL_MIN}ms`)
  console.log(`Buy upper limit amount: ${BUY_UPPER_AMOUNT}SOL`)
  console.log(`Buy lower limit amount: ${BUY_LOWER_AMOUNT}SOL`)
  console.log(`Distribute SOL to ${distritbutionNum} wallets`)

  if (SWAP_ROUTING) {
    console.log("Buy and sell with jupiter swap v6 routing")
  } else {
    poolKeys = await getPoolKeys(solanaConnection, baseMint)
    if (poolKeys == null) {
      return
    }
    // poolKeys = await PoolKeys.fetchPoolKeyInfo(solanaConnection, baseMint, NATIVE_MINT)
    poolId = new PublicKey(poolKeys.id)
    quoteVault = new PublicKey(poolKeys.quoteVault)
    console.log(`Successfully fetched pool info`)
    console.log(`Pool id: ${poolId.toBase58()}`)
  }


  let data: {
    kp: Keypair;
    buyAmount: number;
  }[] | null = null

  if (solBalance < (BUY_LOWER_AMOUNT + ADDITIONAL_FEE) * distritbutionNum) {
    console.log("Sol balance is not enough for distribution")
  }

  data = await distributeSol(mainKp, distritbutionNum, DISTRIBUTION_AMOUNT, BUY_UPPER_AMOUNT)
  if (data === null) {
    console.log("Distribution failed")
    return
  }

  data.map(async ({ kp }, i) => {
    await sleep((BUY_INTERVAL_MAX + BUY_INTERVAL_MIN) * i / 2)
    while (true) {
      // buy part
      const BUY_INTERVAL = Math.round(Math.random() * (BUY_INTERVAL_MAX - BUY_INTERVAL_MIN) + BUY_INTERVAL_MIN)

      const solBalance = await solanaConnection.getBalance(kp.publicKey) / LAMPORTS_PER_SOL

      let buyAmount: number
      if (IS_RANDOM)
        buyAmount = Number((Math.random() * (BUY_UPPER_AMOUNT - BUY_LOWER_AMOUNT) + BUY_LOWER_AMOUNT).toFixed(6))
      else
        buyAmount = BUY_AMOUNT

      if (solBalance < ADDITIONAL_FEE) {
        console.log("Balance is not enough: ", solBalance, "SOL")
        return
      }

      // try buying until success
      let i = 0
      while (true) {
        if (i > 10) {
          console.log("Error in buy transaction")
          return
        }

        const result = await buy(kp, baseMint, buyAmount, poolId)
        if (result) {
          break
        } else {
          i++
          console.log("Buy failed, try again")
          await sleep(2000)
        }
      }

      await sleep(3000)

      // try selling until success
      let j = 0
      while (true) {
        if (j > 10) {
          console.log("Error in sell transaction")
          return
        }
        const result = await sell(poolId, baseMint, kp)
        if (result) {
          break
        } else {
          j++
          console.log("Sell failed, try again")
          await sleep(2000)
        }
      }
      await sleep(5000 + distritbutionNum * BUY_INTERVAL)
    }
  })
}

const distributeSol = async (mainKp: Keypair, distritbutionNum: number, DISTRIBUTION_AMOUNT: number, BUY_UPPER_AMOUNT: number) => {
  //TODO
}


const buy = async (newWallet: Keypair, baseMint: PublicKey, buyAmount: number, poolId: PublicKey) => {
  //TODO
}

const sell = async (poolId: PublicKey, baseMint: PublicKey, wallet: Keypair) => {
  try {
    //TODO
  } catch (error) {
    return null
  }
}
