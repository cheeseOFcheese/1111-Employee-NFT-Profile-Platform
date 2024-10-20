
from web3 import Web3
from config import INFURA_URL, CONTRACT_ABI, CONTRACT_ADDRESS

# Подключение к Infura через Web3
web3 = Web3(Web3.HTTPProvider(INFURA_URL))

# Проверка, развернут ли контракт
if CONTRACT_ADDRESS:
    contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
else:
    contract = None

def deploy_contract(from_address, private_key):
    compiled_contract = {
        'abi': CONTRACT_ABI,
        'bytecode': '0x600160005560006000fd00'  # Замените на байт-код вашего контракта
    }

    nonce = web3.eth.getTransactionCount(from_address)
    
    transaction = web3.eth.contract(abi=compiled_contract['abi'], bytecode=compiled_contract['bytecode']).constructor().buildTransaction({
        'chainId': 4,  # Rinkeby
        'gas': 2000000,
        'gasPrice': web3.toWei('20', 'gwei'),
        'nonce': nonce
    })

    signed_txn = web3.eth.account.signTransaction(transaction, private_key=private_key)

    tx_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
    tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)

    # Обновляем адрес контракта
    new_contract_address = tx_receipt.contractAddress
    update_contract_address(new_contract_address)

    global contract
    contract = web3.eth.contract(address=new_contract_address, abi=compiled_contract['abi'])

    return new_contract_address

def mint_nft(recipient_address, token_uri, from_address, private_key):
    nonce = web3.eth.getTransactionCount(from_address)

    transaction = contract.functions.mintNFT(recipient_address, token_uri).buildTransaction({
        'chainId': 4,  # Rinkeby
        'gas': 2000000,
        'gasPrice': web3.toWei('20', 'gwei'),
        'nonce': nonce
    })

    signed_txn = web3.eth.account.signTransaction(transaction, private_key=private_key)

    tx_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)

    return web3.eth.waitForTransactionReceipt(tx_hash)

def update_contract_address(new_address):
    """Функция для обновления адреса контракта в config.py."""
    with open('config.py', 'r') as file:
        config_data = file.read()

    config_data = config_data.replace(f"CONTRACT_ADDRESS = '{CONTRACT_ADDRESS}'", f"CONTRACT_ADDRESS = '{new_address}'")

    with open('config.py', 'w') as file:
        file.write(config_data)
