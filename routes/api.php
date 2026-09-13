<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapidController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\DashboardController;

// ==========================================
// DASHBOARD ENDPOINTS
// ==========================================
Route::get('/dashboard', [DashboardController::class, 'index']);

// ==========================================
// MAPID ENDPOINTS
// ==========================================
Route::get('/activities', [MapidController::class, 'activities']);
Route::get('/haltes', [MapidController::class, 'haltes']);

// ==========================================
// MAP ENDPOINTS (Supabase)
// ==========================================
Route::get('map/halte', [MapController::class, 'getHalte']);
Route::get('map/jalur', [MapController::class, 'getJalur']);
Route::get('map/halte-aksesibel', [MapController::class, 'getHalteAksesibel']);

// ==========================================
// SEARCH HALTE
// ==========================================
Route::get('/search-halte', [MapController::class, 'searchHalte']);

// ==========================================
// CHATBOT (GEMINI AI)
// ==========================================
Route::post('/chat', [ChatbotController::class, 'chat']);