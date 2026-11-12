@props(['url', 'message' => null])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@php
    $logoPath = public_path('favicon.jpg');
    if (isset($message) && file_exists($logoPath)) {
        $logoSrc = $message->embed($logoPath);
    } else {
        $logoSrc = asset('favicon.jpg');
    }
@endphp
<img src="{{ $logoSrc }}" class="logo" alt="PEB Logo" style="height: 60px; max-height: 60px; width: auto; margin-top: 15px; margin-bottom: 10px;">
</a>
</td>
</tr>
