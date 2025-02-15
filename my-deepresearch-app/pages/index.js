// pages/index.js
import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import fs from 'fs';
import path from 'path';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Home({ placeholders }) {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [shuffled, setShuffled] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Shuffle placeholders once on mount
    const shuffledArray = [...placeholders].sort(() => Math.random() - 0.5);
    setShuffled(shuffledArray);
    setCurrentPlaceholder(shuffledArray[0]);
    setPlaceholderIndex(0);

    // Rotate placeholder every 5s if user hasn't typed
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => {
        const nextIndex = (prev + 1) % shuffledArray.length;
        setCurrentPlaceholder(shuffledArray[nextIndex]);
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [placeholders]);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ researchPrompt: prompt }),
      });
      const data = await res.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Auto-resize the textarea up to 400px
  const handleInputChange = (e) => {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 400);
      textareaRef.current.style.height = newHeight + 'px';
      textareaRef.current.style.overflowY =
        textareaRef.current.scrollHeight > 300 ? 'auto' : 'hidden';
    }
  };

  // Placeholder fades out if user types
  const fadeDuration = (!prompt || prompt.trim() === '') ? 0.4 : 0;

  return (
    <div className="container">
      <div className="card">
        <h1>AI Deep Research Service</h1>

        {/* Bubble container */}
        <div className="input-bubble">
          {/* Placeholder overlay */}
          <div className="placeholder-overlay">
            <AnimatePresence mode="wait">
              {(!prompt || prompt.trim() === '') && (
                <motion.span
                  key={currentPlaceholder}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: fadeDuration }}
                  className="rotating-placeholder"
                >
                  {currentPlaceholder}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Text area for user input */}
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={handleInputChange}
            rows={1}
          />

          {/* Send button pinned bottom-right */}
          <button onClick={handleCheckout} disabled={loading} className="send-button">
            {loading ? '...' : <i className="bi bi-arrow-right-circle-fill"></i>}
          </button>
        </div>

        <div className="tips">
          <h2>What makes a great research prompt?</h2>
          <ol>
            <li>
              <strong>Context, context, context:</strong> Think of your prompt like a detailed brief—not a quick question. The more background, data, or failed attempts you include, the better. If you have any doubts, add even more context.
            </li>
            <li>
              <strong>Specify the Goal, Not the Method:</strong> Don’t tell the AI how to solve it; tell it exactly what you want in the final output (e.g. “a 3-page report with pros/cons and a final recommendation”). Let the AI figure out the reasoning.
            </li>
            <li>
              <strong>Focus on a Single, Well-Defined Ask:</strong> Trying to tackle multiple goals at once leads to muddled results. Zero in on one major outcome—whether that’s a research paper, a piece of code, or a specific evaluation.
            </li>
            <li>
              <strong>Include Relevant Attempts & Constraints:</strong> If you’ve already tried certain solutions or if there are specific limitations (like budget, timeline, or style), spell them out. Treat it like briefing a new hire on day one.
            </li>
          </ol>
        </div>

        <div className="examples">
          <h2>Example Reports</h2>
          <div className="grid">
            <div className="grid-item">Example 1</div>
            <div className="grid-item">Example 2</div>
            <div className="grid-item">Example 3</div>
            <div className="grid-item">Example 4</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Overall page layout */
        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f0f2f5;
          padding: 20px;
        }
        .card {
          background: #fff;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          max-width: 600px;
          width: 100%;
          text-align: center;
        }
        h1 {
          margin-bottom: 20px;
        }

        /* The bubble container for the text area + placeholder + button */
        .input-bubble {
          position: relative;
          border: 1px solid #ddd;
          border-radius: 24px;
          padding: 8px 12px;
          margin: 0 auto 30px;
          max-width: 550px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }

        /* Placeholder overlay absolutely placed near top, leaving space for the button on right */
        .placeholder-overlay {
          position: absolute;
          top: 10px;
          left: 24px;
          right: 50px; /* space for button on the right */
          pointer-events: none;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #6c757d;
          z-index: 1;
        }
        .rotating-placeholder {
          font-size: 15px;
        }

        /* Auto-resizing textarea */
        .input-bubble textarea {
          width: 100%;
          border: none;
          outline: none;
          font-size: 15px;
          font-family: inherit;
          resize: none;
          background: transparent;
          line-height: 1.4;
          min-height: 20px;
          max-height: 300px;
          overflow-y: hidden;
          padding-left: 12px; /* so typed text doesn't overlap the placeholder on left */
          padding-right: 50px; /* space for button on the right */
        }

        /* Send button pinned bottom-right */
        .send-button {
          position: absolute;
          bottom: 8px;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 20px;
          color: #333;
          z-index: 3;
        }
        .send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .tips {
          text-align: left;
          margin-bottom: 30px;
        }
        .tips h2 {
          margin-bottom: 10px;
        }
        .tips ol {
          padding-left: 20px;
        }
        .tips li {
          margin-bottom: 8px;
        }

        .examples h2 {
          margin-bottom: 10px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 10px;
        }
        .grid-item {
          background: #e9ecef;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}

// Load placeholders from a text file (each line = one prompt)
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'placeholders.txt');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const placeholders = fileContent
    .split('\n')
    .map((l) => l.trim())
    .filter((line) => line !== '');
  return {
    props: { placeholders },
  };
}