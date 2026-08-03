import { FormEvent } from 'react';

export const RegisterPage = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Register form submitted');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
};
