const Blockchain = require('./blockchain');

const uuid = require('uuid/v1');
const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const app = express();

app.use(bodyParser.json());

app.get('/blockchain', (req, res) => {
    res.send(bitcoin);
});

app.post('/transaction', (req, res) => {
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
    res.json({ note: `Transaction will be added in block ${blockIndex}.`});
});

app.post('/transaction/broadcast', (req, res) => {
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', newTransaction);
    bitcoin.addTransactionToPendingTransactions(newTransaction);

    // TODO: broadcast transaction
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data => {
        res.json({ note: 'Transaction created and broadcast successfully.' });
    });

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

app.post('/register-and-broadcast-node', (req, res) => {
    console.log('aaaa', req.body.newNodeUrl);
    const newNodeUrl = req.body.newNodeUrl;

    // TODO: register the new node url    
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
        bitcoin.networkNodes.push(newNodeUrl);
    }

    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: {
                newNodeUrl: newNodeUrl,
            },
            json: true,
        };

        regNodesPromises.push(rp(requestOptions));

        console.log('foreach......', regNodesPromises);
    });

    console.log('bbbbbb', [...bitcoin.networkNodes, bitcoin.currentNodeUrl]);

    Promise.all(regNodesPromises)
        .then(data => {
            console.log('ooooooooooooooo');
            const buklRegisterOptions = {
                uri: newNodeUrl + '/register-nodes-bulk',
                method: 'POST',
                body: {
                    allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
                },
                json: true
            };
            return rp(buklRegisterOptions);
        })
        .then(data => {
            res.json({
                note: 'New node registered with network successfully.'
            });
        })
        .catch(ex => {
            console.log(ex);
        });
});

app.post('/register-node', (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;

    // TODO: 驗證
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;

    if (nodeNotAlreadyPresent && notCurrentNode) {
        bitcoin.networkNodes.push(newNodeUrl);
    }

    res.json({
        note: 'New node registered successfully.'
    });
});

app.post('/register-nodes-bulk', (req, res) => {

    const allNetworkNodes = req.body.allNetworkNodes;

    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
    });

    res.json({
        note: 'Bulk registration successful.'
    });
});

const port = process.argv[2];
app.listen(port, () => {
    console.log('listening on port', port);
});

const bitcoin = new Blockchain();
const nodeAddress = uuid().split('-').join('');