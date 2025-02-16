// pages/success.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [researchQuery, setResearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // If session_id is present, fetch session data from Stripe.
    if (session_id) {
      const fetchSession = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/retrieveSession?session_id=${session_id}`);
          if (!res.ok) {
            throw new Error('Failed to retrieve session data.');
          }
          const session = await res.json();
          // Extract name and email from expanded customer_details.
          const retrievedName =
            (session.customer_details && session.customer_details.name) || "Missing";
          const retrievedEmail =
            session.customer_email ||
            (session.customer_details && session.customer_details.email) ||
            "Missing";
          const retrievedPrompt = session.metadata?.researchPrompt || "Missing";

          setName(retrievedName);
          setEmail(retrievedEmail);
          setResearchQuery(retrievedPrompt);

          // Save the retrieved data to localStorage
          const sessionData = {
            name: retrievedName,
            email: retrievedEmail,
            researchQuery: retrievedPrompt,
          };
          localStorage.setItem('sessionData', JSON.stringify(sessionData));

          // Append the data to Google Sheets.
          const sheetRes = await fetch('/api/appendSheet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: retrievedName,
              email: retrievedEmail,
              researchPrompt: retrievedPrompt,
            }),
          });
          if (!sheetRes.ok) {
            throw new Error('Failed to append data to the sheet.');
          }
          setSubmitted(true);
          // Clear query parameters so a refresh doesn't trigger duplicate submission.
          router.replace('/success');
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchSession();
    } else {
      // If no session_id is in the URL, load stored session data.
      const storedData = localStorage.getItem('sessionData');
      if (storedData) {
        const { name, email, researchQuery } = JSON.parse(storedData);
        setName(name);
        setEmail(email);
        setResearchQuery(researchQuery);
        setSubmitted(true);
      }
    }
  }, [session_id, router]);

  return (
    <main>
      <h1>Payment Successful!</h1>
      <div>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Research Query:</strong> {researchQuery}</p>
      </div>
      {submitted ? (
        <p>Your research request has been submitted. We'll start working on it soon!</p>
      ) : (
        <p>{loading ? 'Loading session data...' : 'Submitting your request...'}</p>
      )}
    </main>
  );
}