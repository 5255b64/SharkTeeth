// SPDX-License-Identifier: MIT
// WTF Solidity by 0xAA

pragma solidity ^0.8.21;

/**
 * @dev ERC20 接口合约.
 */
interface IERC20 {
    /**
     * @dev 释放条件：当 `value` 单位的货币从账户 (`from`) 转账到另一账户 (`to`)时.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev 释放条件：当 `value` 单位的货币从账户 (`owner`) 授权给另一账户 (`spender`)时.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev 返回代币总供给.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev 返回账户`account`所持有的代币数.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev 转账 `amount` 单位代币，从调用者账户到另一账户 `to`.
     *
     * 如果成功，返回 `true`.
     *
     * 释放 {Transfer} 事件.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev 返回`owner`账户授权给`spender`账户的额度，默认为0。
     *
     * 当{approve} 或 {transferFrom} 被调用时，`allowance`会改变.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev 调用者账户给`spender`账户授权 `amount`数量代币。
     *
     * 如果成功，返回 `true`.
     *
     * 释放 {Approval} 事件.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev 通过授权机制，从`from`账户向`to`账户转账`amount`数量代币。转账的部分会从调用者的`allowance`中扣除。
     *
     * 如果成功，返回 `true`.
     *
     * 释放 {Transfer} 事件.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract SharkGold is IERC20 {

    mapping(address => uint256) public override balanceOf;

    mapping(address => mapping(address => uint256)) public override allowance;

    uint256 public override totalSupply;   // 代币总供给

    string public name;   // 名称
    string public symbol;  // 符号
    uint8 public decimals; // 小数位数

    // @dev 在合约部署的时候实现合约名称和符号
    constructor(string memory name_, string memory symbol_, uint8 decimals_){
        name = name_;
        symbol = symbol_;
        decimals = decimals_;
    }

    // @dev 实现`transfer`函数，代币转账逻辑
    function transfer(address recipient, uint amount) public override returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    // @dev 实现 `approve` 函数, 代币授权逻辑
    function approve(address spender, uint amount) public override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    // @dev 实现`transferFrom`函数，代币授权转账逻辑
    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) public override returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    // @dev 铸造代币，从 `0` 地址转账给 调用者地址
    function mint(uint amount) external {
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    // @dev 销毁代币，从 调用者地址 转账给  `0` 地址
    function burn(uint amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}

contract SharkTeeth {
    uint256 public bonus; // 游戏奖励
    uint256 public fee; // 用户成本 每次touch后提升（翻倍）
    uint8 public teeth_total; // 当局游戏的touch次数上线
    uint8 public teeth_touched; // 当局游戏已touch次数
    bool public is_start = false; // 当局游戏是否开始
    bool public is_finish = false; // 当局游戏是否结束
    address public gold_addr;
    address public owner;

    event GameStart();
    event GameStop();
    event TouchSuccess(address user, uint256 fee, uint256 bonus);
    event TouchFail(address user, uint256 fee);
    event FeeIncreased(uint256 old_fee, uint256 new_fee);

    constructor(uint256 bonus_, uint256 fee_, uint8 teeth_total_, address gold_addr_) payable {
        require(teeth_total_ > 0);
        bonus = bonus_;
        fee = fee_;
        teeth_total = teeth_total_;
        teeth_touched = 0;
        gold_addr = gold_addr_;
        owner = msg.sender;
    }

    modifier notFinish {
        require(is_finish == false);
        _; // 如果是的话，继续运行函数主体；否则报错并revert交易
    }

    modifier checkGold(address addr, uint256 fee_) {
        require(IERC20(gold_addr).allowance(addr, address(this)) >= fee_);
        _; // 如果是的话，继续运行函数主体；否则报错并revert交易
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _; // 如果是的话，继续运行函数主体；否则报错并revert交易
    }

    function start() public onlyOwner {
        require(is_start == false);
        uint256 balance = IERC20(gold_addr).balanceOf(address(this));
        require(balance >= (teeth_total - 1) * bonus);
        is_start = true;
        emit GameStart();
    }

    function withdraw() public onlyOwner {
        require(is_finish == true);
        uint256 balance = IERC20(gold_addr).balanceOf(address(this));
        IERC20(gold_addr).transfer(owner, balance);
    }

    function getRandomOnchain() internal view returns(uint256){
        // remix运行blockhash会报错
        bytes32 randomBytes = keccak256(abi.encodePacked(block.timestamp, msg.sender, blockhash(block.number-1)));
        
        return uint256(randomBytes);
    }

    function increaseFee() internal {
        uint256 old_fee = fee;
        fee = fee * 2;
        emit FeeIncreased(old_fee, fee);
    }

    event TestRandom(uint256 random_number);

    function touch() public checkGold(msg.sender, fee){
        require(is_start == true);
        require(is_finish == false);
        uint256 random_number = getRandomOnchain() % (teeth_total - teeth_touched);
        emit TestRandom(random_number);
        if (random_number != 0) {
            IERC20(gold_addr).transfer(msg.sender, bonus);
            emit TouchSuccess(msg.sender, fee, bonus);
            increaseFee();
        } else {
            IERC20(gold_addr).transferFrom(msg.sender, address(this), fee);
            is_finish = true;
            emit TouchFail(msg.sender, fee);
            emit GameStop();
        }
        teeth_touched += 1;
    }
}