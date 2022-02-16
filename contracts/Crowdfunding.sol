// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

pragma experimental ABIEncoderV2;
import "./DAOT.sol";

contract CrowdFunding {
    address public admin;
    uint256 public noOfContributors;
    uint256 public goal;
    uint256 public deadline;
    uint256 public minContribution;
    uint256 public raisedAmount;
    uint256 public id;
    uint256 public totalDestributedTokens;
    uint256 public tokenTransferAmount;

    DAOT daot = new DAOT(100000000, msg.sender);

    struct Request {
        uint256 id;
        string title;
        string description;
        uint256 value;
        address payable recipient;
        bool completed;
        uint256 noOfVotes;
        mapping(address => bool) voters;
    }

    mapping(address => uint256) public contributors;
    mapping(uint256 => Request) public spendingRequests;
    mapping(address => bool) public voted;
    mapping(address => uint256) public contributorsVoteWeight;

    constructor(
        uint256 _deadline,
        uint256 _goal,
        uint256 _minContribution
    ) {
        minContribution = _minContribution;
        deadline = block.timestamp + _deadline;
        goal = _goal;
        admin = msg.sender;
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
        tokenTransferAmount = msg.value / 10**11;
        contributors[msg.sender] += msg.value;
        raisedAmount += msg.value;
 

        // 100000000000000 wei = 0,00001 eth/0,03USD  = 1000 TOKEN
      

        totalDestributedTokens += msg.value / 10**11;

        daot.approve(msg.sender, tokenTransferAmount);
        _transferTokens(tokenTransferAmount);
    }

    function _transferTokens(uint256 _amount) private {
        daot.transferFrom(address(daot), msg.sender, _amount);
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
            raisedAmount >= _value,
            "Not enough funds raised for this requested proposal!"
        );

        Request storage newRequest = spendingRequests[id];
        newRequest.id = id;
        newRequest.description = _description;
        newRequest.title = _title;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.noOfVotes = 0;

        id++;
    }

    function vote(uint256 _id) external tokenOwnerRights {
        Request storage request = spendingRequests[_id];
        require(msg.sender != admin, "Admin cannot cast a vote! ");
        require(
            request.voters[msg.sender] == false,
            "You have allready voted for this spending request!"
        );
        require(request.completed != true ,"Cannot vote, spending request completed!");

        uint256 voteWeight = _balanceOfDaotAddr(msg.sender);
        request.noOfVotes += voteWeight;

        request.voters[msg.sender] = true;

        voted[msg.sender] = true;
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

    function transferOwnership(address _newAdmin) external onlyOwner {
        admin = _newAdmin;
    }

    //---------------------------------------------helper functions------------------------------------

    function tokenHolderAddress() public view returns(address){


        return address(daot);
    }
    
    
    function totalSupply() public view returns (uint256) {
        return daot.totalSupply() / 10**18;
    }

    function _balanceOfDaotAddr(address _account)
        private
        view
        returns (uint256)
    {
        return daot.balanceOf(_account) / 10**18;
    }

    function balanceOfDaotAddr(address _account) public view returns (uint256) {
        return daot.balanceOf(_account) / 10**18;
    }

    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256)
    {
        return daot.allowance(_owner, _spender);
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
            r.noOfVotes,
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
        bool enoughVotes = false;
        Request storage request = spendingRequests[_id];
        if (request.noOfVotes > totalDestributedTokens / 2) {
            enoughVotes = true;
        }

        return enoughVotes;
    }

    function goal_() external view returns (uint256) {
        return goal;
    }

    function getTotalDistrubitedTokens() public view returns (uint256) {
        return totalDestributedTokens;
    }

    function completedRequests(uint256 _id) external view returns (bool) {
        Request storage request = spendingRequests[_id];

        return (request.completed);
    }

    //-----------------------modifiers------------------------------------------------------
    modifier requestApproved(uint256 _id) {
        Request storage request = spendingRequests[_id];
        require(
            request.noOfVotes > totalDestributedTokens / 2,
            "The request has not received more than half of votes!"
        );
        _;
    }

    modifier tokenOwnerRights() {
        require(
            balanceOfDaotAddr(msg.sender) > 0,
            "Your address does NOT have any tokens, no voting rights!"
        );
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == admin, "Only admin!");
        _;
    }
}
