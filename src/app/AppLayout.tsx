import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { authStore } from '@/store/auth.store';
import { useLogoutMutation } from '@/graphql/generated';

const { Header, Content, Sider } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = authStore();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation();
    } finally {
      logout();
    }
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
    },
  ];

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="app-logo">Web Template</div>
        <div>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
            <Button type="text" icon={<Avatar size="small" icon={<UserOutlined />} />}>
              {user?.email}
            </Button>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        <Sider width={250} theme="light" style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            items={menuItems}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>

        <Layout>
          <Content className="app-content">{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
