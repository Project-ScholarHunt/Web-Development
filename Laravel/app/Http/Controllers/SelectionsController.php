<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Selections;
use App\Models\Applicants;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ScholarshipStatusEmail;

class SelectionsController extends Controller
{
    public function sendEmail(Request $request)
    {
        $validated = $request->validate([
            'applicant_id' => 'required|exists:applicants,applicant_id',
            'status' => 'required',
            'note' => 'nullable|string|max:1000',
        ]);

        try {
            $applicant = Applicants::with('user', 'scholarships')->findOrFail($validated['applicant_id']);
            $selection = Selections::where('applicant_id', $validated['applicant_id'])->firstOrFail();
            
            // Update the selection with the note
            $selection->update(['note' => $validated['note'] ?? '']);

            $applicant = $selection->applicant;
            $scholarshipName = $applicant->scholarships->first()->scholarship_name ?? 'Scholarship';

            // Send email
            Mail::to($applicant->user->email)->send(new ScholarshipStatusEmail(
                $applicant,
                $validated['status'],
                $validated['note'] ?? '',
                $scholarshipName
            ));

            Log::info('Email sent to applicant ID: ' . $applicant->applicant_id . ' with status: ' . $validated['status']);
            return response()->json(['message' => 'Email sent successfully.']);
        } catch (\Exception $e) {
            Log::error('Failed to send email: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to send email. Error: ' . $e->getMessage()], 500);
        }
    }
}
