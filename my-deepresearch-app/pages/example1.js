// pages/exampleLoyalty.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import fs from 'fs';
import path from 'path';

export default function ExampleLoyalty({ markdownContent }) {
  return (
    <div className="report-page">
      <div className="report-wrapper">
        <div className="report-header">
          {/* Optional: Could display a title, date, or other metadata here */}
          {/* <h1>Loyalty Marketplace Report</h1> */}
        </div>
        <div className="report-content">
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background: #f2f0ec;
          font-family: Arial, sans-serif;
          color: #333;
        }

        /* 
          Main container that centers the "paper" on the page 
          and adds top/bottom space 
        */
        .report-page {
          display: flex;
          justify-content: center;
          padding: 40px 0; /* space above/below the paper */
          min-height: 100vh;
          background: #f2f0ec;
        }

        /*
          The "paper" container that mimics an A4 page.
          We set a fixed width for A4 in pixels, 
          plus some margin/padding for a "printable" look.
        */
        .report-wrapper {
          background: #fff;
          width: 794px; /* ~A4 width in px */
          min-height: 1123px; /* ~A4 height in px, but can grow */
          padding: 40px 50px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        /* 
          Header area (optional). 
          Could hold a big title, date, or your branding. 
        */
        .report-header {
          margin-bottom: 30px;
          text-align: center;
        }
        .report-header h1 {
          font-size: 1.8rem;
          margin: 0;
        }

        /*
          The main content area that holds your markdown.
          We'll define typical "print-friendly" margins 
          and line spacing for readability.
        */
        .report-content {
          font-size: 16px;
          line-height: 1.5;
          max-width: 700px;
          margin: 0 auto;
        }

        .report-content h1,
        .report-content h2,
        .report-content h3,
        .report-content h4,
        .report-content h5,
        .report-content h6 {
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        .report-content p {
          margin-bottom: 1em;
        }

        .report-content a {
          color: #0070f3;
          text-decoration: none;
        }

        .report-content code {
          font-family: "Courier New", Courier, monospace;
          background-color: #f4f4f4;
          padding: 2px 4px;
          border-radius: 4px;
        }

        .report-content pre code {
          background-color: #f4f4f4;
          padding: 10px;
          display: block;
          overflow-x: auto;
        }

        /* 
          Print styling for actual paper printing. 
          This ensures that if someone does ctrl+P, 
          it stays a nice A4 format with minimal margins 
          and no extra background.
        */
        @media print {
          body {
            background: #fff;
          }
          .report-page {
            padding: 0;
          }
          .report-wrapper {
            width: 100%;
            min-height: auto;
            box-shadow: none;
            margin: 0;
            padding: 20mm 20mm; /* typical A4 print margins */
          }
          .report-content {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  // Load your markdown file from "markdown_reports/loyalty_marketplace.md"
  const filePath = path.join(process.cwd(), 'markdown_reports', 'loyalty_marketplace.md');
  const markdownContent = fs.readFileSync(filePath, 'utf8');
  return {
    props: { markdownContent },
  };
}