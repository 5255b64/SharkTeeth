import { BrowserProvider, JsonRpcSigner } from "ethers";


var signer:JsonRpcSigner;
var accounts:string[];
var provider:BrowserProvider;


export function get_provider() {
    if (typeof(provider) == "undefined") {
        const eth = window.ethereum;
        if (!eth) {
          alert('No wallet has been found');
        } else {
            provider = new BrowserProvider(eth);
        }
    }
    return provider
}

export default async function get_signer() {
    if (typeof(signer) == "undefined") {
        signer = await update_signer();
    }
    return signer;
}

export async function update_signer() {
    const provider = get_provider();
    signer = await provider.getSigner();
    return signer;
}

export async function get_accounts() {
    accounts = await get_provider().send('eth_accounts', []);
    return accounts;
}

export {};