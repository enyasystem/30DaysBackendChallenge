<?php
require __DIR__ . '/src/CartController.php';

$controller = new CartController(__DIR__ . '/storage');

header('Content-Type: application/json');

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// client id can be provided via X-Client-Id header or ?client_id=...
$clientId = isset($_SERVER['HTTP_X_CLIENT_ID']) ? $_SERVER['HTTP_X_CLIENT_ID'] : (isset($_GET['client_id']) ? $_GET['client_id'] : null);
if (!$clientId) {
    http_response_code(400);
    echo json_encode(['error' => 'Client ID required. Provide X-Client-Id header or ?client_id=...']);
    exit;
}

switch ("$method $path") {
    case 'GET /cart':
        echo json_encode($controller->getCart($clientId));
        break;
    case 'POST /cart/add':
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode($controller->addItem($clientId, $data));
        break;
    case 'POST /cart/remove':
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode($controller->removeItem($clientId, $data));
        break;
    case 'POST /cart/clear':
        echo json_encode($controller->clearCart($clientId));
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
}
