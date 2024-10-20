
# Blockchain API Project

This project provides a blockchain backend API for interacting with smart contracts on the Ethereum network.

## Features

- Deploy ERC721 and ERC20 smart contracts
- Mint NFT tokens on deployed contracts
- Dynamic contract selection based on the type sent by frontend

## API Endpoints

### 1. Deploy Smart Contract

**Endpoint:** `POST /deploy`

**Description:** Deploys a smart contract based on the contract type provided.

**Request Body:**
```json
{
  "contract_type": "ERC721",  // or "ERC20"
  "from_address": "0xYourAddress",
  "private_key": "your_private_key"
}
```

**Response:**
```json
{
  "contract_address": "0xContractAddress"
}
```

### 2. Mint NFT

**Endpoint:** `POST /mint`

**Description:** Mints a new NFT on an existing contract.

**Request Body:**
```json
{
  "contract_address": "0xContractAddress",
  "recipient_address": "0xRecipientAddress",
  "token_uri": "ipfs://token_metadata_uri",
  "from_address": "0xYourAddress",
  "private_key": "your_private_key"
}
```

**Response:**
```json
{
  "transaction_receipt": "0xTransactionHash"
}
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your/repo.git
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables or modify `config.py` with your Infura API key, local IP, and other settings.

4. Run the Flask application:
   ```bash
   python app.py
   ```

## Frontend Integration

You can use Axios or Fetch to interact with the API from a frontend application. Here's an example of how to deploy a contract and mint an NFT using Axios:

### Deploy Contract Example:
```javascript
axios.post('/deploy', {
  contract_type: 'ERC721',
  from_address: '0xYourAddress',
  private_key: 'your_private_key'
}).then(response => {
  console.log('Contract deployed at:', response.data.contract_address);
}).catch(error => {
  console.error('Error deploying contract:', error);
});
```

### Mint NFT Example:
```javascript
axios.post('/mint', {
  contract_address: '0xContractAddress',
  recipient_address: '0xRecipientAddress',
  token_uri: 'ipfs://token_metadata_uri',
  from_address: '0xYourAddress',
  private_key: 'your_private_key'
}).then(response => {
  console.log('NFT minted:', response.data.transaction_receipt);
}).catch(error => {
  console.error('Error minting NFT:', error);
});
```

## Security Considerations

- **Private Key**: Ensure that private keys are never exposed on the frontend. Use secure vaults or encrypted storage for sensitive data.
- **HTTPS**: Make sure the API is hosted over HTTPS to ensure data privacy and security during transmission.
- **Validation**: The backend API includes validation for Ethereum addresses and checks for required fields. Ensure that all inputs are sanitized and validated before processing.
