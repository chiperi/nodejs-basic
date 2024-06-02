import { NextResponse } from 'next/server';

export default function handler(req, res) {
    if (req.method === 'POST') {
      // Handle POST request
      const data = req.body; // Access the request body
    
      // Process the data and perform any necessary operations
  
      // Return a response
      res.status(200).json({ message: 'POST request received', data });
    } else {
      // Return an error response for unsupported methods
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }