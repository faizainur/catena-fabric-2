
'use strict';

const { Gateway, Wallets, Wallet } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');
const { resolve, parse } = require('path');
const upcc = require('./upcc')

const { v4: uuidv4 } = require('uuid');
const { read } = require('fs');

const channelName = 'crchannel';
const chaincodeName = 'creditcc';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, '..', '..', 'wallet');
const org1UserId = 'crccUser';

var ccp;
var caClient;
var wallet;

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

exports.initUpcc = async () => {
    try {
        ccp = buildCCPOrg1();
        caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
        wallet = await buildWallet(Wallets, walletPath);

        await enrollAdmin(caClient, wallet, mspOrg1);
        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

    } catch (error) {
		console.error(`ERROR upcc chaincode initialization : ${error}`);
    }
}

exports.getAllAssets = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const gateway = new Gateway()

            try {
                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });

                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);

                // console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
                var result = await contract.evaluateTransaction('GetAllAssets');
                // console.log(`*** Result: ${prettyJSONString(result3.toString())}`);

                // resolve(JSON.parse(result))
                if (result.length > 0) {
                    resolve(JSON.parse(result))
                } else {
                    resolve("[]")
                }
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`ERROR upcc chaincode getAllAssets : ${error}`);
            reject(error)
        }
    })
}

exports.createAsset = async (record) => {
    return new Promise(async (resolve, reject) => {
        try {

            var isExist = await upcc.isExist(record.userUid)
            if (`${isExist}` === 'false') {
                reject(`User ${record.userUid} does not exist`)
                return
            }

            const gateway = new Gateway()

            try {
                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });

                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);

                // console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
                var recordId = uuidv4()
                var result = await contract.submitTransaction('CreateAsset', recordId, record.userUid, record.nik, record.creditType, record.bankName, record.amount, 'pending');			

                // console.log(`*** Result: ${prettyJSONString(result3.toString())}`);

                resolve(result);
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`ERROR upcc chaincode createAsset : ${error}`);
            reject(error.message)
        }
    })
}

exports.readAsset = (recordId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const gateway = new Gateway()

            try {
                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });

                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);

                var result = await contract.evaluateTransaction('ReadAsset', recordId);
                resolve(JSON.parse(result));
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            reject(error)
        }
    })
}

exports.readAssetByUserUid = (userUid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const gateway = new Gateway()

            try {
                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });

                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);

                var result = await contract.evaluateTransaction('ReadAssetByUserUid', userUid);
                if (result.length > 0) {
                    resolve(JSON.parse(result))
                } else {
                    resolve("[]")
                }
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            reject(error)
        }
    })
}

exports.isExist = (recordId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const gateway = new Gateway()

            try {
                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });

                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);

                // console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
                var result = await contract.submitTransaction('AssetExists', recordId);			
                // console.log(`*** Result: ${prettyJSONString(result3.toString())}`);

                resolve(result);
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`ERROR upcc chaincode assetExist : ${error}`);
            reject(error.message)
        }
    })
}

exports.updateAsset = async (record) => {
    return new Promise(async (resolve, reject) => {
        try {

            const gateway = new Gateway()

            try {
                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });

                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);

                // console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
                var result = await contract.submitTransaction('UpdateAsset', record.recordId, record.userUid, record.nik, record.creditType, record.bankName, record.amount, record.status);			

                // console.log(`*** Result: ${prettyJSONString(result3.toString())}`);

                resolve(result);
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`ERROR upcc chaincode updateAsset : ${error}`);
            reject(error.message)
        }
    })
}

exports.approveAsset = async (recordId) => {
    return new Promise(async (resolve, reject) => {
        try {
            var record = await this.readAsset(recordId)
            var parsedRecord = JSON.parse(record.toString())
            var updatedRecord = {
                recordId: `${parsedRecord.record_id}`,
                userUid: `${parsedRecord.user_uid}`,
                nik: `${parsedRecord.nik}`,
                creditType: `${parsedRecord.credit_type}`,
                bankName: `${parsedRecord.bank_name}`,
                amount: `${parsedRecord.amount}`,
                status: `approved`
            } 
            var result = await this.updateAsset(updatedRecord)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

exports.rejectAsset = async (recordId) => {
    return new Promise(async (resolve, reject) => {
        try {
            var record = await this.readAsset(recordId)
            var parsedRecord = JSON.parse(record.toString())
            var updatedRecord = {
                recordId: `${parsedRecord.record_id}`,
                userUid: `${parsedRecord.user_uid}`,
                nik: `${parsedRecord.nik}`,
                creditType: `${parsedRecord.credit_type}`,
                bankName: `${parsedRecord.bank_name}`,
                amount: `${parsedRecord.amount}`,
                status: `rejected`
            } 

            var result = await this.updateAsset(updatedRecord)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

exports.deleteAsset = (recordId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const gateway = new Gateway()

            try {
                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });

                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);

                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);

                // console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
                var result = await contract.submitTransaction('DeleteAsset', recordId);			
                // console.log(`*** Result: ${prettyJSONString(result3.toString())}`);

                resolve(result);
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`ERROR upcc chaincode deleteAsset : ${error}`);
            reject(error.message)
        }
    })
}
