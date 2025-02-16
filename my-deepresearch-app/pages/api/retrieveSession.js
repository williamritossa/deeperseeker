// pages/api/retrieveSession.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { session_id } = req.query;
    if (!session_id) {
      throw new Error('Missing session_id');
    }

    // Retrieve the session from Stripe, expanding customer_details only.
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['customer_details'],
    });

    // Extract email from customer_email or customer_details.email.
    const retrievedName = (session.customer_details && session.customer_details.name) || "Missing";
    const retrievedEmail = session.customer_email || (session.customer_details && session.customer_details.email) || "Missing";
    const retrievedPrompt = session.metadata?.researchPrompt || "Missing";

    console.log('Retrieved session details:');
    console.log('Email:', retrievedEmail);
    console.log('Name:', retrievedName);
    console.log('Research Prompt:', retrievedPrompt);

    res.status(200).json({ ...session, retrievedEmail, retrievedPrompt });
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ error: error.message });
  }
}