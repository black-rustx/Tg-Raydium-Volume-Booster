# 🚀 **Telegram Raydium Volume Bot-v1**

![Solana](https://img.shields.io/badge/Solana-362D59?style=for-the-badge&logo=solana&logoColor=white)
![Raydium](https://img.shields.io/badge/Raydium-00A9E0?style=for-the-badge&logo=raydium&logoColor=white)

This bot automates token volume generation on the **Raydium DEX** through Telegram. It uses multiple wallets to simulate organic trading volume by placing buy and sell orders with custom parameters, random delays, and slippage adjustments. It’s perfect for increasing liquidity and token market activity.

## 📚 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Code Explanation](#-code-explanation)
- [Best Practices](#-best-practices)
- [Contributing](#-contributing)
- [License](#-license)
- [💖 Support the Developer](#-support-the-developer)
- [📹 Demo Video](#-demo-video)

## 🌟 Features

- **Multiple Wallet Support**: Manage and use any number of wallets for token transactions.
- **Custom Fee & Slippage**: Customize fees and slippage according to market conditions.
- **Random Delays**: Mimics real users by adding random delays between buy and sell orders.
- **Telegram Integration**: Provides real-time bot updates and controls through Telegram.
- **Volume Generation**: Creates continuous buy and sell orders to simulate market volume.
- **Powered by Solana**: Uses Solana’s blockchain for fast, low-cost transactions.
- **Customizable Buy Limits**: Set custom minimum and maximum buy amounts per transaction.

## 🛠 Prerequisites

- Node.js (v18 or later)
- npm (v6 or later)
- A Solana wallet with enough SOL for transaction fees
- Telegram bot token
- 0.01 SOL minimum in wallet for swaps

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/RaydiumVolumeBot-v1.git
   cd RaydiumVolumeBot-v1
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the necessary details:

   ```
   MINT=your-token-mint-address
   MICROLAMPORTS=400000
   SLIPPAGE=1000
   MIN_BUY=0.0001
   MAX_BUY=0.5
   MIN_DELAY=1000
   MAX_DELAY=5000
   VOLUME_WALLETS=5
   RPC_ENDPOINT=https://your-rpc-url
   PRIVATE_KEY=[your-private-key]
   TELEGRAM_API_TOKEN=your-telegram-bot-token
   CHAT_ID=your-telegram-chat-id
   ```

4. The `.env` file includes all necessary settings for the bot. Ensure you have the correct private key and token mint address.

## 🚀 Usage

Run the bot with:

```bash
npm start
```

This will start the bot, which will execute continuous buy and sell orders on Raydium DEX. You can control the bot, get updates, and manage the volume generation process through Telegram.

### Telegram Commands

- **/start**: Start the bot and begin trading.
- **/stop**: Stop the bot from executing trades.
- **/status**: View current bot status and statistics.
- **/reset**: Reset the bot to start fresh.

## 💻 Code Explanation

The `main.js` file contains the following components:

1. **Setup and Imports**:

   - Imports necessary libraries like `@solana/web3.js` and Telegram bot API libraries.
   - Reads configuration values (RPC URL, fees, private key, etc.) from the `.env` file.

2. **Solana Connection & Wallet Initialization**:

   - **`solanaConnection`**: Connects to the Solana blockchain via the provided RPC URL.
   - **`mainKp`**: Loads the wallet using the private key stored in `.env`.

3. **Core Functions**:

   - **`distributeSol`**: Distributes SOL to multiple wallets for continued trading.
   - **`buy`**: Executes buy orders for tokens on Raydium, adjusting the amount based on wallet balances and slippage settings.
   - **`sell`**: Executes sell orders for tokens in the wallet, ensuring enough balance for trading.

4. **Telegram Integration**:

   - **`telegramBot`**: Handles communication with the Telegram bot, including sending updates and accepting commands.
   - **Commands**: Provides real-time updates on trade status, wallet balances, and bot progress.

5. **Error Handling & Logging**:

   - Logs all operations and errors to ensure smooth bot performance and quick issue resolution.

## 🏆 Best Practices

- **Versioned Transactions**: Use the latest transaction version for improved efficiency.
- **Error Handling**: Implement detailed logging to monitor the bot's performance.
- **Dynamic Slippage**: Adjust slippage dynamically based on market conditions.
- **Monitor Wallet Balances**: Ensure that wallets have sufficient funds for transactions to avoid failures.
- **Testing**: Regularly test the bot on test networks before running on the main network.

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request if you want to contribute new features or improvements. You can also open an issue for bug reports or feature requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💖 Support the Developer

If you find this bot helpful and want to support further development, consider tipping! Your contributions help keep the project active and growing.

**Solana Wallet Address:** `27uqtpRjpnDEiQ9SFJQKN2fEBQLEx3ptvJgGhV8AV83U`  
**ETH Wallet Address:** `0xd64EA7D33dd5a96A6522fc6b6621b515f5a11EE7`

Thank you for your support!  
Happy trading!

## 📞 Author

Telegram:  [@g0drlc](https://t.me/g0drlc)

---

## 📹 **Demo Video**

You can view a demonstration of how to use the **Raydium Volume Bot-v1** on Telegram below:

[![Raydium Volume Bot-v1 Demo](https://gold-improved-panda-991.mypinata.cloud/ipfs/QmT5VuuYT8fJXHCmWJjbM3rEPe7kxCW9VkR6Vm7sBL19Bd)

Click the image above to watch the video.

---

### **Adding a Video to the README**

1. **Upload the video**: If the video is hosted on a platform like YouTube or Vimeo, just use the embedded URL.
   
2. **Embed the video**: For a YouTube video, use the following Markdown syntax:
   
   ```markdown
   [![Raydium Volume Bot-v1 Demo](https://img.youtube.com/vi/your-video-id/0.jpg)](https://www.youtube.com/watch?v=your-video-id)
   ```

   Replace `your-video-id` with the ID of your YouTube video.

Alternatively, if the video is stored locally, you can upload it to your repository and use the link directly.

---

Let me know if you need further adjustments!
