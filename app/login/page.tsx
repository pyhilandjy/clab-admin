import { login } from '@/app/login/actions';

export default function LoginPage() {
  return (
    <form method='post' action='/api/login'>
      <label htmlFor='email'>Email:</label>
      <input id='email' name='email' type='email' required />
      <label htmlFor='password'>Password:</label>
      <input id='password' name='password' type='password' required />
      <button formAction={login}>Log in</button>
      {/* <button formAction={signup}>Sign up</button> */}
    </form>
  );
}
