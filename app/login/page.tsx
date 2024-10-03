'use client';
import { login } from '@/app/login/actions';
import './login.css';

export default function LoginPage() {
  return (
    <div className='login-container'>
      <form className='login-form' method='post' action='/api/login'>
        <h2 className='login-title'>Log In</h2>
        <label htmlFor='email' className='login-label'>
          Email:
        </label>
        <input
          id='email'
          name='email'
          type='email'
          className='login-input'
          required
        />

        <label htmlFor='password' className='login-label'>
          Password:
        </label>
        <input
          id='password'
          name='password'
          type='password'
          className='login-input'
          required
        />

        <button className='login-button' formAction={login}>
          Log in
        </button>
      </form>
    </div>
  );
}
