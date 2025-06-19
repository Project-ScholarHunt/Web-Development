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
    public $scholarshipName;

    /**
     * Create a new message instance.
     */
    public function __construct($applicant, $status, $note, $scholarshipName)
    {
        $this->applicant = $applicant;
        $this->status = $status;
        $this->note = $note;
        $this->scholarshipName = $scholarshipName;
    }

    public function build()
    {
        $isAccepted = $this->status === 'Accepted';

        $subject = $isAccepted
            ? '🎉 Congratulations! Your Scholarship Application Has Been Accepted'
            : 'Scholarship Application Update - Application Not Selected';

        $scholarshipName = $this->applicant->scholarships->name ?? 'Scholarship';

        $status = strtolower($this->status);

        switch ($status) {
            case 'accepted':
                $subject = 'Congratulations! Your Scholarship Application Has Been Accepted';
                $backgroundColor = '#e6f9ec';
                $titleColor = '#2e7d32';
                $message = "<p style='font-size: 16px;'>We are thrilled to inform you that your application for the <strong>{$this->scholarshipName}</strong> has been <strong>accepted</strong>! 🎉<br><br>Congratulations on this remarkable achievement. We look forward to your continued success!</p>";
                $title = "You've Been Accepted!";
                break;

            case 'rejected':
                $subject = 'Scholarship Application Update - Application Not Selected';
                $backgroundColor = '#ffe6e6';
                $titleColor = '#c62828';
                $message = "<p style='font-size: 16px;'>We regret to inform you that your application for the <strong>{$this->scholarshipName}</strong> has been <strong>rejected</strong>.<br><br>We sincerely appreciate the time and effort you put into your application and encourage you to apply again in the future.</p>";
                $title = "Application Result Notification";
                break;

            case 'under review':
            default:
                $subject = 'Scholarship Application Update - Under Review';
                $backgroundColor = '#e3f2fd';
                $titleColor = '#1565c0';
                $message = "<p style='font-size: 16px;'>Your application for <strong>{$this->scholarshipName}</strong> is currently <strong>under review</strong>.<br><br>We appreciate your patience while our team evaluates all submissions. We will notify you once there is an update.</p>";
                $title = "Application Under Review";
                break;
        }

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
                        <h1 style='color: {$titleColor}; font-size: 24px; margin-bottom: 20px;'>{$title}</h1>
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
                'scholarshipName' => $this->scholarshipName,
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
