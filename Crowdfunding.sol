// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;
pragma experimental ABIEncoderV2;

import "./DAOT.sol";

contract CrowdFunding {
    address public owner;
    uint256 public noOfContributors;
    uint256 public goal;
    uint256 public deadline;
    uint256 public minContribution;
    uint256 public raisedAmount;
    uint256 public id;

    struct Request {
        uint256 id;
        string title;
        string description;
        uint256 value;
        address payable recipient;
        bool completed;
        uint256 noOfVOters;
        mapping(address => bool) voters;
    }

    mapping(address => uint256) public contributors;
    mapping(uint256 => Request) public spendingRequests;
    mapping(address => bool) public voted;

    constructor(
        uint256 _deadline,
        uint256 _goal,
        uint256 _minContribution
    ) {
        minContribution = _minContribution;
        deadline = block.timestamp + _deadline;
        goal = _goal;
        owner = msg.sender;
    }

    function contribute() external payable {
        require(
            deadline > block.timestamp,
            " The campaign contribution deadline ended!"
        );
        require(msg.value >= minContribution, "Minimum contribution not met!");
        if (contributors[msg.sender] == 0) {
            noOfContributors++;
        }

        //transfer equivalent amount of of tokens /  contribution value to contributor
        // 0.1 eth is equal to 1000 DAOT
        uint256 amount = (msg.value * 10000);
        DAOT.transfer(msg.sender, amount);
        contributors[msg.sender] += msg.value;
        raisedAmount += msg.value;
    }

    function getRefund() external payable {
        require(
            deadline < block.timestamp && raisedAmount < goal,
            "The campaign raised amount has been reached, cannot refund!"
        );

        require(
            contributors[msg.sender] > 0,
            "You have not contributed to the campaign, cannot refund!"
        );
        address payable recipient = payable(msg.sender);
        uint256 value = contributors[msg.sender];
        contributors[msg.sender] = 0;

        (bool success, ) = recipient.call{value: value}("");
        require(success, "Transfer to owner of the course failed");
    }

    function spendingRequest(
        string memory _title,
        string memory _description,
        address payable _recipient,
        uint256 _value
    ) external onlyOwner {
        require(
            raisedAmount > _value,
            "Not enough funds raised for this requested proposal!"
        );

        Request storage newRequest = spendingRequests[id];
        newRequest.id = id;
        newRequest.description = _description;
        newRequest.title = _title;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.noOfVOters = 0;

        id++;
    }

    function vote(uint256 _id) external contributorRights {
        Request storage request = spendingRequests[_id];
        require(msg.sender != owner, "Owner cannot cast a vote! ");
        require(
            request.voters[msg.sender] == false,
            "You have allready voted for this spending request!"
        );
        request.voters[msg.sender] = true;
        request.noOfVOters += 1;
        voted[msg.sender] = true;
    }

    function hasVoted(address _voter) external view returns (bool) {
        return voted[_voter];
    }

    function votedForSpendingRequest(uint256 _id) external view returns (bool) {
        Request storage r = spendingRequests[_id];

        return r.voters[msg.sender];
    }

    function deadline_() external view returns (bool) {
        bool isDeadline = false;

        if (deadline < block.timestamp) {
            isDeadline = true;
        }

        return isDeadline;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getSpendingRequest(uint256 _id)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            uint256,
            address,
            uint256,
            bool
        )
    {
        Request storage r = spendingRequests[_id];

        return (
            r.id,
            r.title,
            r.description,
            r.value,
            r.recipient,
            r.noOfVOters,
            r.completed
        );
    }

    function raisedAmount_() external view returns (bool) {
        bool isRaised = false;

        if (raisedAmount >= goal) {
            isRaised = true;
        }

        return isRaised;
    }

    function noOfVoters_(uint256 _id) external view returns (bool) {
        bool enoughVoters = false;
        Request storage request = spendingRequests[_id];
        if (request.noOfVOters > noOfContributors / 2) {
            enoughVoters = true;
        }

        return enoughVoters;
    }

    function goal_() external view returns (uint256) {
        return goal;
    }

    function transferRequestFunds(uint256 _id)
        external
        payable
        onlyOwner
        requestApproved(_id)
    {
        require(
            raisedAmount >= goal,
            "The funding funds goal has not been reached!"
        );
        Request storage request = spendingRequests[_id];
        request.completed = true;

        (bool success, ) = request.recipient.call{value: request.value}("");
        require(success, "Transfer to owner of the course failed");
    }

    function transferOwnership(address _newOwer) external onlyOwner {
        owner = _newOwer;
    }

    function completedRequests(uint256 _id) external returns (bool) {
        Request storage request = spendingRequests[_id];

        return (request.completed);
    }

    modifier requestApproved(uint256 _id) {
        Request storage request = spendingRequests[_id];
        require(
            request.noOfVOters > noOfContributors / 2,
            "The request has not received more than half of votes!"
        );
        _;
    }

    modifier contributorRights() {
        require(contributors[msg.sender] > 0, "No right to vote!");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner!");
        _;
    }
}
