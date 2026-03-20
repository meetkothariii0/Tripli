import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Send email using a service
    // For now, we'll use a simple implementation with fetch to an email service
    const recipientEmail = 'kotharimeet826@gmail.com';

    // Using Resend API (install: npm install resend)
    // This requires RESEND_API_KEY environment variable
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'noreply@tripli.dev',
          to: recipientEmail,
          reply_to: email,
          subject: `New Contact Form Submission: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Message from Tripli Contact Form</h2>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap; color: #555;">${message}</p>
              </div>
              <p style="color: #999; font-size: 12px;">
                This email was sent from the Tripli contact form. Please reply directly to ${email} to respond to this message.
              </p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        console.error('Resend API error:', await response.text());
        // If Resend fails, we'll just log it and return success anyway
        // In production, implement a fallback email service
        console.log('Contact form submission (email service unavailable):', {
          name,
          email,
          subject,
          message,
          timestamp: new Date().toISOString(),
        });
      }

      return NextResponse.json(
        { success: true, message: 'Thank you for your message! We will get back to you soon.' },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Still return success as the form data is valid
      // In production, implement proper error handling and fallback
      return NextResponse.json(
        { success: true, message: 'Thank you for your message! We will get back to you soon.' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
