<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Applicants;
use App\Models\Scholarships;
use App\Models\Selections;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ApplicantsController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'scholarship_id' => 'required|exists:scholarships,scholarship_id',
            'fullname' => 'required|string|max:255',
            'nim' => 'required|string|max:255',
            'semester' => 'required|integer',
            'university' => 'required|string|max:255',
            'major' => 'required|string|max:255',
            'ipk' => 'required|numeric|between:0,4.0',
            'city' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'recommendation_letter' => 'required|file|mimes:pdf|max:2048',
            'statement_letter' => 'required|file|mimes:pdf|max:2048',
            'grade_transcript' => 'required|file|mimes:pdf|max:2048',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $scholarship = Scholarships::findOrFail($validated['scholarship_id']);
            if ($scholarship->quota <= 0) {
                return response()->json(['message' => 'Scholarship quota is full.'], 400);
            }

            $user = $request->user();
            if (!$user) {
                return response()->json(['message' => 'User not authenticated.'], 401);
            }

            $existingApplication = Applicants::where('user_id', $user->id)
                ->where('scholarship_id', $validated['scholarship_id'])
                ->exists();
            if ($existingApplication) {
                return response()->json(['message' => 'You have already applied for this scholarship.'], 400);
            }

            try {
                $recommendationLetterPath = $request->file('recommendation_letter')->store('documents', 'public');
                $statementLetterPath = $request->file('statement_letter')->store('documents', 'public');
                $gradeTranscriptPath = $request->file('grade_transcript')->store('documents', 'public');
            } catch (\Exception $e) {
                Log::error('File upload failed: ' . $e->getMessage());
                return response()->json(['message' => 'Failed to upload documents. Please try again.'], 500);
            }

            $applicant = Applicants::create([
                'scholarship_id' => $validated['scholarship_id'],
                'user_id' => $user->id,
                'fullname' => $validated['fullname'],
                'nim' => $validated['nim'],
                'semester' => $validated['semester'],
                'university' => $validated['university'],
                'major' => $validated['major'],
                'ipk' => $validated['ipk'],
                'registration_date' => now(),
                'recommendation_letter' => $recommendationLetterPath,
                'statement_letter' => $statementLetterPath,
                'grade_transcript' => $gradeTranscriptPath,
                'city' => $validated['city'],
                'province' => $validated['province'],
                'postal_code' => $validated['postal_code'],
                'address' => $validated['address'],
            ]);

            Log::info('Created applicant with ID: ' . $applicant->applicant_id);

            if (!$applicant->applicant_id) {
                Log::error('Applicant ID is null after creation.');
                return response()->json(['message' => 'Failed to create applicant record.'], 500);
            }

            Selections::create([
                'applicant_id' => $applicant->applicant_id,
                'status' => 'Pending',
                'note' => '',
            ]);

            $scholarship->decrement('quota');

            return response()->json([
                'message' => 'Application submitted successfully!',
                'applicant' => $applicant,
            ], 201);
        });
    }

    public function checkApplication(Request $request, $scholarshipId)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated.'], 401);
        }

        $applied = Applicants::where('user_id', $user->id)
            ->where('scholarship_id', $scholarshipId)
            ->exists();

        return response()->json(['applied' => $applied]);
    }

    public function myApplications(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated.'], 401);
        }

        try {
            $applications = Applicants::with(['scholarships', 'selection'])
                ->where('user_id', $user->id)
                ->get()
                ->map(function ($applicant) {
                    Log::info('Raw registration_date:', [$applicant->registration_date]);

                    $registrationDate = $applicant->registration_date;
                    if ($registrationDate instanceof \DateTime) {
                        $registrationDate = \Carbon\Carbon::instance($registrationDate);
                    } elseif (is_string($registrationDate) && !empty(trim($registrationDate))) {
                        $registrationDate = \Carbon\Carbon::parse($registrationDate);
                    } else {
                        $registrationDate = \Carbon\Carbon::now();
                        Log::warning('Invalid registration_date for applicant ID: ' . $applicant->applicant_id . ', using current date');
                    }

                    return [
                        'id' => $applicant->applicant_id,
                        'scholarshipId' => $applicant->scholarship_id,
                        'name' => $applicant->scholarships->name ?? 'N/A',
                        'partner' => $applicant->scholarships->partner ?? 'N/A',
                        'logo' => $applicant->scholarships->logo ?? 'https://via.placeholder.com/150',
                        'status' => $applicant->selection->status ?? 'Pending',
                        'applicationDate' => $registrationDate->toDateString(),
                        'progressStage' => $this->getProgressStage($applicant->selection->status ?? 'Pending'),
                        'applicantData' => [
                            'studentId' => $applicant->nim,
                            'nextSemester' => $applicant->semester,
                            'major' => $applicant->major,
                            'gpa' => $applicant->ipk,
                        ],
                        'uploadedDocuments' => [
                            ['name' => 'Recommendation_Letter.pdf', 'size' => '420KB', 'uploadedAt' => $registrationDate->toDateString()],
                            ['name' => 'Statement_Letter.pdf', 'size' => '350KB', 'uploadedAt' => $registrationDate->toDateString()],
                            ['name' => 'Grade_Transcript.pdf', 'size' => '1.2MB', 'uploadedAt' => $registrationDate->toDateString()],
                        ],
                    ];
                });

            return response()->json($applications);
        } catch (\Exception $e) {
            Log::error('Error in myApplications: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to load applications. Please try again.'], 500);
        }
    }

    private function getProgressStage($status)
    {
        switch (strtolower($status)) {
            case 'pending':
                return 0;
            case 'under review':
                return 1;
            case 'interview':
                return 2;
            case 'accepted':
            case 'rejected':
                return 3;
            default:
                return 0;
        }
    }

    public function index(Request $request)
    {
        $applicants = Applicants::with(['user', 'scholarships', 'selection'])
            ->get()
            ->map(function ($applicant) {
                return [
                    'id' => $applicant->applicant_id,
                    'name' => $applicant->fullname,
                    'email' => $applicant->user->email ?? 'N/A',
                    'nim' => $applicant->nim,
                    'semester' => $applicant->semester,
                    'university' => $applicant->university,
                    'major' => $applicant->major,
                    'ipk' => $applicant->ipk,
                    'address' => $applicant->address,
                    'city' => $applicant->city,
                    'province' => $applicant->province,
                    'postal_code' => $applicant->postal_code,
                    'recommendation_letter' => $applicant->recommendation_letter,
                    'statement_letter' => $applicant->statement_letter,
                    'grade_transcript' => $applicant->grade_transcript,
                    'scholarship_id' => $applicant->scholarship_id,
                    'scholarship' => [
                        'id' => $applicant->scholarship_id,
                        'scholarshipName' => $applicant->scholarships->name ?? 'N/A',
                    ],
                    'status' => $applicant->selection->status ?? 'pending',
                    'note' => $applicant->selection->note ?? '',
                    'created_at' => $applicant->created_at->toISOString(),
                ];
            });

        return response()->json($applicants);
    }

    public function updateStatus(Request $request, $applicantId)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:Pending,Under Review,Interview,Accepted,Rejected',
            ]);

            $selection = Selections::where('applicant_id', $applicantId)->first();
            if (!$selection) {
                $applicant = Applicants::find($applicantId);
                if (!$applicant) {
                    Log::warning('Applicant not found for applicant_id: ' . $applicantId);
                    return response()->json(['message' => 'Applicant not found.'], 404);
                }

                $selection = Selections::create([
                    'applicant_id' => $applicantId,
                    'status' => 'Pending',
                    'note' => '',
                ]);
                Log::info('Created new Selections record for applicant_id: ' . $applicantId);
            }

            if (!$selection) {
                Log::error('Failed to create or retrieve Selections record for applicant_id: ' . $applicantId);
                return response()->json(['message' => 'Failed to process selection record.'], 500);
            }

            Log::debug('Selection object before update: ' . json_encode($selection->toArray()));

            $success = $selection->update(['status' => $validated['status']]);
            if (!$success) {
                Log::error('Failed to update status for applicant_id: ' . $applicantId);
                return response()->json(['message' => 'Failed to update status.'], 500);
            }

            Log::info('Status updated successfully for applicant_id: ' . $applicantId . ' to ' . $validated['status']);
            return response()->json(['message' => 'Status updated successfully.']);
        } catch (\Exception $e) {
            Log::error('Exception in updateStatus: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update status. Please try again. Error: ' . $e->getMessage()], 500);
        }
    }
}
