import { useState } from "react";
import get_signer, { update_signer } from "../connection";
import { allowance, balanceOf } from "../contracts/shark_gold";
import { JsonRpcSigner } from "ethers";
import { Button, Drawer, Flex } from "antd";
import { SHARK_TEETH_ADDRESS } from "../config/contract";


const Status = () => {
    var [signer, setSigner] = useState<JsonRpcSigner>();
    var [address, setAddress] = useState<string>();
    var [balance, setBalance] = useState<number>();
    var [allow, setAllowance] = useState<number>();
    
    const [statusVisiable, setStatusVisiable] = useState(false);

    async function update() {
        setSigner(await update_signer());
        setAddress(await signer?.getAddress());

        const balance = await balanceOf();
        // console.log("balance:", balance);
        // console.log("tpye:", typeof(balance));
        setBalance(Number(balance));

        const allow = await allowance(await (await get_signer()).getAddress(), SHARK_TEETH_ADDRESS);
        console.log("allowance:", allow);
        setAllowance(Number(allow));

    }

    const showDrawer = async () => {
        await update();
        setStatusVisiable(true);
    };
    const onDrawerClose = () => {
        setStatusVisiable(false);
    };

    return (
        <Flex vertical={false}>
          <div>
            <Button onClick={showDrawer}>Status</Button>
                
            <Drawer title="Status" onClose={onDrawerClose} open={statusVisiable}>
            <div>
                address: {address}
            </div>
            <div>
                balance: {balance}
            </div>
            <div>
                allowance: {allow}
            </div>
            </Drawer>
        </div>
        </Flex>
        
    )
}

export default Status;