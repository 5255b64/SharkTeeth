import { Button, Checkbox, Form, Input, InputNumber } from 'antd';
import type { FormProps } from 'antd';
import { approve } from '../contracts/shark_gold';
import { SHARK_TEETH_ADDRESS } from '../config/contract';
import { new_game } from '../contracts/shark_teeth';

type FieldType = {
    balance: number;
  };
  
const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    (async () => {
        await approve(SHARK_TEETH_ADDRESS, values.balance);
    })().then();
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const Approve = () => (
    <Form
        name="approve"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
    <Form.Item<FieldType>
      label="balance"
      name="balance"
      rules={[{ required: true, message: 'Please input balance!' }]}
    >
      <InputNumber />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Approve
      </Button>
    </Form.Item>
  </Form>
)

export default Approve;