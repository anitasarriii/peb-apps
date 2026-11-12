<?php

namespace App\Http\Requests\Admin\MasterData;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $currentUser = $this->user();
        $isSuperAdmin = $currentUser->role && $currentUser->role->name === 'super_admin';
        $allowedRoleNames = $isSuperAdmin
            ? ['super_admin', 'admin', 'admin_pengadaan', 'user']
            : ['admin', 'admin_pengadaan', 'user'];

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'role_id' => [
                'required',
                Rule::exists('roles', 'id')->where(function ($query) use ($allowedRoleNames) {
                    $query->whereIn('name', $allowedRoleNames);
                }),
            ],
            'status' => ['required', 'string', Rule::in(['Aktif', 'Nonaktif'])],
            'avatar' => ['nullable'],
        ];

        if ($this->isMethod('post')) {
            $rules['password'] = ['required', 'string', 'min:8', 'confirmed'];
        }

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['email'] = ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($this->route('user')->id)];
            $rules['password'] = ['nullable', 'string', 'min:8', 'confirmed'];
        }

        return $rules;
    }
}
