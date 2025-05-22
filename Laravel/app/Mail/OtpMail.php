<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public string $otp;
    public string $name;

    public function __construct($otp, $name)
    {
        $this->otp = $otp;
        $this->name = $name;
    }

    public function build()
    {
        return $this
            ->subject("Your OTP Code to Login into ScholarHunt")
            ->html("
                <html>
                  <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px; margin: 0;'>
                    <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);'>
                      <div style='text-align: center;'>
                        <img src='https://i.imgur.com/vzeC6GR.png' alt='Logo' style='width: 100px; margin-bottom: 20px;' />
                        <h2 style='color: #333;'>Your Two-Factor Sign-in Code</h2>
                      </div>

                      <div style='background-color: #f0f0f0; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0;'>
                        <h1 style='font-size: 36px; letter-spacing: 4px; color: #333;'>{$this->otp}</h1>
                      </div>

                      <p style='color: #555; font-size: 16px;'>Hi <strong>{$this->name}</strong>,</p>
                      <p style='color: #555; font-size: 16px;'>
                        Use the code above to complete your sign-in process. This code is valid for the next 5 minutes.
                      </p>
                      <p style='color: #888; font-size: 14px;'>
                        If you didn't request this, you can safely ignore this message.
                      </p>

                      <hr style='margin: 30px 0; border: none; border-top: 1px solid #eee;' />
                      <p style='color: #999; font-size: 14px;'>Regards,<br><strong style='color: #333;'>Scholar Hunt Team</strong></p>
                    </div>
                  </body>
                </html>
            ");
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Scholar Hunt',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
