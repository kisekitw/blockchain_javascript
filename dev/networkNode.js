const Blockchain = require('./blockchain');

const uuid = require('uuid/v1');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/blockchain', (req, res) => {
    res.send(bitcoin);
});

app.post('/transaction', (req, res) => {
    const blockIndex = bitcoin.createNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient
        );
    
    res.json({ note:`Transaction will be added in block ${blockIndex}.`});
});

app.get('/mine', (req, res) => {

    // TODO: Reward miner
    bitcoin.createNewTransaction(12.5, "00", nodeAddress);

    // TODO: Get previous block hash string
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];

    // TODO: Define current block data
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1,
    };

    // TODO: Get a nonce(Mining)
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);

    // TODO: Create a new block hash string
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    // TODO: Create a new block
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    

    res.json({
        note: "New block mined successfully",
        block: newBlock
      });
});

const port = process.argv[2]; 
app.listen(port, () => {
    console.log('listening on port', port);
});

const bitcoin = new Blockchain();
const nodeAddress = uuid().split('-').join('');