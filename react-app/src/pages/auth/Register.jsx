import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const register = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    register.mutate(form);
  };

  const fieldErrors = register.error?.response?.data?.errors ?? {};

  const field = (key, label, type = 'text') => (
    <div className="space-y-1">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        required
      />
      {fieldErrors[key] && (
        <p className="text-start text-destructive font-medium">{fieldErrors[key][0]}</p>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-1/2 p-3">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {field('name', 'Full name')}
            {field('email', 'Email', 'email')}
            {field('password', 'Password', 'password')}
            {field('password_confirmation', 'Confirm password', 'password')}

            <Button type="submit" className="w-1/2 mb-1 bg-accent text-white hover:bg-accent-darker" disabled={register.isPending}>
              {register.isPending ? 'Creating account...' : 'Register'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground hover:text-black transition-all duration-300">
            Already have an account?{' '}
            <Link to="/login" className="underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}