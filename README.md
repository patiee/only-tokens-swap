# 1inch Swap App

A React application for swapping tokens across multiple blockchain networks using the 1inch API.

## Features

- **Multi-Network Support**: Swap tokens across Ethereum, Polygon, BSC, Arbitrum, Optimism, Base, and Avalanche
- **Token Selection**: Choose from a wide range of tokens on each network
- **Real-time Quotes**: Get instant swap quotes with best rates
- **Cross-Chain Swaps**: Execute swaps between different networks
- **Modern UI**: Beautiful, responsive interface with smooth animations

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- 1inch API key (get one at [https://portal.1inch.dev/](https://portal.1inch.dev/))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 1inch-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up your API key:
   - Create a `.env` file in the root directory
   - Add your 1inch API key:
   ```
   VITE_1INCH_API_KEY=your_api_key_here
   ```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Building for Production

Build the app for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## API Configuration

### Getting a 1inch API Key

1. Visit [https://portal.1inch.dev/](https://portal.1inch.dev/)
2. Sign up for an account
3. Create a new project
4. Copy your API key
5. Add it to your `.env` file

### Supported Networks

The app supports the following networks:
- Ethereum (Chain ID: 1)
- Polygon (Chain ID: 137)
- BNB Smart Chain (Chain ID: 56)
- Arbitrum One (Chain ID: 42161)
- Optimism (Chain ID: 10)
- Base (Chain ID: 8453)
- Avalanche C-Chain (Chain ID: 43114)

## Usage

1. **Select Source Network**: Choose the network you want to swap from
2. **Select Source Token**: Choose the token you want to swap
3. **Select Destination Network**: Choose the network you want to swap to
4. **Select Destination Token**: Choose the token you want to receive
5. **Enter Amount**: Input the amount you want to swap
6. **Execute Swap**: Click the "Swap" button to execute the transaction

## API Endpoints Used

- `GET /swap/v6.0/supported-chains` - Get supported networks
- `GET /swap/v6.0/tokens` - Get tokens for a specific network
- `GET /swap/v6.0/quote` - Get swap quote
- `POST /swap/v6.0/swap` - Execute swap transaction

## Project Structure

```
src/
├── api/
│   └── 1inch.js          # 1inch API integration
├── App.jsx               # Main application component
├── main.jsx              # React entry point
└── index.css             # Global styles
```

## Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **1inch API** - Token swapping functionality
- **CSS3** - Styling with modern features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License

## Disclaimer

This is a demo application. For production use, ensure proper security measures, error handling, and wallet integration. Always test with small amounts first.

## Support

For issues related to:
- **1inch API**: Contact 1inch support
- **Application**: Open an issue in this repository 