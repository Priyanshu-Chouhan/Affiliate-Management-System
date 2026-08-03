import { FormEvent } from 'react';

export const LoginPage = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Login form submitted');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};
