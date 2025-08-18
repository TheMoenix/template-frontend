import React from 'react';
import { Card, Descriptions, Typography } from 'antd';
import { useMeQuery } from '@/graphql/generated';
import { dayjs } from '@/lib/dayjs';

const { Title } = Typography;

export const DashboardPage: React.FC = () => {
  const { data, loading, error } = useMeQuery();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const user = data?.me;

  return (
    <div>
      <Title level={2}>Dashboard</Title>

      <Card title="User Information" className="dashboard-card">
        {user && (
          <div className="user-info">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
              <Descriptions.Item label="Created">
                {dayjs(user.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="Updated">
                {dayjs(user.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Card>

      <Card title="Welcome" className="dashboard-card">
        <p>Welcome to the Web Template! This is a production-ready React application with:</p>
        <ul>
          <li>React 18 with TypeScript</li>
          <li>Ant Design components</li>
          <li>Apollo GraphQL client</li>
          <li>JWT authentication with refresh tokens</li>
          <li>Zustand state management</li>
          <li>Day.js for date handling</li>
          <li>Feature-first architecture</li>
        </ul>
      </Card>
    </div>
  );
};
