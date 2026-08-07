<?php
/**
 * Приём заявок с форм сайта БТИ и ОЦЕНКИ и отправка на почту компании.
 * Работает на хостинге Beget (PHP плюс локальная почта), сторонний сервис не нужен.
 * Формы шлют POST: name, phone, email, service, task, _subject, _gotcha (ловушка для ботов).
 */

$TO   = 'info@btiio.ru';
$FROM = 'info@btiio.ru';
$LOG  = __DIR__ . '/zayavki.log';

header('Content-Type: application/json; charset=UTF-8');

function fail($code, $msg) {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}
function done() {
    http_response_code(200);
    echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, 'Только POST');
if (!empty($_POST['_gotcha'])) done();   // бот заполнил скрытое поле

$clean = function ($v) { return trim(preg_replace('/[\r\n]+/', ' ', (string)$v)); };

$name    = $clean($_POST['name']    ?? '');
$phone   = $clean($_POST['phone']   ?? '');
$email   = $clean($_POST['email']   ?? '');
$service = $clean($_POST['service'] ?? '');
$task    = trim((string)($_POST['task'] ?? ''));
$page    = $clean($_POST['_page']   ?? '');
$subject = $clean($_POST['_subject'] ?? 'Заявка с сайта БТИ и ОЦЕНКИ');

$digits = preg_replace('/\D/', '', $phone);
if (mb_strlen($name) < 2) fail(422, 'Впишите имя');
if (strlen($digits) < 11) fail(422, 'Проверьте телефон');

$lines = [
    'Имя: ' . $name,
    'Телефон: ' . $phone,
    'Почта: ' . ($email ?: 'не указана'),
    'Услуга: ' . ($service ?: 'не выбрана'),
    'Задача: ' . ($task ?: 'не описана'),
    'Страница: ' . $page,
    'Время: ' . date('d.m.Y H:i'),
    'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? ''),
];
$body = implode("\n", $lines);

@file_put_contents($LOG, str_repeat('-', 40) . "\n" . $body . "\n", FILE_APPEND | LOCK_EX);

$headers  = 'From: ' . mb_encode_mimeheader('БТИ и ОЦЕНКИ') . ' <' . $FROM . ">\r\n";
$headers .= 'Reply-To: ' . ($email ?: $FROM) . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "MIME-Version: 1.0\r\n";

$ok = @mail($TO, mb_encode_mimeheader($subject), $body, $headers, '-f' . $FROM);
if (!$ok) fail(500, 'Письмо не ушло, позвоните нам по телефону');
done();
