from flask import Flask, jsonify, request
from blockchain import deploy_contract, mint_nft
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Эндпоинт для развертывания контракта
@app.route('/deploy', methods=['POST'])
def deploy():
    try:
        data = request.json
        from_address = data.get('from_address')
        private_key = data.get('private_key')

        if not from_address or not private_key:
            return jsonify({'error': 'Missing from_address or private_key'}), 400

        contract_address = deploy_contract(from_address, private_key)

        return jsonify({'contract_address': contract_address}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Эндпоинт для минтинга NFT
@app.route('/mint', methods=['POST'])
def mint():
    try:
        data = request.json
        recipient_address = data.get('recipient_address')
        token_uri = data.get('token_uri')
        from_address = data.get('from_address')
        private_key = data.get('private_key')

        if not all([recipient_address, token_uri, from_address, private_key]):
            return jsonify({'error': 'Missing data in request'}), 400

        receipt = mint_nft(recipient_address, token_uri, from_address, private_key)

        return jsonify({'transaction_receipt': receipt}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
