<?php

namespace App\Http\Middleware;

use App\Models\CtaSection;
use App\Models\Footer;
use App\Models\Header;
use App\Models\Notification;
use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Symfony\Component\HttpFoundation\Response;

class HandleInertiaRequests extends Middleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = parent::handle($request, $next);

        if ($request->isMethod('POST') && $request->routeIs('panel-admin.*')
            && $request->header('X-Cms-Return-To-List') === '1'
            && $response instanceof RedirectResponse
            && ! $request->session()->has('errors')) {
            parse_str(parse_url($request->headers->get('referer', ''), PHP_URL_QUERY) ?? '', $query);
            if (isset($query['tab']) && is_string($query['tab'])) {
                $response->setTargetUrl(route('panel-admin.index', ['tab' => $query['tab']]));
            }
        }

        return $response;
    }

    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => fn (): array => ['user' => $request->user()?->loadMissing('role')],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'ctaSection' => fn () => $request->routeIs('panel-admin.*') ? null : CtaSection::first(),
            'footer' => fn () => ! $request->routeIs('panel-admin.*') || $request->query('tab') === 'Footer' ? Footer::first() : null,
            'header' => fn () => ! $request->routeIs('panel-admin.*') || $request->query('tab') === 'Header' ? Header::first() : null,
            'notifications' => fn () => $request->user() && ($request->routeIs('panel-admin.*') || $request->is('panel-admin', 'panel-admin/*')) ? Notification::with('user:id,name')
                ->when($request->user()->role?->name === 'admin_pengadaan', fn ($query) => $query->where('title', 'like', 'Pengadaan %'))
                ->when($request->user()->role && ! in_array($request->user()->role->name, ['super_admin', 'admin'], true), function ($query) use ($request) {
                    // Role selain super_admin dan admin hanya bisa melihat notifikasi miliknya sendiri
                    $query->where('user_id', $request->user()->id);
                })
                ->latest()
                ->take(30)
                ->get()
                ->map(function ($notif) use ($request) {
                    $currentUser = $request->user();

                    $isSelf = $notif->user_id === $currentUser->id;

                    $readBy = $notif->read_by ?? [];
                    $isRead = in_array($currentUser->id, $readBy);

                    $message = $notif->message;
                    if (is_string($message) && str_starts_with($message, '{') && str_ends_with($message, '}')) {
                        $decoded = json_decode($message, true);
                        if (is_array($decoded) && isset($decoded['title'], $decoded['action'])) {
                            $actor = $decoded['actor_name'] ?? ($notif->user?->name ?? 'Pengguna');
                            $message = "{$actor} {$decoded['action']} pengadaan: {$decoded['title']}";
                        }
                    }

                    return [
                        'id' => (string) $notif->id,
                        'type' => $notif->type,
                        'title' => $notif->title.($isSelf ? ' (Saya)' : ''),
                        'raw_title' => $notif->title,
                        'message' => $message,
                        'time' => $notif->created_at->diffForHumans(),
                        'read' => $isRead,
                        'triggered_by' => $notif->user?->name ?? 'Sistem',
                        'is_self' => $isSelf,
                    ];
                }) : [],
        ];
    }
}
