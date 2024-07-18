

export class Shark {
    id:number;
    bonus:number; // 游戏奖励
    fee:number; // 用户成本 每次touch后提升（翻倍）
    teeth_total:number; // 当局游戏的touch次数上线
    teeth_touched:number; // 当局游戏已touch次数
    is_finish:boolean; // 当局游戏是否结束
    owner:string; // game creator
    gold:number; // 当局游戏持有的gold总数

    constructor(id:number, s:string[7]) {
        this.id = id;
        this.bonus = Number(s[0]);
        this.fee = Number(s[1]);
        this.teeth_total = Number(s[2]);
        this.teeth_touched = Number(s[3]);
        this.is_finish = s[4] === "true";
        this.owner = s[5];
        this.gold = Number(s[6]);
    }
}