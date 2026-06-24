<?php
/* ============================================================
   ITS合同会社 お問い合わせフォーム メール送信 (Xserver / PHP)
   ------------------------------------------------------------
   ★ 送信先メールアドレスは下の $TO を編集してください。
   ============================================================ */

// ===== 設定（必要に応じて変更） =====
$TO         = 'info@its-tokyo.com';                 // ★お問い合わせの届け先（要確認）
$FROM       = 'no-reply@its-tokyo.com';             // 送信元（独自ドメインのアドレス推奨）
$SITE_NAME  = 'ITS合同会社 公式サイト';
$AUTO_REPLY = true;                                 // 送信者へ受付確認メールを自動返信する

header('Content-Type: application/json; charset=utf-8');
mb_language('Japanese');
mb_internal_encoding('UTF-8');

// POST 以外は拒否
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'method']);
  exit;
}

// ハニーポット（bot がここに入力したら成功を装って破棄）
if (!empty($_POST['website'])) {
  echo json_encode(['ok' => true]);
  exit;
}

// ヘッダインジェクション対策
function oneline($s) { return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', (string)$s)); }

$name  = oneline($_POST['name']  ?? '');
$email = oneline($_POST['email'] ?? '');
$type  = oneline($_POST['type']  ?? '');
$msg   = trim((string)($_POST['message'] ?? ''));

// バリデーション
$fields = [];
if ($name === '')                                        $fields[] = 'name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))          $fields[] = 'email';
if ($type === '')                                        $fields[] = 'type';
if ($msg === '')                                         $fields[] = 'message';
if ($fields) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'validation', 'fields' => $fields]);
  exit;
}

// 種別ラベル
$typeMap = [
  'system'     => 'システム受託開発',
  'consulting' => 'ITコンサルティング',
  'web'        => 'Web制作・開発',
  'design'     => 'デザイン',
  'familink'   => 'Familinkについて',
  'recruit'    => '採用について',
  'other'      => 'その他',
];
$typeLabel = $typeMap[$type] ?? $type;

// 本文
$subject = '【お問い合わせ】' . $name . ' 様（' . $typeLabel . '）';
$body =
  "ITS合同会社 公式サイトのお問い合わせフォームより送信されました。\n\n" .
  "──────────────────────────────\n" .
  "お名前　： {$name}\n" .
  "メール　： {$email}\n" .
  "種別　　： {$typeLabel}\n" .
  "──────────────────────────────\n" .
  "【お問い合わせ内容】\n{$msg}\n" .
  "──────────────────────────────\n" .
  "送信日時： " . date('Y-m-d H:i:s') . "\n" .
  "送信元IP： " . ($_SERVER['REMOTE_ADDR'] ?? '') . "\n";

// ヘッダ（Reply-To に送信者を入れて、そのまま返信できるように）
$headers  = 'From: ' . mb_encode_mimeheader($SITE_NAME) . ' <' . $FROM . '>' . "\r\n";
$headers .= 'Reply-To: ' . $email . "\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion();

$sent = mb_send_mail($TO, $subject, $body, $headers);

if ($sent) {
  // --- 送信者へ自動返信（受付確認メール） ---
  if ($AUTO_REPLY) {
    $ar_subject = '【ITS合同会社】お問い合わせを受け付けました';
    $ar_body =
      "{$name} 様\n\n" .
      "この度はお問い合わせいただき、誠にありがとうございます。\n" .
      "下記の内容で受け付けいたしました。担当者より追ってご連絡いたしますので、\n" .
      "今しばらくお待ちくださいますようお願い申し上げます。\n\n" .
      "──────────────────────────────\n" .
      "種別　　： {$typeLabel}\n" .
      "【お問い合わせ内容】\n{$msg}\n" .
      "──────────────────────────────\n\n" .
      "※本メールは自動送信です。お心当たりがない場合は破棄してください。\n\n" .
      "ITS合同会社\n" .
      "https://its-tokyo.com/\n";
    $ar_headers  = 'From: ' . mb_encode_mimeheader($SITE_NAME) . ' <' . $FROM . '>' . "\r\n";
    $ar_headers .= 'Reply-To: ' . $TO . "\r\n";
    @mb_send_mail($email, $ar_subject, $ar_body, $ar_headers);
  }
  echo json_encode(['ok' => true]);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'send']);
}
