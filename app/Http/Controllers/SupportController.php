<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class SupportController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email',
            'message' => 'required|string|max:1000',
        ], [
            'name.required' => 'Nama wajib diisi',
            'name.string' => 'Nama harus berupa teks',
            'name.max' => 'Nama maksimal 100 karakter',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'message.required' => 'Pesan wajib diisi',
            'message.string' => 'Pesan harus berupa teks',
            'message.max' => 'Pesan maksimal 1000 karakter',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'messageContent' => $request->message,
        ];

        Mail::send('emails.support', $data, function ($mail) use ($data) {
            $mail->to('gia95194@gmail.com') // email admin tujuan
                ->subject('Pesan Bantuan Baru dari ' . $data['name']);
        });

        return back()->with('success', 'Pesan kamu sudah terkirim!');
    }
}
