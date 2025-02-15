// pages/cancel.js

// export async function getServerSideProps() {
//   return {
//     redirect: {
//       destination: '/',
//       permanent: false,
//     },
//   };
// }

// export default function Cancel() {
//   return null;
// }


// pages/cancel.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Cancel() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/');
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div className="cancel-container">
      <h1>Purchase Cancelled</h1>
      <p>You cancelled your purchase. Redirecting you to the homepage in {countdown}...</p>
      <button onClick={() => router.push('/')} className="return-button">
        Return Now
      </button>

      <style jsx>{`
        .cancel-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #f0f2f5;
          text-align: center;
          padding: 20px;
        }
        h1 {
          margin-bottom: 20px;
          font-size: 2rem;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 30px;
        }
        .return-button {
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          color: #fff;
          border: none;
          padding: 12px 20px;
          font-size: 1rem;
          border-radius: 5px;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }
        .return-button:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}