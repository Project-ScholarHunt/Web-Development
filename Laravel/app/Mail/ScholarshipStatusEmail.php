<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ScholarshipStatusEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $applicant;
    public $status;
    public $note;

    /**
     * Create a new message instance.
     */
    public function __construct($applicant, $status, $note)
    {
        $this->applicant = $applicant;
        $this->status = $status;
        $this->note = $note;
    }

    public function build()
    {
        $isAccepted = $this->status === 'Accepted';

        $subject = $isAccepted
            ? '🎉 Congratulations! Your Scholarship Application Has Been Accepted'
            : 'Scholarship Application Update - Application Not Selected';

        $scholarshipName = $this->applicant->scholarships->name ?? 'Scholarship';

        $backgroundColor = $isAccepted ? '#e6f9ec' : '#ffe6e6';
        $titleColor = $isAccepted ? '#2e7d32' : '#c62828';

        $message = $isAccepted
            ? "<p style='font-size: 16px;'>We are thrilled to inform you that your application for the <strong>{$scholarshipName}</strong> has been <strong>accepted</strong>! 🎉<br><br>Congratulations on this remarkable achievement. We look forward to your continued success!</p>"
            : "<p style='font-size: 16px;'>We regret to inform you that your application for the <strong>{$scholarshipName}</strong> has not been selected.<br><br>We sincerely appreciate the time and effort you put into your application and encourage you to apply again in the future.</p>";

        $noteSection = !empty($this->note)
            ? "<div style='margin-top: 20px;'>
                <h3 style='margin-bottom: 10px;'>Note from the Committee</h3>
                <p style='background-color: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;'>{$this->note}</p>
            </div>"
            : "";

        $content = "
        <html>
            <body style='margin: 0; padding: 20px; background-color: {$backgroundColor}; font-family: Arial, sans-serif;'>
                <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
                    <div style='text-align: center;'>
                        <img src='https://i.imgur.com/vzeC6GR.png' alt='Logo' style='width: 100px; margin-bottom: 20px;' />
                        <h1 style='color: {$titleColor}; font-size: 24px; margin-bottom: 20px;'>
                            " . ($isAccepted ? "🎉 You've Been Accepted!" : "Application Result Notification") . "
                        </h1>
                    </div>
                    <p style='font-size: 16px;'>Dear {$this->applicant->fullname},</p>
                    {$message}
                    {$noteSection}
                    <p style='margin-top: 30px;'>If you have any questions, please feel free to contact us.</p>
                    <p style='margin-top: 10px;'>Best regards,<br><strong>Scholar Hunt Team</strong></p>
                </div>
            </body>
        </html>
    ";

        return $this->subject($subject)
            ->html($content)
            ->with([
                'applicant' => $this->applicant,
                'status' => $this->status,
                'note' => $this->note,
                'scholarshipName' => $scholarshipName,
            ]);
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
