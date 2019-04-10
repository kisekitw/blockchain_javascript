const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

const bc1 = {
    "chain": [{
        "index": 1,
        "timestamp": 1554873288844,
        "transactions": [],
        "nonce": 100,
        "hash": "0",
        "previousBlockHash": "0"
    }, {
        "index": 2,
        "timestamp": 1554873319713,
        "transactions": [],
        "nonce": 18140,
        "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
        "previousBlockHash": "0"
    }, {
        "index": 3,
        "timestamp": 1554873359444,
        "transactions": [{
            "amount": 12.5,
            "sender": "00",
            "recipient": "90071cc05b4f11e9a0e40f401ecdc6e9",
            "transactionId": "a26fca105b4f11e9a0e40f401ecdc6e9"
        }, {
            "amount": 100,
            "sender": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "recipient": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "transactionId": "b638f1c05b4f11e9a0e40f401ecdc6e9"
        }],
        "nonce": 77225,
        "hash": "0000896eb97889fd83bce91b8160cd4e27e5227c1f7f259c62020bef25553d05",
        "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    }, {
        "index": 4,
        "timestamp": 1554873450207,
        "transactions": [{
            "amount": 12.5,
            "sender": "00",
            "recipient": "90071cc05b4f11e9a0e40f401ecdc6e9",
            "transactionId": "ba1bf8505b4f11e9a0e40f401ecdc6e9"
        }, {
            "amount": 40,
            "sender": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "recipient": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "transactionId": "def9fd205b4f11e9a0e40f401ecdc6e9"
        }, {
            "amount": 50,
            "sender": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "recipient": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "transactionId": "e1d8b3105b4f11e9a0e40f401ecdc6e9"
        }, {
            "amount": 60,
            "sender": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "recipient": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "transactionId": "e421b8b05b4f11e9a0e40f401ecdc6e9"
        }],
        "nonce": 6872,
        "hash": "0000463d049ed32c1e609b225f363f4cf597d88996b70651fe7bbdc925931170",
        "previousBlockHash": "0000896eb97889fd83bce91b8160cd4e27e5227c1f7f259c62020bef25553d05"
    }],
    "pendingTransactions": [{
        "amount": 12.5,
        "sender": "00",
        "recipient": "90071cc05b4f11e9a0e40f401ecdc6e9",
        "transactionId": "f0354e005b4f11e9a0e40f401ecdc6e9"
    }],
    "currentNodeUrl": "http://localhost:3031",
    "networkNodes": []
};


console.log('VALID:' , bitcoin.chainIsValid(bc1.chain));

//bitcoin.createNewTransaction('500', 'aaa', 'bbb');

// const previousBlockHash = '87765DA6CCF0668238C1D27C35692E11';

// const currentBlockData = [
//     {
//         amount: 101,
//         sender: 'B4CEE9C0E5CD571',
//         recipient: '3A3F6E462D48E9',  
//     },
//     {
//         amount: 30,
//         sender: 'B4CEE9C0E5CD572',
//         recipient: '3A3F6E462D48E8',  
//     },
//     {
//         amount: 10,
//         sender: 'B4CEE9C0E5CD573',
//         recipient: '3A3F6E462D48E7',  
//     }  
// ]

// const nonce = 100;

// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 31917));
// console.log(bitcoin);