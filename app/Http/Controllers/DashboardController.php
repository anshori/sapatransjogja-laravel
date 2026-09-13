<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $apiKey = env('MAPID_API_KEY');

        try {
            // 1. Ambil data 345 halte dari database
            $haltes = DB::table('activity_utm_exp')->get();

            // 2. Ambil data Activities dari MAPID
            $authors = [
                'dianulin',
                'kansaeka',
                'elanggadingpermana2006',
                'angelinapuspo',
                'laylanovinda',
            ];

            $mapidActivities = [];

            foreach ($authors as $author) {
                $response = Http::withHeaders([
                    'x-api-key' => $apiKey,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])->post(
                    'https://server.mapid.io/web/competition/activities',
                    [
                        'feature' => [
                            'type' => 'Polygon',
                            'coordinates' => [[
                                [109.0, -9.0],
                                [112.0, -9.0],
                                [112.0, -6.0],
                                [109.0, -6.0],
                                [109.0, -9.0],
                            ]]
                        ],
                        'start_date' => '2020-01-01',
                        'end_date' => '2030-12-31',
                        'author' => $author,
                    ]
                );

                $result = $response->json();

                if (isset($result['data']['activities']) && is_array($result['data']['activities'])) {
                    $mapidActivities = array_merge($mapidActivities, $result['data']['activities']);
                }
            }

            // 3. Buat index berdasarkan ID MAPID
            $mapidById = [];
            foreach ($mapidActivities as $activity) {
                if (isset($activity['_id'])) {
                    $mapidById[$activity['_id']] = $activity;
                }
            }

            // 4. Gabungkan database dengan data MAPID
            $halteList = [];
            foreach ($haltes as $halte) {
                $mapid = $mapidById[$halte->id_mapid] ?? null;

                $halteList[] = [
                    'id' => $halte->id,
                    'nama' => $halte->halte_ona,
                    'id_mapid' => $halte->id_mapid,
                    'lat' => $halte->lat,
                    'long' => $halte->long,
                    'jalur' => $halte->jalur ?? null,
                    'kelas' => $halte->kelas ?? null,
                    'rating' => $halte->skor_final ?? null,
                    'jenis_halte' => $halte->jenis_halt ?? null,
                    'fasilitas' => [
                        'atap' => $halte->fas_atap ?? null,
                        'kondisi_atap' => $halte->kondisi_at ?? null,
                        'ramp' => $halte->fas_ramp ?? null,
                        'kondisi_ramp' => $halte->kondisi_ra ?? null,
                        'fas_pegawa' => $halte->fas_pegawa ?? null,
                        'tempat_duduk' => $halte->fas_tempat ?? null,
                        'papan_informasi' => $halte->fas_papan_ ?? null,
                        'lampu' => $halte->fas_lampu ?? null,
                        'trotoar' => $halte->fas_trotoa ?? null,
                        'kondisi_trotoar' => $halte->kondisi_tr ?? null,
                        'guiding_block' => $halte->fas_guildi ?? null,
                        'kondisi_guiding_block' => $halte->kondisi_gu ?? null,
                        'penyeberangan' => $halte->fas_penyeb ?? null,
                        'jenis_penyeberangan' => $halte->jenis_peny ?? null,
                    ],
                    'skor' => [
                        'fasilitas' => $halte->skor_fas ?? null,
                        'kondisi' => $halte->skor_kondi ?? null,
                        'total' => $halte->skor_total ?? null,
                        'final' => $halte->skor_final ?? null,
                    ],
                    'foto' => $mapid['medias'] ?? [],
                ];
            }

            $halteCollect = collect($halteList);

            // Hitung KPI
            $totalHalte = $halteCollect->count();
            $sangatAksesibel = $halteCollect->where('kelas', 'Sangat Aksesibel')->count();
            $cukupAksesibel = $halteCollect->where('kelas', 'Cukup Aksesibel')->count();
            $kurangAksesibel = $halteCollect->where('kelas', 'Kurang Aksesibel')->count();
            $tidakTersedia = $halteCollect->where('kelas', 'Tidak Aksesibel')->count();

            // Halte perhatian
            $haltePerhatian = $halteCollect
                ->filter(fn($h) => in_array($h['kelas'], ['Kurang Aksesibel', 'Tidak Aksesibel']))
                ->sortBy('rating')
                ->take(5)
                ->map(fn($h) => [
                    'id' => $h['id'],
                    'nama_halte' => $h['nama'],
                    'skor' => floatval($h['rating'] ?? 0),
                    'keterangan' => $h['kelas']
                ])
                ->values()
                ->toArray();

            return response()->json([
                'success' => true,
                'data' => [
                    'kpi' => [
                        'totalHalte' => $totalHalte,
                        'sangatAksesibel' => $sangatAksesibel,
                        'cukupAksesibel' => $cukupAksesibel,
                        'kurangAksesibel' => $kurangAksesibel,
                        'tidakTersedia' => $tidakTersedia,
                    ],
                    'haltePerhatian' => $haltePerhatian
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}