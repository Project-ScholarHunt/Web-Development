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
        $subject = $this->status === 'Accepted'
            ? 'Congratulations! Your Scholarship Application Has Been Accepted'
            : 'Scholarship Application Update';

        $scholarshipName = $this->applicant->scholarships->name ?? 'Scholarship';

        $content = "
            <html>
                <body>
                    <h1>Scholarship Application Update</h1>
                    <p>Dear {$this->applicant->fullname},</p>
                    " . ($this->status === 'Accepted' ? "
                        <p>We are thrilled to inform you that your application for the <strong>{$scholarshipName}</strong> has been <strong>accepted</strong>! Congratulations on this achievement!</p>
                    " : "
                        <p>We regret to inform you that your application for the <strong>{$scholarshipName}</strong> has been <strong>rejected</strong>. We appreciate your effort and encourage you to apply for future opportunities.</p>
                    ") . "
                    " . (!empty($this->note) ? "
                        <h3>Note from the Committee</h3>
                        <p>{$this->note}</p>
                    " : '') . "
                    <p>If you have any questions, please feel free to contact us.</p>
                    <p>Best regards,<br>Scholar Hunt Team</p>
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
