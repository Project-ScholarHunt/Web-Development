<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RegisterVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $url;

    public function __construct($url)
    {
        $this->url = $url;
    }

    public function build()
    {
        return $this
            ->subject('Verify your email')
            ->html("
            <html>
                <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                    <div style='max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);'>
                        <div style='text-align: center;'>
                            <img src='https://i.imgur.com/vzeC6GR.png' alt='Logo' style='width: 120px; margin-bottom: 20px;' />
                        </div>
                        <h2 style='color: #333333;'>Hello!</h2>
                        <p style='color: #555555;'>Dear Scholar Hunter,</p>
                        <p style='color: #555555;'>Thank you for registering with our platform. We’re excited to have you join the Scholar Hunt community.</p>
                        <p style='color: #555555;'>Please click the button below to verify your email address and login to Scholar Hunt:</p>
                        <div style='text-align: center; margin: 30px 0;'>
                            <a href=\"{$this->url}\"
                            style='background-color: #0d6efd; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px; display: inline-block;'>
                                Verify Email
                            </a>
                        </div>
                        <p style='color: #6c757d; font-size: 14px;'>If you did not create an account, please ignore this message.</p>
                        <br>
                        <p style='color: #555555;'>Best regards,</p>
                        <p style='color: #333333; font-weight: bold;'>Scholar Hunt Team</p>
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
