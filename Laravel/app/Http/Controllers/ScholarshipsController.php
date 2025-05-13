<?php

namespace App\Http\Controllers;


use App\Models\Scholarships;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
        $formattedScholarships = $scholarships->map(function ($scholarships) {
            return [
                'id' => $scholarships->scholarship_id,
                'scholarshipName' => $scholarships->scholarship_name,
                'partner' => $scholarships->partner,
                'description' => $scholarships->description,
                'termsAndConditions' => $scholarships->terms_and_conditions,
                'quota' => $scholarships->quota,
                'timeLimit' => $scholarships->time_limit->format('Y-m-d'),
                'logo' => url(Storage::url($scholarships->logo)),
                'thumbnail' => null, // Tidak ada di database tapi frontend membutuhkannya
                'status' => 'active' // Tidak ada di database tapi frontend membutuhkannya
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
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Menangani unggahan logo
        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('scholarships/logos', 'public');
        }

        // Create scholarship
        $scholarships = Scholarships::create([
            'scholarship_name' => $request->scholarshipName,
            'partner' => $request->partner,
            'description' => $request->description,
            'terms_and_conditions' => $request->termsAndConditions,
            'quota' => $request->quota,
            'time_limit' => $request->timeLimit,
            'logo' => $logoPath,
        ]);

        // Response
        return response()->json([
            'id' => $scholarships->scholarship_id,
            'scholarshipName' => $scholarships->scholarship_name,
            'partner' => $scholarships->partner,
            'description' => $scholarships->description,
            'termsAndConditions' => $scholarships->terms_and_conditions,
            'quota' => $scholarships->quota,
            'timeLimit' => $scholarships->time_limit->format('Y-m-d'),
            'logo' => url(Storage::url($scholarships->logo)),
            'thumbnail' => null,
            'status' => 'active'
        ], 201);
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
            $scholarships = Scholarships::findOrFail($id);

            return response()->json([
                'id' => $scholarships->scholarship_id,
                'scholarshipName' => $scholarships->scholarship_name,
                'partner' => $scholarships->partner,
                'description' => $scholarships->description,
                'termsAndConditions' => $scholarships->terms_and_conditions,
                'quota' => $scholarships->quota,
                'timeLimit' => $scholarships->time_limit->format('Y-m-d'),
                'logo' => url(Storage::url($scholarships->logo)),
                'thumbnail' => null,
                'status' => 'active'
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
            $scholarships = Scholarships::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'scholarshipName' => 'required|string|max:255',
                'partner' => 'required|string|max:255',
                'description' => 'required|string',
                'termsAndConditions' => 'required|string',
                'quota' => 'required|integer|min:1',
                'timeLimit' => 'required|date',
                'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
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
                if ($scholarships->logo && Storage::disk('public')->exists($scholarships->logo)) {
                    Storage::disk('public')->delete($scholarships->logo);
                }

                $logoPath = $request->file('logo')->store('scholarships/logos', 'public');
                $data['logo'] = $logoPath;
            }

            $scholarships->update($data);

            // Response
            return response()->json([
                'id' => $scholarships->scholarship_id,
                'scholarshipName' => $scholarships->scholarship_name,
                'partner' => $scholarships->partner,
                'description' => $scholarships->description,
                'termsAndConditions' => $scholarships->terms_and_conditions,
                'quota' => $scholarships->quota,
                'timeLimit' => $scholarships->time_limit->format('Y-m-d'),
                'logo' => url(Storage::url($scholarships->logo)),
                'thumbnail' => null,
                'status' => 'active'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Beasiswa tidak ditemukan atau terjadi kesalahan'], 404);
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
            $scholarships = Scholarships::findOrFail($id);

            // Menghapus file logo jika ada
            if ($scholarships->logo && Storage::disk('public')->exists($scholarships->logo)) {
                Storage::disk('public')->delete($scholarships->logo);
            }

            $scholarships->delete();

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

        $formattedScholarships = $scholarships->map(function ($scholarships) {
            return [
                'id' => $scholarships->scholarship_id,
                'scholarshipName' => $scholarships->scholarship_name,
                'partner' => $scholarships->partner,
                'description' => $scholarships->description,
                'termsAndConditions' => $scholarships->terms_and_conditions,
                'quota' => $scholarships->quota,
                'timeLimit' => $scholarships->time_limit->format('Y-m-d'),
                'logo' => url(Storage::url($scholarships->logo)),
                'thumbnail' => null,
                'status' => 'active'
            ];
        });

        return response()->json($formattedScholarships);
    }
}
