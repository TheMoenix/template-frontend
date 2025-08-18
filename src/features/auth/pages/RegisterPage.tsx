import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '@/graphql/generated';
import { authStore } from '@/store/auth.store';

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage: React.FC = () => {
  const [form] = Form.useForm<RegisterForm>();
  const [loading, setLoading] = useState(false);
  const { setAuth } = authStore();
  const navigate = useNavigate();

  const [registerMutation] = useRegisterMutation();

  const onFinish = async (values: RegisterForm) => {
    setLoading(true);
    try {
      const result = await registerMutation({
        variables: {
          input: {
            email: values.email,
            password: values.password,
          },
        },
      });

      if (result.data?.register) {
        const { accessToken, user } = result.data.register;
        setAuth(accessToken, user);
        message.success('Registration successful!');
        navigate('/app');
      }
    } catch (error: any) {
      message.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <h1 className="auth-title">Register</h1>
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
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </Card>
    </div>
  );
};
