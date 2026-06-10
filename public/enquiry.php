<?php
header("Access-Control-Allow-Origin: https://sikhchannelyatras.com");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode(["error" => "Method not allowed"]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"] ?? "");
$phone = trim($data["phone"] ?? "");
$email = trim($data["email"] ?? "");
$message = trim($data["message"] ?? "");

if (!$name || !$phone || !$email) {
  http_response_code(400);
  echo json_encode(["error" => "Name, phone and email are required"]);
  exit;
}

$to = "info@sikhchannelyatras.com";
$subject = "Sri Lanka Enquiry";

$body = "
New enquiry received from the website.

Name: $name
Contact Number: $phone
Email: $email
Message: $message
";

$headers = "From: Sikh Channel Yatras <info@sikhchannelyatras.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
  echo json_encode(["ok" => true, "message" => "Enquiry sent successfully"]);
} else {
  http_response_code(500);
  echo json_encode(["error" => "Failed to send email"]);
}
?>