// netlify/functions/verify-recaptcha.js
// Serverless function to verify reCAPTCHA v3 tokens server-side

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
  if (!RECAPTCHA_SECRET) {
    console.error('RECAPTCHA_SECRET_KEY not set in environment variables');
    return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Server config error' }) };
  }

  try {
    const { token, action } = JSON.parse(event.body);

    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'No reCAPTCHA token provided' }),
      };
    }

    // Verify token with Google
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET}&response=${token}`,
    });

    const data = await response.json();

    // Check score (0.0 = likely bot, 1.0 = likely human)
    // Threshold of 0.5 is Google's recommended default
    const passed = data.success && data.score >= 0.5 && (!action || data.action === action);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: passed,
        score: data.score,
        action: data.action,
      }),
    };
  } catch (err) {
    console.error('reCAPTCHA verification error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Verification failed' }),
    };
  }
};
