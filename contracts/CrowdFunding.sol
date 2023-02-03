// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

error CrowdFunding_TitleNotEnough();

contract CrowdFunding {
    address public owner;
    uint public projectTax;
    uint public balance;
    uint public ProjectCount;
    mapping(uint => projectStruct) public projects;

    mapping(address => projectStruct[]) projectsOf;
    mapping(uint => funder[]) funders;
    mapping(uint => bool) internal projectExist;

    enum statusEnum {
        OPEN, // open to fund
        APPROVED, // reached project cost
        REVERTED, // project expired
        DELETED, // project deleted
        PAYOUT // project paid
    }

    struct funder {
        address owner;
        uint contribution;
        uint timestamp;
        bool refunded;
    }

    struct projectStruct {
        uint id;
        address owner;
        string title;
        string description;
        string imageURL;
        uint cost;
        uint raised;
        uint timestamp;
        uint expiresAt;
        uint minBid;
        uint fundersCount;
        statusEnum status;
    }
    modifier ownerOnly() {
        require(msg.sender == owner, "Owner reserved only");
        _;
    }

    constructor(uint _projectTax) {
        owner = payable(msg.sender);
        projectTax = _projectTax;
    }

    function createProject(
        string memory title,
        string memory description,
        string memory imageUrl,
        uint cost,
        uint minBid,
        uint expiresAt
    ) public payable {
        require(bytes(title).length > 0, "Not enough title");
        require(msg.value >= projectTax, "Pay the taxes");
        require(cost > 0, "need cost");
        require(bytes(description).length > 0, "Description not enough");
        require(bytes(imageUrl).length > 0, "ImageUrl can not enough");
        require(expiresAt > block.timestamp, "not enough time");
        projectStruct memory project;
        ProjectCount++;
        project.id = ProjectCount;
        project.owner = payable(msg.sender);
        project.title = title;
        project.description = description;
        project.imageURL = imageUrl;
        project.cost = cost;
        project.minBid = minBid;
        project.timestamp = block.timestamp;
        project.expiresAt = expiresAt;
        project.status = statusEnum.OPEN;
        projectExist[ProjectCount] = true;
        projectsOf[msg.sender].push(project);
        projects[ProjectCount] = project;
        payTo(owner, msg.value);
    }

    function UpdateProject(
        uint id,
        string memory title,
        string memory description,
        string memory imageUrl,
        uint cost,
        uint minBid,
        uint expiresAt
    ) public payable {
        require(bytes(title).length > 0, "Not enough title");
        require(cost > 0, "need cost");
        require(bytes(description).length > 0, "Description not enough");
        require(bytes(imageUrl).length > 0, "ImageUrl can not enough");
        require(expiresAt > block.timestamp, "not enough time");
        projectStruct storage project = projects[id];
        project.title = title;
        project.description = description;
        project.imageURL = imageUrl;
        project.cost = cost;
        project.minBid = minBid;
        project.expiresAt = expiresAt;
    }

    function deleteProject(uint id) public {
        require(projectExist[id], "project not found");
        require(projects[id].status == statusEnum.OPEN, "project no longer");
        require(
            msg.sender == projects[id].owner || msg.sender == owner,
            "Unauthorized identity"
        );
        balance -= projects[id].raised;
        projects[id].status = statusEnum.DELETED;
        performRefund(id);
    }

    function contribution(uint _id) public payable {
        projectStruct storage CurrProject = projects[_id];
        require(msg.value >= CurrProject.minBid, "fund more than min dontaion");
        require(projectExist[_id], "project not found");
        require(
            CurrProject.status == statusEnum.OPEN,
            "Project no longer opened"
        );

        CurrProject.raised += msg.value;
        CurrProject.fundersCount += 1;
        balance += msg.value;
        
        funders[_id].push(
            funder(msg.sender, msg.value, block.timestamp, false)
        );

        if (CurrProject.raised >= CurrProject.cost) {
            CurrProject.status = statusEnum.APPROVED;
        }
        if (block.timestamp >= CurrProject.expiresAt) {
            CurrProject.status = statusEnum.REVERTED;
            balance -= CurrProject.raised;
            performRefund(_id);
        }
    }

    function payOut(uint id) public payable {
        projectStruct storage CurrProject = projects[id];
        require(CurrProject.owner == msg.sender, "Only Project Owner");
        require(
            CurrProject.status == statusEnum.APPROVED,
            "Not reached target"
        );
        payTo(CurrProject.owner, CurrProject.raised);
        CurrProject.status = statusEnum.PAYOUT;
    }

    function changeTax(uint _projectTax) public ownerOnly {
        projectTax = _projectTax;
    }

    function performRefund(uint id) internal {
        for (uint i = 0; i < funders[id].length; i++) {
            address _owner = funders[id][i].owner;
            uint _contribution = funders[id][i].contribution;

            funders[id][i].refunded = true;
            funders[id][i].timestamp = block.timestamp;

            payTo(_owner, _contribution);
        }
    }

    function getProjectOf() public view returns (projectStruct[] memory) {
        projectStruct[] memory Allproject = projectsOf[msg.sender];
        return Allproject;
    }

    function getFunders(uint id) public view returns (funder[] memory) {
        funder[] memory Allfunders = funders[id];
        return Allfunders;
    }

    function payTo(address to, uint amount) internal {
        (bool send, ) = payable(to).call{value: amount}("");
        require(send);
    }
}
