<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CmsPreferencesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'themeMode' => ['required', 'in:light,dark,system'],
            'language' => ['required', 'in:Indonesia,English'],
            'timezone' => ['required', 'in:Asia/Jakarta (WIB),Asia/Makassar (WITA),Asia/Jayapura (WIT)'],
            'sessionTimeout' => ['required', 'in:15 Menit,30 Menit,60 Menit,2 Jam,8 Jam,Tidak Pernah'],
            'ipWhitelist' => ['nullable', 'string', 'max:2000'],
            'backupFrequency' => ['required', 'in:Harian,Mingguan,Bulanan'],
        ];

        foreach (['sidebarCollapsed', 'compactMode', 'animationsEnabled', 'emailNotif', 'browserNotif', 'procurementAlert', 'reportAlert', 'userActivityAlert', 'systemAlert', 'twoFactor', 'loginNotif', 'maintenanceMode', 'debugMode', 'cacheEnabled', 'autoBackup'] as $field) {
            $rules[$field] = ['required', 'boolean'];
        }

        return $rules;
    }
}
