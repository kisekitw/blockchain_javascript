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
    res.json({
        note: `Transaction will be added in block ${blockIndex}.`
    });
});

app.post('/transaction/broadcast', (req, res) => {
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);

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
            res.json({
                note: 'Transaction created and broadcast successfully.'
            });
        });

});

app.get('/mine', (req, res) => {

    // TODO: Reward miner
    // bitcoin.createNewTransaction(12.5, "00", nodeAddress);

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

    // TODO: synchrous 
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: {
                newBlock: newBlock
            },
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
        .then(data => {

            // TODO: when a new transaction is created, the mining rewards transaction code
            const requestOptions = {
                uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
                method: 'POST',
                body: {
                    amount: 12.5,
                    sender: "00",
                    recipient: nodeAddress
                },
                json: true
            };

            return rp(requestOptions);
        })
        .then(data => {
            res.json({
                note: "New block mined & broadcast successfully",
                block: newBlock
            });
        });
});

app.post('/receive-new-block', (req, res) => {
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();

    // TODO: 驗證目前區塊的previousBlockHash是否與最後一個區塊的Hash相等, 確保區塊順序
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;

    // TODO: 驗證索引值是否也正確
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    if (correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({
            note: 'New block received and accepted.',
            newBlock: newBlock
        });
    } else {
        res.json({
            note: 'New block rejected.',
            newBlock: newBlock
        });
    }
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

app.get('/consensus', (req, res) => {
    const requestPromises = [];
    // TODO: 取得其他節點的chain
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        }

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
        .then(blockchains => {
            const currentChainLength = bitcoin.chain.length;
            let maxChainLength = currentChainLength;
            let newLongestChain = null;
            let newPendingTransactions = null;


            // TODO: 找出目前網路中的最長chain, length, transactions
            blockchains.forEach(blockchain => {
                if (blockchain.chain.length > maxChainLength) {
                    maxChainLength = blockchain.chain.length;
                    newLongestChain = blockchain.chain;
                    newPendingTransactions = blockchain.pendingTransactions;
                };
            });

            // TODO: 驗證最長chain裡面的block是否合法
            if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
                res.json({
                    note: 'Current chain has not been replaced.',
                    chain: bitcoin.chain
                });
            } else {
                bitcoin.chain = newLongestChain;
                bitcoin.pendingTransactions = newPendingTransactions;
                res.json({
                    note: 'This chain has been replaced.',
                    chain: bitcoin.chain
                });
            }
        });
});

const port = process.argv[2];

app.listen(port, () => {
    console.log('listening on port', port);
});

const bitcoin = new Blockchain();
const nodeAddress = uuid().split('-').join('');