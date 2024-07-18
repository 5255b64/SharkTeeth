import { useState } from "react";
import get_signer from "../connection";
import { allowance, balanceOf, mint } from "../contracts/shark_gold";
import { JsonRpcSigner } from "ethers";
import { Button, Drawer, Flex } from "antd";
import { SHARK_TEETH_ADDRESS } from "../config/contract";


const Faucet = () => {
    const [statusVisiable, setStatusVisiable] = useState(false);

    const showDrawer = async () => {
        setStatusVisiable(true);
    };
    const onDrawerClose = () => {
        setStatusVisiable(false);
    };

    async function getGold() {
        await mint(100);
    }

    return (
          <div>
            <Button onClick={showDrawer}>Faucet</Button>
                
            <Drawer title="Status" onClose={onDrawerClose} open={statusVisiable}>
            <div>
                you will get 100 Shark Gold
            </div>
            <Button onClick={getGold}>Get Shark Gold</Button>
            </Drawer>
        </div>
    )
}

export default Faucet;