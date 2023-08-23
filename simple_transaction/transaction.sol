// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleCrowdfunding {
    address public owner;
    uint public goal;
    uint public endTime;
    mapping(address => uint) public contributions;
    bool public isGoalReached;
    bool public isCampaignClosed;

    event Contribution(address indexed contributor, uint amount);
    event GoalReached(uint totalAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier campaignOpen() {
        require(!isCampaignClosed && block.timestamp <= endTime, "Campaign is closed");
        _;
    }

    constructor(uint _durationInDays) {
        owner = msg.sender;
        endTime = block.timestamp + _durationInDays * 1 days;
    }

    function setGoal(uint _goal) external onlyOwner {
        require(goal == 0, "Goal is already set");
        goal = _goal * 1 ether; // Convert to Wei (the smallest Ethereum unit)
    }

    function contribute() external payable campaignOpen {
        require(msg.value > 0, "Contribution amount must be greater than 0");
        
        contributions[msg.sender] += msg.value;
        emit Contribution(msg.sender, msg.value);

        if (address(this).balance >= goal && !isGoalReached) {
            isGoalReached = true;
            emit GoalReached(address(this).balance);
        }
    }

    function withdrawFunds() external onlyOwner {
        require(isGoalReached, "Goal must be reached to withdraw funds");
        payable(owner).transfer(address(this).balance);
        isCampaignClosed = true;
    }

    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }
}
