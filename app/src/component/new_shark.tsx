import { Button, Checkbox, Form, Input, InputNumber } from 'antd';
import type { FormProps } from 'antd';
import { approve } from '../contracts/shark_gold';
import { SHARK_TEETH_ADDRESS } from '../config/contract';
import { new_game } from '../contracts/shark_teeth';

type FieldType = {
    bonus: number;
    fee: number;
    teeth_total: number;
  };
  
const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    (async () => {
        await new_game(values.bonus, values.fee, values.teeth_total);
    })().then();
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const NewStark = () => (
    <Form
        name="new_shark"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
    <Form.Item<FieldType>
      label="bonus"
      name="bonus"
      rules={[{ required: true, message: 'Please input bonus!' }]}
    >
      <InputNumber />
    </Form.Item>

    <Form.Item<FieldType>
      label="fee"
      name="fee"
      rules={[{ required: true, message: 'Please input fee!' }]}
    >
      <InputNumber />
    </Form.Item>

    <Form.Item<FieldType>
        label="teeth_total"
        name="teeth_total"
        rules={[{ required: true, message: 'Please input teeth_total!' }]}
    >
    <InputNumber />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
)

export default NewStark;