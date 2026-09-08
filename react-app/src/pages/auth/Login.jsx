import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const login = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login.mutate(form);
  };

  // Laravel validation errors come back shaped as { errors: { email: [...] } }
  const fieldErrors = login.error?.response?.data?.errors ?? {};

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              {fieldErrors.email && (
                <p className="text-start text-text-destructive font-medium">{fieldErrors.email[0]}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-1/2 mb-1 bg-accent text-white hover:bg-accent-darker" disabled={login.isPending}>
              {login.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground hover:text-black transition-all duration-300">
            No account?{' '}
            <Link to="/register" className="underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}