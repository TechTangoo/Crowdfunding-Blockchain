const contractAddress = '0xeDc9eD42ea5706FD5F980033FE18826Ead446418'; // Replace with your deployed contract address
const contractAbi = [
	{
		"inputs": [],
		"name": "contribute",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_durationInDays",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "contributor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Contribution",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			}
		],
		"name": "GoalReached",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_goal",
				"type": "uint256"
			}
		],
		"name": "setGoal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "contributions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "goal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isCampaignClosed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isGoalReached",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // Replace with your contract's ABI

const web3 = new Web3(Web3.givenProvider);
const crowdfundingContract = new web3.eth.Contract(contractAbi, contractAddress);



async function contribute() {
    const contributionAmount = document.getElementById('contributionAmount').value;
    const weiAmount = web3.utils.toWei(contributionAmount, 'ether');

    const accounts = await web3.eth.getAccounts();
    await crowdfundingContract.methods.contribute().send({ from: accounts[0], value: weiAmount });

    updateContractInfo();
}

async function updateContractInfo() {
    const balance = await web3.eth.getBalance(contractAddress);
    document.getElementById('contractBalance').textContent = web3.utils.fromWei(balance, 'ether');

    const goalReached = await crowdfundingContract.methods.isGoalReached().call();
    document.getElementById('goalReached').textContent = goalReached ? 'Yes' : 'No';

    const goal = await crowdfundingContract.methods.goal().call();
    document.getElementById('contractGoal').textContent = web3.utils.fromWei(goal, 'ether'); // Update the placeholder
}



async function withdrawFunds() {
    const accounts = await web3.eth.getAccounts();
    await crowdfundingContract.methods.withdrawFunds().send({ from: accounts[0] });

    updateContractInfo();
}

async function setGoal() {
    const goalAmount = document.getElementById('contractGoal').value; // Read goal amount from user input
    const weiGoal = web3.utils.toWei(goalAmount.toString(), 'ether'); // Convert input to string before passing

    const accounts = await web3.eth.getAccounts();
    await crowdfundingContract.methods.setGoal(weiGoal).send({ from: accounts[0] });

    updateContractInfo();
}




window.onload = async () => {
    if (window.ethereum) {
        await window.ethereum.enable();
        await updateContractInfo();
    } else {
        alert("Please install a Web3-enabled browser like MetaMask to use this app.");
    }
};
