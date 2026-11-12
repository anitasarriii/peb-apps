<?php

namespace App\Actions;

use App\Models\Notification;
use App\Models\User;

class RecordProcurementActivity
{
    /** @param array<int, array<string, mixed>> $before
     * @param  array<int, array<string, mixed>>  $after
     */
    public function handle(User $user, array $before, array $after): void
    {
        $oldItems = collect($before)->keyBy('id');
        $newItems = collect($after)->keyBy('id');

        foreach ($newItems as $id => $item) {
            $previous = $oldItems->get($id);
            if ($previous == $item) {
                continue;
            }
            $this->record($user, $previous === null ? 'Dibuat' : 'Diperbarui', $item, $previous);
        }

        foreach ($oldItems as $id => $item) {
            if (! $newItems->has($id)) {
                $this->record($user, 'Dihapus', $item, $item);
            }
        }
    }

    /** @param array<string, mixed> $item
     * @param  array<string, mixed>|null  $previous
     */
    private function record(User $user, string $action, array $item, ?array $previous): void
    {
        Notification::log($user, 'info', 'Pengadaan '.$action, json_encode([
            'module' => 'pengadaan',
            'action' => $action,
            'item_id' => (string) ($item['id'] ?? ''),
            'title' => $item['title'] ?? '',
            'actor_id' => $user->id,
            'actor_name' => $user->name,
            'status_before' => $previous['status'] ?? null,
            'status_after' => $action === 'Dihapus' ? null : ($item['status'] ?? null),
            'archived_before' => (bool) ($previous['isArchived'] ?? false),
            'archived_after' => $action === 'Dihapus' ? null : (bool) ($item['isArchived'] ?? false),
        ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE));
    }
}
