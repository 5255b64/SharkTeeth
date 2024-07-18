# SharkTeeth
---
## Info
 - 合约部署地址
   - 链：TODO
   - Address：TODO
## Desc
 - 游戏代币称为Gold
 - 一局游戏称为Shark
 - 玩家操作称为touch
   - 每次touch需要支付fee（若干Gold）
   - 如果touch成功 则返回用户的fee和bonus（少量Gold）
   - 如果touch失败 则用户损失fee 当局Shark结束
 - 在每局Shark中，每当一个用户进行touch操作，则所有用户的下一次touch的fee均提升。