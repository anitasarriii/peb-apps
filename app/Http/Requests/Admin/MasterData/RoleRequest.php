<?php

namespace App\Http\Requests\Admin\MasterData;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
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
        $rules = [
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'label' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:50'],
            'permissions' => ['required', 'array'],
        ];

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['name'] = ['required', 'string', 'max:255', Rule::unique('roles', 'name')->ignore($this->route('role')->id)];
        }

        return $rules;
    }
}
