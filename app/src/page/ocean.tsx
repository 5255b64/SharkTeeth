import { useState } from 'react';
import { Avatar, Breadcrumb, Button, Drawer, Flex, Layout, Menu, theme } from 'antd';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { get_sharks, touch, withdraw } from '../contracts/shark_teeth';
import NewStark from '../component/new_shark';
import Approve from '../component/approve';
import Status from '../component/status';
import Faucet from '../component/faucet';
import logo from '../logo.png';

interface DataType {
  id:number;
  bonus:number; // 游戏奖励
  fee:number; // 用户成本 每次touch后提升（翻倍）
  teeth_total:number; // 当局游戏的touch次数上线
  teeth_touched:number; // 当局游戏已touch次数
  is_finish:boolean; // 当局游戏是否结束
  owner:string; // game creator
  gold:number; // 当局游戏持有的gold总数
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  }, 
  {
    title: 'bonus',
    dataIndex: 'bonus',
    key: 'bonus',
  }, 
  {
    title: 'fee',
    dataIndex: 'fee',
    key: 'fee',
  }, 
  {
    title: 'teeth_touched',
    dataIndex: 'teeth_touched',
    key: 'teeth_touched',
  }, 
  {
    title: 'teeth_total',
    dataIndex: 'teeth_total',
    key: 'teeth_total',
  }, 
  {
    title: 'is_finish',
    dataIndex: 'is_finish',
    key: 'is_finish',
    render: (_, record) => (
      <div>{record.is_finish.toString()}</div>
        ),
  }, 
  {
    title: 'gold',
    dataIndex: 'gold',
    key: 'gold',
  }, 
  {
    title: 'owner',
    dataIndex: 'owner',
    key: 'owner',
  }, 
  {
    title: '',
    dataIndex: 'join',
    key: 'join',
    render: (_, record) => {
      const onTouch = async () => {
        await touch(record.id);
      };
      const onWithdraw = async () => {
        await withdraw(record.id);
      };

      return (
        <Space size="middle">
          <Button onClick={onTouch}>Touch</Button>
          <Button onClick={onWithdraw}>Withdraw</Button>
        </Space>
      )
    },
  }, 
  // {
  //   title: 'Action',
  //   key: 'action',
  //   render: (_, record) => (
  //     <Space size="middle">
  //       <a>Invite {record.name}</a>
  //       <a>Delete</a>
  //     </Space>
  //   ),
  // },
];

const { Header, Content, Footer } = Layout;


const Ocean = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [drawerVisiable, setDrawerVisiable] = useState(false);
  const [approveVisiable, setApproveVisiable] = useState(false);

  const showDrawer = () => {
    setDrawerVisiable(true);
  };
  const onDrawerClose = () => {
    setDrawerVisiable(false);
  };
  const showApprove = () => {
    setApproveVisiable(true);
  };
  const onApproveClose = () => {
    setApproveVisiable(false);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  async function updateData() {
    const sharks = await get_sharks();
    // console.log("sharks:", sharks);
    var t = [];
    for (var i=sharks.length-1;i>=0;i--) {
      sharks[i].id = i;
      const shark = sharks[i];
      t.push({
        id:shark.id,
        bonus:shark.bonus,
        fee:shark.fee,
        teeth_total:shark.teeth_total,
        teeth_touched:shark.teeth_touched,
        is_finish:shark.is_finish,
        owner:shark.owner,
        gold:shark.gold,
      },)
    }
    // console.log("t:", t);
    setData(t);
  }

  return (
    <div>
    <Drawer title="New Shark" onClose={onDrawerClose} open={drawerVisiable}>
      <NewStark/>
    </Drawer>
    <Drawer title="Approve" onClose={onApproveClose} open={approveVisiable}>
      <Approve/>
    </Drawer>
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Flex vertical={false}>
          <div>
            <Avatar src={<img src={logo} alt="avatar" />} />
          </div>
        <div className="demo-logo" >
          <Status/>
        </div>
        </Flex>
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Ocean</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Flex vertical={false}>
            <Faucet/>
            <Button onClick={showApprove}>Approve</Button>
            <Button onClick={showDrawer}>New Shark</Button>
            <Button onClick={updateData}>Updata Data</Button>
          </Flex>
          <Table columns={columns} dataSource={data} />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        {/* Ant Design ©{new Date().getFullYear()} Created by Ant UED */}
      </Footer>
    </Layout>
    </div>
  );
};

export default Ocean;