<?php

namespace App\Http\Controllers;

use App\Models\Scholarships;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Intervention\Image\Facades\Image; // Import the Image facade

class ScholarshipsController extends Controller
{
    /**
     * Display a listing of scholarships.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Scholarships::query();

        // Fungsi pencarian
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where('scholarship_name', 'LIKE', "%{$searchTerm}%")
                ->orWhere('partner', 'LIKE', "%{$searchTerm}%");
        }

        $scholarships = $query->get();

        // Transformasi data untuk menyesuaikan dengan kebutuhan frontend
        $formattedScholarships = $scholarships->map(function ($scholarship) {
            return [
                'id' => $scholarship->scholarship_id,
                'scholarshipName' => $scholarship->scholarship_name,
                'partner' => $scholarship->partner,
                'description' => $scholarship->description,
                'termsAndConditions' => $scholarship->terms_and_conditions,
                'quota' => $scholarship->quota,
                'timeLimit' => $scholarship->time_limit ? $scholarship->time_limit->format('Y-m-d') : null,
                'logo' => $scholarship->logo ? url(Storage::url($scholarship->logo)) : null,
                'thumbnail' => $scholarship->thumbnail ? url(Storage::url($scholarship->thumbnail)) : null,
                'status' => 'active',
                'createdBy' => $scholarship->user_id
            ];
        });

        return response()->json($formattedScholarships);
    }

    /**
     * Store a newly created scholarship.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'scholarshipName' => 'required|string|max:255',
            'partner' => 'required|string|max:255',
            'description' => 'required|string',
            'termsAndConditions' => 'required|string',
            'quota' => 'required|integer|min:1',
            'timeLimit' => 'required|date',
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $userId = Auth::id();

            if (!$userId) {
                return response()->json(['error' => 'User tidak terautentikasi'], 401);
            }

            // Menangani unggahan logo
            $logoPath = null;
            if ($request->hasFile('logo')) {
                $logoPath = $request->file('logo')->store('scholarships/logos', 'public');
            }

            $thumbnailPath = null;
            if ($request->hasFile('thumbnail')) {
                $thumbnailPath = $request->file('thumbnail')->store('scholarships/thumbnails', 'public');
            }

            $scholarship = Scholarships::create([
                'scholarship_name' => $request->scholarshipName,
                'partner' => $request->partner,
                'description' => $request->description,
                'terms_and_conditions' => $request->termsAndConditions,
                'quota' => $request->quota,
                'time_limit' => $request->timeLimit,
                'logo' => $logoPath,
                'thumbnail' => $thumbnailPath,
                'user_id' => $userId,
            ]);

            return response()->json([
                'id' => $scholarship->scholarship_id,
                'scholarshipName' => $scholarship->scholarship_name,
                'partner' => $scholarship->partner,
                'description' => $scholarship->description,
                'termsAndConditions' => $scholarship->terms_and_conditions,
                'quota' => $scholarship->quota,
                'timeLimit' => $scholarship->time_limit->format('Y-m-d'),
                'logo' => $logoPath ? url(Storage::url($logoPath)) : null,
                'thumbnail' => $thumbnailPath ? url(Storage::url($thumbnailPath)) : null,
                'status' => 'active',
                'createdBy' => $userId
            ], 201);
        } catch (\Exception $e) {

            return response()->json([
                'error' => 'Failed to create scholarship',
                'message' => 'An error occurred while processing your request'
            ], 500);
        }
    }

    /**
     * Display the specified scholarship.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $scholarship = Scholarships::findOrFail($id);

            return response()->json([
                'id' => $scholarship->scholarship_id,
                'scholarshipName' => $scholarship->scholarship_name,
                'partner' => $scholarship->partner,
                'description' => $scholarship->description,
                'termsAndConditions' => $scholarship->terms_and_conditions,
                'quota' => $scholarship->quota,
                'timeLimit' => $scholarship->time_limit->format('Y-m-d'),
                'logo' => $scholarship->logo ? url(Storage::url($scholarship->logo)) : null,
                'thumbnail' => $scholarship->thumbnail ? url(Storage::url($scholarship->thumbnail)) : null,
                'status' => 'active',
                'createdBy' => $scholarship->user_id
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Beasiswa tidak ditemukan'], 404);
        }
    }

    /**
     * Update the specified scholarship.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $scholarship = Scholarships::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'scholarshipName' => 'required|string|max:255',
                'partner' => 'required|string|max:255',
                'description' => 'required|string',
                'termsAndConditions' => 'required|string',
                'quota' => 'required|integer|min:1',
                'timeLimit' => 'required|date',
                'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = [
                'scholarship_name' => $request->scholarshipName,
                'partner' => $request->partner,
                'description' => $request->description,
                'terms_and_conditions' => $request->termsAndConditions,
                'quota' => $request->quota,
                'time_limit' => $request->timeLimit,
            ];

            // Menangani unggahan logo
            if ($request->hasFile('logo')) {
                // Menghapus logo lama jika ada
                if ($scholarship->logo && Storage::disk('public')->exists($scholarship->logo)) {
                    Storage::disk('public')->delete($scholarship->logo);
                }

                $logoPath = $request->file('logo')->store('scholarships/logos', 'public');
                $data['logo'] = $logoPath;
            }

            if ($request->hasFile('thumbnail')) {
                if ($scholarship->thumbnail && Storage::disk('public')->exists($scholarship->thumbnail)) {
                    Storage::disk('public')->delete($scholarship->thumbnail);
                }

                $thumbnailPath = $request->file('thumbnail')->store('scholarships/thumbnails', 'public');
                $data['thumbnail'] = $thumbnailPath;
            }

            $scholarship->update($data);

            return response()->json([
                'id' => $scholarship->scholarship_id,
                'scholarshipName' => $scholarship->scholarship_name,
                'partner' => $scholarship->partner,
                'description' => $scholarship->description,
                'termsAndConditions' => $scholarship->terms_and_conditions,
                'quota' => $scholarship->quota,
                'timeLimit' => $scholarship->time_limit->format('Y-m-d'),
                'logo' => $scholarship->logo ? url(Storage::url($scholarship->logo)) : null,
                'thumbnail' => $scholarship->thumbnail ? url(Storage::url($scholarship->thumbnail)) : null,
                'status' => 'active',
                'createdBy' => $scholarship->user_id
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Beasiswa tidak ditemukan atau terjadi kesalahan',
                'details' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Remove the specified scholarship.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $scholarship = Scholarships::findOrFail($id);

            // Menghapus file logo jika ada
            if ($scholarship->logo && Storage::disk('public')->exists($scholarship->logo)) {
                Storage::disk('public')->delete($scholarship->logo);
            }

            if ($scholarship->thumbnail && Storage::disk('public')->exists($scholarship->thumbnail)) {
                Storage::disk('public')->delete($scholarship->thumbnail);
            }

            $scholarship->delete();

            return response()->json(['message' => 'Beasiswa berhasil dihapus'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Beasiswa tidak ditemukan atau terjadi kesalahan'], 404);
        }
    }

    /**
     * Search for scholarships.
     *
     * @param  string  $term
     * @return \Illuminate\Http\Response
     */
    public function search($term)
    {
        $scholarships = Scholarships::where('scholarship_name', 'LIKE', "%{$term}%")
            ->orWhere('partner', 'LIKE', "%{$term}%")
            ->orWhere('description', 'LIKE', "%{$term}%")
            ->get();

        $formattedScholarships = $scholarships->map(function ($scholarship) {
            return [
                'id' => $scholarship->scholarship_id,
                'scholarshipName' => $scholarship->scholarship_name,
                'partner' => $scholarship->partner,
                'description' => $scholarship->description,
                'termsAndConditions' => $scholarship->terms_and_conditions,
                'quota' => $scholarship->quota,
                'timeLimit' => $scholarship->time_limit->format('Y-m-d'),
                'logo' => $scholarship->logo ? url(Storage::url($scholarship->logo)) : null,
                'thumbnail' => $scholarship->thumbnail ? url(Storage::url($scholarship->thumbnail)) : null,
                'status' => 'active',
                'createdBy' => $scholarship->user_id
            ];
        });

        return response()->json($formattedScholarships);
    }

    /**
     * Upload a thumbnail image with resizing.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function uploadThumbnail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $image = $request->file('thumbnail');
            $filename = time() . '.' . $image->getClientOriginalExtension();
            $path = 'scholarships/thumbnails/' . $filename; // Storage path

            // Use Intervention Image to resize and save
            $img = Image::make($image->getRealPath());

            // Resize while maintaining aspect ratio and prevent upsizing
            $img->resize(1920, 1080, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            })->encode($image->getClientOriginalExtension(), 80); // Encode with 80% quality

            // Save to public disk
            Storage::disk('public')->put($path, $img->stream());

            return response()->json(['path' => Storage::url($path)], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to upload thumbnail',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}