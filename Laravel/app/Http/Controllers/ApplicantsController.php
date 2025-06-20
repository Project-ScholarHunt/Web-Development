<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Applicants;
use App\Models\Scholarships;
use App\Models\Selections;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
                    $registrationDate = $applicant->registration_date;
                    if ($registrationDate instanceof \DateTimeInterface) {
                        $registrationDate = \Carbon\Carbon::instance($registrationDate);
                    } elseif (is_string($registrationDate) && !empty(trim($registrationDate))) {
                        try {
                            $registrationDate = \Carbon\Carbon::parse($registrationDate);
                        } catch (\Exception $e) {
                            Log::warning('Invalid registration_date format for applicant ID: ' . $applicant->applicant_id . ', using current date. Error: ' . $e->getMessage());
                            $registrationDate = \Carbon\Carbon::now();
                        }
                    } else {
                        $registrationDate = \Carbon\Carbon::now();
                        Log::warning('Invalid or empty registration_date for applicant ID: ' . $applicant->applicant_id . ', using current date');
                    }

                    $logoUrl = 'https://via.placeholder.com/150/CCCCCC/FFFFFF?Text=LogoDefault';
                    if ($applicant->scholarships && $applicant->scholarships->logo) {
                        $logoPathInDb = $applicant->scholarships->logo;
                        $assetPath = 'storage/' . $logoPathInDb;
                        $logoUrl = asset($assetPath);
                    }

                    $recommendationDocPath = $this->generateDocumentUrl($applicant->recommendation_letter);
                    $statementDocPath = $this->generateDocumentUrl($applicant->statement_letter);
                    $gradeTranscriptDocPath = $this->generateDocumentUrl($applicant->grade_transcript);

                    return [
                        'id' => $applicant->applicant_id,
                        'scholarshipId' => $applicant->scholarship_id,
                        'name' => $applicant->scholarships->scholarship_name ?? 'N/A',
                        'partner' => $applicant->scholarships->partner ?? 'N/A',
                        'logo' => $logoUrl,
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
                            ['name' => 'Recommendation Letter', 'path' => $recommendationDocPath, 'uploadedAt' => $registrationDate->toDateString()],
                            ['name' => 'Statement Letter', 'path' => $statementDocPath, 'uploadedAt' => $registrationDate->toDateString()],
                            ['name' => 'Grade Transcript', 'path' => $gradeTranscriptDocPath, 'uploadedAt' => $registrationDate->toDateString()],
                        ],
                    ];
                });

            return response()->json($applications);
        } catch (\Exception $e) {
            Log::error('Error in myApplications: ' . $e->getMessage() . ' at ' . $e->getFile() . ':' . $e->getLine());
            return response()->json(['message' => 'Failed to load applications. Please try again.'], 500);
        }
    }

    private function getProgressStage($status)
    {
        switch (strtolower($status ?? '')) {
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
                $scholarshipLogoUrl = 'https://via.placeholder.com/150/DDDDDD/FFFFFF?Text=AdminLogoDefault';
                if ($applicant->scholarships && $applicant->scholarships->logo) {
                    $logoPathInDb = $applicant->scholarships->logo;
                    $assetPath = 'storage/' . $logoPathInDb;
                    $scholarshipLogoUrl = asset($assetPath);
                }

                $recommendationDocUrl = $this->generateDocumentUrl($applicant->recommendation_letter);
                $statementDocUrl = $this->generateDocumentUrl($applicant->statement_letter);
                $gradeTranscriptDocUrl = $this->generateDocumentUrl($applicant->grade_transcript);

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
                    'recommendation_letter' => $recommendationDocUrl,
                    'statement_letter' => $statementDocUrl,
                    'grade_transcript' => $gradeTranscriptDocUrl,
                    'scholarship_id' => $applicant->scholarship_id,
                    'scholarship' => [
                        'id' => $applicant->scholarships->scholarship_id ?? null,
                        'scholarshipName' => $applicant->scholarships->scholarship_name ?? 'N/A',
                        'logo' => $scholarshipLogoUrl,
                    ],
                    'status' => $applicant->selection->status ?? 'pending',
                    'note' => $applicant->selection->note ?? '',
                    'created_at' => $applicant->created_at ? $applicant->created_at->toISOString() : null,
                    'registration_date' => $applicant->registration_date ? \Carbon\Carbon::parse($applicant->registration_date)->toISOString() : null,
                ];
            });

        return response()->json($applicants);
    }

    public function updateStatus(Request $request, $applicantId)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:Pending,Under Review,Interview,Accepted,Rejected,Withdrawn',
            ]);

            $selection = Selections::where('applicant_id', $applicantId)->first();
            if (!$selection) {
                $applicant = Applicants::find($applicantId);
                if (!$applicant) {
                    Log::warning('Applicant not found for applicant_id: ' . $applicantId . ' during status update.');
                    return response()->json(['message' => 'Applicant not found.'], 404);
                }
                $selection = Selections::create([
                    'applicant_id' => $applicantId,
                    'status' => $validated['status'],
                    'note' => $request->input('note', ''),
                ]);
                Log::info('Created new Selections record during status update for applicant_id: ' . $applicantId);
            } else {
                $updateData = ['status' => $validated['status']];
                if ($request->has('note')) {
                    $updateData['note'] = $request->input('note');
                }
                $selection->update($updateData);
            }

            Log::info('Status updated successfully for applicant_id: ' . $applicantId . ' to ' . $validated['status']);
            return response()->json(['message' => 'Status updated successfully.']);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in updateStatus: ' . json_encode($e->errors()));
            return response()->json(['message' => 'Validation failed.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Exception in updateStatus: ' . $e->getMessage() . ' at ' . $e->getFile() . ':' . $e->getLine());
            return response()->json(['message' => 'Failed to update status. Please try again.'], 500);
        }
    }

    public function destroy($applicantId)
    {
        return DB::transaction(function () use ($applicantId) {
            try {
                $applicant = Applicants::findOrFail($applicantId);

                if ($applicant->recommendation_letter && Storage::disk('public')->exists($applicant->recommendation_letter)) {
                    Storage::disk('public')->delete($applicant->recommendation_letter);
                }
                if ($applicant->statement_letter && Storage::disk('public')->exists($applicant->statement_letter)) {
                    Storage::disk('public')->delete($applicant->statement_letter);
                }
                if ($applicant->grade_transcript && Storage::disk('public')->exists($applicant->grade_transcript)) {
                    Storage::disk('public')->delete($applicant->grade_transcript);
                }

                Selections::where('applicant_id', $applicantId)->delete();

                $scholarship = Scholarships::find($applicant->scholarship_id);
                if ($scholarship) {
                    $scholarship->increment('quota');
                }

                $applicant->delete();
                Log::info('Application withdrawn/deleted successfully for applicant ID: ' . $applicantId);
                return response()->json(['message' => 'Application withdrawn successfully.'], 200);
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                Log::error('Error withdrawing application - Applicant not found: ' . $applicantId . ' - ' . $e->getMessage());
                return response()->json(['message' => 'Applicant not found.'], 404);
            } catch (\Exception $e) {
                Log::error('Error withdrawing application for ID ' . $applicantId . ': ' . $e->getMessage() . ' at ' . $e->getFile() . ':' . $e->getLine());
                return response()->json(['message' => 'Failed to withdraw application. Error: ' . $e->getMessage()], 500);
            }
        });
    }

    private function generateDocumentUrl($documentPath)
    {
        if (!$documentPath) {
            return null;
        }

        $filename = basename($documentPath);

        return route('documents.show', ['filename' => $filename]);
    }
}
