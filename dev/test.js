const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

bitcoin.createNewTransaction('500', 'aaa', 'bbb');

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
console.log(bitcoin);
