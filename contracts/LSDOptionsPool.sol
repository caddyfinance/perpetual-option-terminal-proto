// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LSDOptionsPool is ReentrancyGuard, Ownable {
    struct Option {
        address asset;      // LST token address
        uint256 strike;     // Strike price in ETH
        uint256 premium;    // Premium in ETH
        uint256 size;       // Size of the option
        uint256 expiry;     // Timestamp when option expires
        bool isCall;        // True for call, false for put
        address writer;     // Address of option writer
        address holder;     // Address of option holder
        bool isExercised;   // Whether option has been exercised
        bool isCancelled;   // Whether option has been cancelled
    }

    mapping(uint256 => Option) public options;
    uint256 private nextOptionId;

    event OptionCreated(
        uint256 indexed optionId,
        address indexed writer,
        address asset,
        uint256 strike,
        uint256 premium,
        uint256 size,
        uint256 expiry,
        bool isCall
    );
    event OptionBought(uint256 indexed optionId, address indexed buyer);
    event OptionExercised(uint256 indexed optionId);
    event OptionCancelled(uint256 indexed optionId);

    constructor() Ownable(msg.sender) {}

    function createOption(
        address asset,
        uint256 strike,
        uint256 premium,
        uint256 size,
        uint256 expiry,
        bool isCall
    ) external returns (uint256) {
        require(expiry > block.timestamp, "Invalid expiry");
        require(strike > 0, "Invalid strike price");
        require(premium > 0, "Invalid premium");
        require(size > 0, "Invalid size");

        uint256 optionId = nextOptionId++;
        options[optionId] = Option({
            asset: asset,
            strike: strike,
            premium: premium,
            size: size,
            expiry: expiry,
            isCall: isCall,
            writer: msg.sender,
            holder: address(0),
            isExercised: false,
            isCancelled: false
        });

        emit OptionCreated(
            optionId,
            msg.sender,
            asset,
            strike,
            premium,
            size,
            expiry,
            isCall
        );

        return optionId;
    }

    function buyOption(uint256 optionId) external payable nonReentrant {
        Option storage option = options[optionId];
        require(!option.isCancelled, "Option cancelled");
        require(!option.isExercised, "Option already exercised");
        require(option.holder == address(0), "Option already bought");
        require(msg.value == option.premium, "Incorrect premium amount");
        require(block.timestamp < option.expiry, "Option expired");

        option.holder = msg.sender;
        payable(option.writer).transfer(msg.value);

        emit OptionBought(optionId, msg.sender);
    }

    function exerciseOption(uint256 optionId) external payable nonReentrant {
        Option storage option = options[optionId];
        require(msg.sender == option.holder, "Not option holder");
        require(!option.isExercised, "Already exercised");
        require(!option.isCancelled, "Option cancelled");
        require(block.timestamp < option.expiry, "Option expired");

        if (option.isCall) {
            require(msg.value == option.strike * option.size, "Incorrect strike amount");
            // Transfer LST tokens from writer to holder
            IERC20(option.asset).transferFrom(option.writer, msg.sender, option.size);
        } else {
            // For puts, holder sends LST tokens and receives ETH
            IERC20(option.asset).transferFrom(msg.sender, option.writer, option.size);
            payable(msg.sender).transfer(option.strike * option.size);
        }

        option.isExercised = true;
        emit OptionExercised(optionId);
    }

    function cancelOption(uint256 optionId) external {
        Option storage option = options[optionId];
        require(msg.sender == option.writer, "Not option writer");
        require(option.holder == address(0), "Option already bought");
        require(!option.isCancelled, "Already cancelled");

        option.isCancelled = true;
        emit OptionCancelled(optionId);
    }

    function getOption(uint256 optionId) external view returns (Option memory) {
        return options[optionId];
    }
}