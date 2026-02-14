// Netlify Function: Feedback API
// Handles bug reports, feature requests, and general feedback

import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const feedback = JSON.parse(event.body);
    
    // Validate required fields
    if (!feedback.type || !feedback.message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Type and message are required' }),
      };
    }

    // Validate type
    const validTypes = ['bug', 'feature', 'general'];
    if (!validTypes.includes(feedback.type)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid feedback type' }),
      };
    }

    const supabase = getSupabase();

    if (supabase) {
      // Store in Supabase
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          type: feedback.type,
          page: feedback.page || null,
          message: feedback.message,
          email: feedback.email || null,
          status: 'new',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Thank you for your feedback!',
          id: data.id,
        }),
      };
    } else {
      // No Supabase - just acknowledge receipt
      console.log('Feedback received:', feedback);
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Thank you for your feedback!',
          note: 'Stored locally (Supabase not configured)',
        }),
      };
    }

  } catch (error) {
    console.error('Feedback API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
