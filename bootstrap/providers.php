<?php

use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;
use Laravel\Boost\BoostServiceProvider;

$providers = [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
];

if (class_exists('Laravel\Boost\BoostServiceProvider')) {
    $providers[] = BoostServiceProvider::class;
}

return $providers;
