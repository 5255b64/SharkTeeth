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
    address public owner;
    address public gold_addr;
    struct Shark {
        uint256 bonus; // 游戏奖励
        uint256 fee; // 用户成本 每次touch后提升（翻倍）
        uint8 teeth_total; // 当局游戏的touch次数上线
        uint8 teeth_touched; // 当局游戏已touch次数
        bool is_finish; // 当局游戏是否结束
        address owner; // game creator
        uint256 gold; // 当局游戏持有的gold总数
    }

    Shark[] public sharks;

    event GameStart(uint256 shark_id);
    event GameStop(uint256 shark_id);
    event TouchSuccess(uint256 shark_id, address user, uint256 fee, uint256 bonus);
    event TouchFail(uint256 shark_id, address user, uint256 fee);
    event FeeIncreased(uint256 shark_id, uint256 old_fee, uint256 new_fee);

    constructor(address gold_addr_) {
        gold_addr = gold_addr_;
        owner = msg.sender;
    }

    modifier notFinish(uint256 shark_id) {
        require(sharks[shark_id].is_finish == false);
        _; // 如果是的话，继续运行函数主体；否则报错并revert交易
    }

    modifier checkGold(uint256 shark_id) {
        require(IERC20(gold_addr).allowance(msg.sender, address(this)) >= sharks[shark_id].fee);
        _; // 如果是的话，继续运行函数主体；否则报错并revert交易
    }

    modifier onlyOwner(uint256 shark_id) {
        require(msg.sender == sharks[shark_id].owner);
        _; // 如果是的话，继续运行函数主体；否则报错并revert交易
    }

    modifier finished(uint256 shark_id) {
        require(sharks[shark_id].is_finish == true);
        _; // 如果是的话，继续运行函数主体；否则报错并revert交易
    }

    modifier notFinished(uint256 shark_id) {
        require(sharks[shark_id].is_finish == false);
        _; // 如果是的话，继续运行函数主体；否则报错并revert交易
    }

    /**
     * @dev 返回shark_id
     */
    function new_game(uint256 bonus_, uint256 fee_, uint8 teeth_total_) public returns(uint256) {
        require(teeth_total_ > 0);
        uint256 gold = (teeth_total_ - 1) * bonus_;
        require(IERC20(gold_addr).allowance(msg.sender, address(this)) >= gold);
        IERC20(gold_addr).transferFrom(msg.sender, address(this), gold);
        Shark memory shark = Shark(bonus_, fee_, teeth_total_, 0, false, msg.sender, gold);
        uint256 shark_id = sharks.length;
        sharks.push(shark);
        emit GameStart(shark_id);
        return(shark_id);
    }

    function withdraw(uint256 shark_id) public onlyOwner(shark_id) finished(shark_id) {
        IERC20(gold_addr).transfer(msg.sender, sharks[shark_id].gold);
        sharks[shark_id].gold = 0;
    }

    function getRandomOnchain() internal view returns(uint256){
        // remix运行blockhash会报错
        bytes32 randomBytes = keccak256(abi.encodePacked(block.timestamp, msg.sender, blockhash(block.number-1)));
        
        return uint256(randomBytes);
    }

    /**
     * @dev 提升fee
     */
    function increaseFee(uint256 shark_id) internal {
        uint256 old_fee = sharks[shark_id].fee;
        sharks[shark_id].fee = sharks[shark_id].fee * 2;
        emit FeeIncreased(shark_id, old_fee, sharks[shark_id].fee);
    }

    function touch(uint256 shark_id) public notFinished(shark_id) checkGold(shark_id){
        uint256 random_number = getRandomOnchain() % (sharks[shark_id].teeth_total - sharks[shark_id].teeth_touched);
        if (random_number != 0) {
            IERC20(gold_addr).transfer(msg.sender, sharks[shark_id].bonus);
            sharks[shark_id].gold = sharks[shark_id].gold - sharks[shark_id].bonus;
            emit TouchSuccess(shark_id, msg.sender, sharks[shark_id].fee, sharks[shark_id].bonus);
            increaseFee(shark_id);
        } else {
            IERC20(gold_addr).transferFrom(msg.sender, address(this), sharks[shark_id].fee);
            sharks[shark_id].gold = sharks[shark_id].gold + sharks[shark_id].fee;
            sharks[shark_id].is_finish = true;
            emit TouchFail(shark_id, msg.sender, sharks[shark_id].fee);
            emit GameStop(shark_id);
        }
        sharks[shark_id].teeth_touched += 1;
    }

    function get_sharks_num() public view returns(uint256) {
        return sharks.length;
    }

    function get_shark(uint256 id) public view returns(Shark memory) {
        require(id < sharks.length);
        return sharks[id];
    }

    function get_sharks() public view returns(Shark[] memory) {
        return sharks;
    }
}