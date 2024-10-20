
# Конфигурация для работы с Infura
INFURA_URL = 'https://rinkeby.infura.io/v3/2a331d76bd2b438a933131551dc2c164'

# Адрес смарт-контракта обновляется автоматически при развертывании
CONTRACT_ADDRESS = ''  # Изначально пустой, обновится после развертывания

# ABI контракта (описание функций контракта)
CONTRACT_ABI = [
    {
        "constant": True,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "to",
                "type": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
