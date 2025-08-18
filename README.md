# Web Template - React + Ant Design + GraphQL

A production-ready, feature-first React frontend template with Ant Design, Apollo GraphQL, JWT authentication, and TypeScript.

## Features

- ⚡ **Vite** for fast development and building
- ⚛️ **React 18** with TypeScript
- 🎨 **Ant Design** with compact theme
- 🌐 **Apollo GraphQL** client with codegen
- 🔐 **JWT Authentication** with refresh tokens
- 🐻 **Zustand** for state management
- 📅 **Day.js** for date handling
- 🎯 **Feature-first architecture**
- 📝 **Code generation** with Plop
- 🔧 **ESLint + Prettier**

## Architecture

```
src/
├── app/                    # Application setup and routing
│   ├── App.tsx            # Main app component with providers
│   ├── AppRouter.tsx      # Route configuration
│   └── AppLayout.tsx      # Authenticated app layout
├── shared/                 # Shared components and utilities
│   └── components/        # Reusable UI components
├── features/               # Feature modules (vertical slices)
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard feature
├── entities/               # Domain entities and types
├── graphql/                # GraphQL documents and generated code
│   ├── *.graphql.ts       # GraphQL documents
│   ├── schema.graphql     # Schema definition (fallback)
│   └── generated/         # Generated types and hooks
├── store/                  # Global state management
├── lib/                    # Library configurations
│   ├── apollo.ts          # Apollo client setup
│   └── dayjs.ts           # Day.js configuration
└── main.tsx               # Application entry point
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Backend API running on port 4000

### Installation

1. **Clone and install dependencies:**
```bash
cd web-template
pnpm install
```

2. **Set up environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Generate GraphQL types (optional):**
```bash
# This requires the backend API to be running
pnpm codegen
```

4. **Start development server:**
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | GraphQL API endpoint | `http://localhost:4000/graphql` |

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm codegen` | Generate GraphQL types from API |
| `pnpm lint` | Lint code |
| `pnpm format` | Format code |
| `pnpm gen:feature <name>` | Generate new feature |

## Authentication

The authentication system uses JWT tokens with automatic refresh:

### Token Management
- **Access tokens**: Stored in memory, sent via Authorization header
- **Refresh tokens**: Stored in httpOnly cookies, handled automatically

### Authentication Flow

1. **Login/Register**: User provides credentials
2. **Token Storage**: Access token in memory, refresh token in cookie
3. **API Requests**: Access token automatically added to requests
4. **Token Refresh**: Automatic refresh when access token expires
5. **Logout**: Clear tokens and redirect to login

### Protected Routes

```tsx
// All routes under /app require authentication
<Route
  path="/app/*"
  element={
    <ProtectedRoute>
      <AppLayout>
        {/* Protected content */}
      </AppLayout>
    </ProtectedRoute>
  }
/>
```

### Usage Example

```tsx
import { authStore } from '@/store/auth.store';

const LoginComponent = () => {
  const { setAuth, logout, user } = authStore();

  // Login
  const handleLogin = async () => {
    const result = await loginMutation({ variables: { input } });
    const { accessToken, user } = result.data.login;
    setAuth(accessToken, user);
  };

  // Logout
  const handleLogout = () => {
    logout(); // Clears store and Apollo cache
  };

  return <div>User: {user?.email}</div>;
};
```

## State Management

### Zustand Store

The application uses Zustand for simple, typed state management:

```tsx
import { authStore } from '@/store/auth.store';

// In component
const { user, accessToken, setAuth, logout } = authStore();

// Store structure
interface AuthStore {
  // State
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  
  // Actions
  setAuth: (accessToken: string, user: User) => void;
  logout: () => void;
  tryRefreshToken: () => Promise<boolean>;
  setLoading: (isLoading: boolean) => void;
}
```

## GraphQL Integration

### Apollo Client Setup

The Apollo client is configured with:
- Automatic authentication headers
- Error handling with token refresh
- Request/response logging

### Code Generation

Generate TypeScript types and hooks from your GraphQL schema:

```bash
pnpm codegen
```

This creates:
- Type definitions in `src/graphql/generated/`
- Typed hooks for queries and mutations
- Introspection data for tooling

### GraphQL Documents

```typescript
// src/graphql/auth.graphql.ts
import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        email
        role
      }
    }
  }
`;
```

### Using Generated Hooks

```tsx
import { useLoginMutation } from '@/graphql/generated/graphql';

const LoginForm = () => {
  const [login, { loading }] = useLoginMutation();
  
  const handleSubmit = async (values) => {
    const result = await login({
      variables: { input: values }
    });
    // Handle result
  };
};
```

## Ant Design Integration

### Theme Configuration

```tsx
// src/app/App.tsx
<ConfigProvider
  theme={{
    algorithm: compactAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
  }}
>
```

### Form Handling

Ant Design forms are used exclusively (no Formik/Yup):

```tsx
import { Form, Input, Button } from 'antd';

const MyForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Required' },
          { type: 'email', message: 'Invalid email' }
        ]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
```

## Adding New Features

Use the built-in generator to scaffold new features:

```bash
pnpm gen:feature posts
```

This creates:
- `src/features/posts/pages/PostsPage.tsx` - Main page component
- `src/features/posts/components/PostsList.tsx` - List component
- `src/features/posts/hooks/usePosts.ts` - Custom hooks
- `src/features/posts/graphql/posts.graphql.ts` - GraphQL documents

### Manual Feature Setup

1. **Create feature directory:**
```
src/features/posts/
├── pages/
├── components/
├── hooks/
└── graphql/
```

2. **Add route to AppRouter:**
```tsx
// src/app/AppRouter.tsx
<Routes>
  <Route path="posts" element={<PostsPage />} />
</Routes>
```

3. **Add navigation item:**
```tsx
// src/app/AppLayout.tsx
const menuItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'posts', label: 'Posts' },
];
```

### Feature Template Structure

```tsx
// Feature page component
export const PostsPage: React.FC = () => {
  const { posts, loading } = usePosts();
  
  return (
    <div>
      <Title level={2}>Posts</Title>
      <PostsList items={posts} loading={loading} />
    </div>
  );
};

// Feature hook
export const usePosts = () => {
  const { data, loading } = useQuery(GET_POSTS_QUERY);
  
  return {
    posts: data?.posts || [],
    loading,
  };
};
```

## Date Handling

Day.js is configured with essential plugins:

```tsx
import { dayjs } from '@/lib/dayjs';

// Usage
const formatted = dayjs(date).format('YYYY-MM-DD');
const relative = dayjs(date).fromNow();
const utc = dayjs(date).utc();
```

## Development Guidelines

### Component Structure

```tsx
// Feature component example
interface Props {
  title: string;
  items: Item[];
  onSelect?: (item: Item) => void;
}

export const ItemList: React.FC<Props> = ({ title, items, onSelect }) => {
  return (
    <Card title={title}>
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item onClick={() => onSelect?.(item)}>
            {item.name}
          </List.Item>
        )}
      />
    </Card>
  );
};
```

### Error Handling

```tsx
// Apollo error handling
const { data, loading, error } = useQuery(QUERY);

if (loading) return <Spin />;
if (error) return <Alert message="Error" description={error.message} type="error" />;
```

### TypeScript Best Practices

- Use generated types from GraphQL
- Define component prop interfaces
- Leverage TypeScript strict mode
- Use type assertions sparingly

## Building for Production

```bash
# Build the application
pnpm build

# Preview the build
pnpm preview
```

### Production Considerations

- Set `VITE_API_URL` to your production API
- Configure proper CORS on the backend
- Enable HTTPS in production
- Optimize bundle size with code splitting
- Set up proper error boundaries

## Testing

While not included in the template, recommended testing setup:

```bash
# Add testing dependencies
pnpm add -D @testing-library/react @testing-library/jest-dom vitest jsdom

# Component testing example
import { render, screen } from '@testing-library/react';
import { LoginPage } from './LoginPage';

test('renders login form', () => {
  render(<LoginPage />);
  expect(screen.getByText('Login')).toBeInTheDocument();
});
```

## Deployment

### Vite Build Output

```bash
pnpm build
# Output in dist/ folder
```

### Environment Variables

Create `.env.production`:
```env
VITE_API_URL=https://api.yourdomain.com/graphql
```

### Deployment Options

- **Vercel**: Zero-config deployment
- **Netlify**: Drag-and-drop or Git integration
- **AWS S3 + CloudFront**: Traditional hosting
- **Docker**: Containerized deployment

### Docker Example

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Troubleshooting

### Common Issues

1. **GraphQL codegen fails**: Ensure backend is running
2. **Authentication redirect loop**: Check token refresh logic
3. **CORS errors**: Configure backend CORS settings
4. **Build errors**: Clear node_modules and reinstall

### Debug Mode

```tsx
// Enable Apollo client debug
const client = new ApolloClient({
  connectToDevTools: true, // Enable in dev
});
```

## Contributing

1. Follow existing code patterns
2. Use Prettier for formatting
3. Add TypeScript types
4. Update documentation
5. Test authentication flows

## License

MIT
