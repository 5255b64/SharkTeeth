import { ethers, JsonRpcSigner } from "ethers";
import { SHARK_TEETH_ABI, SHARK_TEETH_ADDRESS } from "../config/contract";
import { Shark } from "../model";
import get_signer from "../connection";


export async function new_game(bonus:number, fee:number, teeth_total:number) {
    const signer = await get_signer();
    const abi = SHARK_TEETH_ABI;
    const SharkTeethContract = new ethers.Contract(SHARK_TEETH_ADDRESS, abi, signer);
    const new_game_result = await SharkTeethContract.new_game(bonus, fee, teeth_total);
    console.log("new_game_result:", new_game_result);
}

export async function withdraw(id:number) {
    const signer = await get_signer();
    const abi = SHARK_TEETH_ABI;
    const SharkTeethContract = new ethers.Contract(SHARK_TEETH_ADDRESS, abi, signer);
    const withdraw_result = await SharkTeethContract.withdraw(id);
    console.log("withdraw_result:", withdraw_result);
}

export async function touch(id:number) {
    const signer = await get_signer();
    const abi = SHARK_TEETH_ABI;
    const SharkTeethContract = new ethers.Contract(SHARK_TEETH_ADDRESS, abi, signer);
    const touch_result = await SharkTeethContract.touch(id);
    console.log("touch_result:", touch_result);
}

export async function get_sharks():Promise<Shark[]> {
    const signer = await get_signer();
    const abi = SHARK_TEETH_ABI;
    const SharkTeethContract = new ethers.Contract(SHARK_TEETH_ADDRESS, abi, signer);
    const get_sharks_result = await SharkTeethContract.get_sharks();
    console.log("get_sharks_result:", get_sharks_result);
    
    const s = get_sharks_result.toString().split(",");

    const num = s.length / 7;
    var shark_list:Shark[] = [];
    for (var i=0; i<num; i++)
    {
      shark_list.push(new Shark(0, s.slice(i*7,i*7+7)));
    }
    return shark_list;
}