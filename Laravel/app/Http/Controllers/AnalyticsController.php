<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Applicants;
use App\Models\Scholarships;
use Illuminate\Support\Facades\Artisan;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Mengambil semua data beasiswa.
     */
    public function getScholarships()
    {
        $scholarships = Scholarships::all();
        return response()->json($scholarships);
    }

    /**
     * Mengambil statistik umum terkait pelamar dan beasiswa.
     */
    public function getGeneralStats()
    {
        // Total pelamar tetap sama
        $totalApplicants = Applicants::count();

        // Active Scholarships (berdasarkan time_limit, karena tidak ada status di scholarships)
        $activeScholarships = Scholarships::where('time_limit', '>', Carbon::now())->count();

        // Hitung pelamar berdasarkan status di tabel 'selections'
        $pendingApplicants = Applicants::whereHas('selection', function ($query) {
            $query->where('status', 'pending');
        })->count();

        $approvedApplicantsCount = Applicants::whereHas('selection', function ($query) {
            $query->where('status', 'accepted');
        })->count();

        $underReviewApplicantsCount = Applicants::whereHas('selection', function ($query) {
            $query->where('status', 'under review');
        })->count();

        $rejectedApplicantsCount = Applicants::whereHas('selection', function ($query) {
            $query->where('status', 'rejected');
        })->count();

        $approvalRate = ($totalApplicants > 0) ? round(($approvedApplicantsCount / $totalApplicants) * 100, 1) : 0;

        $totalQuota = Scholarships::sum('quota');
        // Pastikan totalQuota tidak nol untuk menghindari division by zero jika tidak ada kuota sama sekali
        $quotaFillRate = ($totalQuota > 0) ? round(($approvedApplicantsCount / $totalQuota) * 100, 1) : 0; // Diubah approvedApplicantsCount agar lebih make sense untuk quota fill rate yang sudah di approve


        return response()->json([
            'totalApplicants' => $totalApplicants,
            'activeScholarships' => $activeScholarships,
            'pendingApplicants' => $pendingApplicants,
            'underReviewApplicants' => $underReviewApplicantsCount,
            'approvedApplicants' => $approvedApplicantsCount,
            'rejectedApplicants' => $rejectedApplicantsCount,
            'approvalRate' => $approvalRate,
            'totalQuota' => $totalQuota,
            'quotaFillRate' => $quotaFillRate,
        ]);
    }

    /**
     * Mengambil data pelamar dengan informasi beasiswa dan status seleksi mereka.
     * // Metode getApplicants() juga perlu diubah untuk preload selection (Komentar asli dari kode Anda)
     */
    public function getApplicants()
    {
        // Ambil semua pelamar dan preload relasi scholarship DAN selection
        // PASTIKAN NAMA RELASI 'scholarship' (singular) SESUAI DENGAN DEFINISI DI MODEL Applicants
        $applicants = Applicants::with(['scholarships', 'selection'])->get(); // <<< DIUBAH ke 'scholarship' (singular)

        // Map data untuk menyesuaikan format frontend jika diperlukan,
        // atau tambahkan status dari selection ke objek applicant
        $formattedApplicants = $applicants->map(function ($applicant) {
            $applicantArray = $applicant->toArray();
            // Tambahkan status dari selection ke objek applicant jika selection ada
            $applicantArray['status'] = $applicant->selection ? $applicant->selection->status : 'no_status'; // Default jika tidak ada selection

            // Sertakan juga nama beasiswa secara langsung jika sering diakses di frontend
            // Ini opsional, tergantung kebutuhan. Jika sudah ada di $applicant->scholarship, mungkin tidak perlu.
            // if ($applicant->scholarship) {
            //     $applicantArray['scholarship_name'] = $applicant->scholarship->scholarship_name;
            // }
            return $applicantArray;
        });

        return response()->json($formattedApplicants);
    }

    /**
     * Menjalankan seeder untuk mengisi data dummy.
     */
}
