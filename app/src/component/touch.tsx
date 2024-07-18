import { Button } from 'antd';
import { touch } from '../contracts/shark_teeth';

export interface TouchProps {
    id:number;
}

const Touch = (props:TouchProps) => {
    const onClick = async () => {
        await touch(props.id);
    };

    return (
        <div>
            <Button onClick={onClick}>Touch</Button>
        </div>
    )
}

export default Touch;