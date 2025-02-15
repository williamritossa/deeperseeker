// pages/success.js
import { useState } from 'react';

export default function Success() {
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here, you'd either:
    // 1) Send data to a serverless API route so you store it in DB
    // 2) Or rely on Zapier to capture a form submission
    alert('Form submitted. We will start your research soon!');
  };

  return (
    <main>
      <h1>Payment Successful!</h1>
      <p>Thanks for purchasing. Please enter your research request.</p>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <label>Your Research Query:</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={5}
        ></textarea>
        <br />
        <button type='submit'>Submit Request</button>
      </form>
    </main>
  );
}