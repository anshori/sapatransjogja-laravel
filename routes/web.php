<?php

use Illuminate\Support\Facades\Route;

Route::get('/map', function () {
    return response()
        ->view('map')
        ->header('X-Frame-Options', 'ALLOWALL');
});

Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');

