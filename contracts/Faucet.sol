pragma solidity >=0.4.21 <0.7.0;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner, "The sender is not owner");
    _;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(owner);
    owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner) public onlyOwner {
    _transferOwnership(_newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address _newOwner) internal {
    require(_newOwner != address(0),"Owner address should be not zreo.");
    emit OwnershipTransferred(owner, _newOwner);
    owner = _newOwner;
  }
}

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }
}

/**
 * @title Faucet
 * @dev The Faucet contract
 */
contract Faucet is Ownable {

    using SafeMath for uint256;

    bool public canRequestByUser;
    uint256  public requestPeriod;
    uint256  public requestAmount;
    mapping(address => uint256) requestRecords;

    constructor(bool _canRequestByUser, uint256 _requestPeriod, uint256 _requestAmount) public {
        canRequestByUser = _canRequestByUser;
        requestPeriod = _requestPeriod;
        requestAmount = _requestAmount;
    }

    function _now() internal view returns (uint256)  {
        return block.timestamp;
    }

    function  _checkRequest(address requester) internal view {
        require(canRequestByUser || msg.sender == owner, "request must be by owner.");
        require(requestRecords[requester].add(requestPeriod) <= _now(), "One cycle just can request one time");
    }

    function () external payable{
        requestFor(msg.sender);
    }

    function requestFor(address payable requester)  public payable {
        _checkRequest(requester);
        requestRecords[requester] = _now();
        requester.transfer(requestAmount);
    }

    function setCanRequestByUser(bool _canRequestByUser) public onlyOwner{
        canRequestByUser = _canRequestByUser;
    }

    function setRequestPeriod(uint256 _requestPeriod) public onlyOwner{
        requestPeriod = _requestPeriod;
    }

    function setRequestAmount(uint256 _requestAmount) public onlyOwner{
        requestAmount = _requestAmount;
    }

}