import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authStore } from '@/store/auth.store';
import { useLoginMutation } from '@/graphql/generated/hooks';

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [form] = Form.useForm<LoginForm>();
  const [loading, setLoading] = useState(false);
  const { setAuth } = authStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginMutation] = useLoginMutation();

  const from = location.state?.from?.pathname || '/app';

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const result = await loginMutation({
        variables: {
          input: values,
        },
      });

      if (result.data?.login) {
        const { accessToken, user } = result.data.login;
        setAuth(accessToken, user);
        message.success('Login successful!');
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      message.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <h1 className="auth-title">Login</h1>
        <Form form={form} onFinish={onFinish} layout="vertical" className="auth-form">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </Card>
    </div>
  );
};
