import { ethers, JsonRpcSigner } from "ethers";
import { SHARK_GOLD_ABI, SHARK_GOLD_ADDRESS } from "../config/contract";
import get_signer from "../connection";


export async function balanceOf() {
    const signer = await get_signer();
    const abi = SHARK_GOLD_ABI;
    const SharkGoldContract = new ethers.Contract(SHARK_GOLD_ADDRESS, abi, signer);
    const balance = await SharkGoldContract.balanceOf(signer.getAddress());
    console.log("balance:", balance);
    return balance;
}

export async function transfer(address:string, amount:number) {
    const signer = await get_signer();
    const abi = SHARK_GOLD_ABI;
    const SharkGoldContract = new ethers.Contract(SHARK_GOLD_ADDRESS, abi, signer);
    const transfer_result = await SharkGoldContract.transfer(address, amount);
    console.log("transfer_result:", transfer_result);
    return transfer_result;
}

export async function allowance(owner:string, spender:string) {
    const signer = await get_signer();
    const abi = SHARK_GOLD_ABI;
    const SharkGoldContract = new ethers.Contract(SHARK_GOLD_ADDRESS, abi, signer);
    const allowance_result = await SharkGoldContract.allowance(owner, spender);
    console.log("allowance_result:", allowance_result);
    return allowance_result;
}

export async function approve(spender:string, amount:number) {
    const signer = await get_signer();
    const abi = SHARK_GOLD_ABI;
    const SharkGoldContract = new ethers.Contract(SHARK_GOLD_ADDRESS, abi, signer);
    const approve_result = await SharkGoldContract.approve(spender, amount);
    console.log("approve_result:", approve_result);
    return approve_result;
}

export async function mint(amount:number) {
    const signer = await get_signer();
    const abi = SHARK_GOLD_ABI;
    const SharkGoldContract = new ethers.Contract(SHARK_GOLD_ADDRESS, abi, signer);
    const mint_result = await SharkGoldContract.mint(amount);
    console.log("mint_result:", mint_result);
    return mint_result;
}
