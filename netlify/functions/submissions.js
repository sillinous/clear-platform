// Netlify Function: Process Submissions API
// Handles CRUD operations for crowdsourced process data

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const supabase = getSupabase();
  
  // If Supabase not configured, use localStorage fallback messaging
  if (!supabase) {
    return handleWithoutSupabase(event, headers);
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        return await getSubmissions(supabase, event, headers);
      case 'POST':
        return await createSubmission(supabase, event, headers);
      case 'PUT':
        return await updateSubmission(supabase, event, headers);
      case 'DELETE':
        return await deleteSubmission(supabase, event, headers);
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Submission API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Get submissions (with optional filters)
async function getSubmissions(supabase, event, headers) {
  const params = event.queryStringParameters || {};
  
  let query = supabase
    .from('process_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status);
  }
  
  if (params.state) {
    query = query.eq('state', params.state);
  }
  
  if (params.category) {
    query = query.eq('category', params.category);
  }
  
  if (params.limit) {
    query = query.limit(parseInt(params.limit));
  }

  const { data, error } = await query;

  if (error) throw error;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ submissions: data }),
  };
}

// Create new submission
async function createSubmission(supabase, event, headers) {
  const submission = JSON.parse(event.body);
  
  // Validate required fields
  if (!submission.process_name || !submission.category || !submission.state) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  const { data, error } = await supabase
    .from('process_submissions')
    .insert({
      ...submission,
      status: 'pending',
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({ submission: data }),
  };
}

// Update submission (for admin approval/rejection)
async function updateSubmission(supabase, event, headers) {
  const { id, ...updates } = JSON.parse(event.body);
  
  if (!id) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Submission ID required' }),
    };
  }

  const { data, error } = await supabase
    .from('process_submissions')
    .update({
      ...updates,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ submission: data }),
  };
}

// Delete submission
async function deleteSubmission(supabase, event, headers) {
  const { id } = JSON.parse(event.body);
  
  if (!id) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Submission ID required' }),
    };
  }

  const { error } = await supabase
    .from('process_submissions')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true }),
  };
}

// Fallback when Supabase is not configured
function handleWithoutSupabase(event, headers) {
  if (event.httpMethod === 'POST') {
    const submission = JSON.parse(event.body);
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'Submission received (stored locally - Supabase not configured)',
        submission: {
          ...submission,
          id: `local-${Date.now()}`,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      }),
    };
  }
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: 'Supabase not configured - using local storage',
      submissions: [],
    }),
  };
}
