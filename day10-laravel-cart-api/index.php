<?php
// Enable errors for development
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require __DIR__ . '/src/CartController.php';

$controller = new CartController(__DIR__ . '/storage');

header('Content-Type: application/json');

// Return JSON on uncaught exceptions
set_exception_handler(function ($e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Server error', 'message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
    @file_put_contents(__DIR__ . '/storage/debug.log', "EXCEPTION: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n", FILE_APPEND);
    exit;
});

// Convert PHP errors to exceptions so our handler catches them
set_error_handler(function ($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// When using the built-in CLI server, let it serve existing files directly
if (php_sapi_name() === 'cli-server') {
    $url = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . ($url['path'] ?? '');
    if ($file && is_file($file)) {
        return false; // serve the requested resource as-is
    }
}

// Simple file logger for debugging
$logFile = __DIR__ . '/storage/debug.log';
function dbg($msg) {
    global $logFile;
    $ts = date('c');
    file_put_contents($logFile, "[$ts] $msg\n", FILE_APPEND);
}
// Log that index executed
file_put_contents($logFile, "[" . date('c') . "] INDEX START\n", FILE_APPEND);

try {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $method = $_SERVER['REQUEST_METHOD'];
    dbg("path=$path method=$method");

    // client id can be provided via X-Client-Id header or ?client_id=...
    $clientId = isset($_SERVER['HTTP_X_CLIENT_ID']) ? $_SERVER['HTTP_X_CLIENT_ID'] : (isset($_GET['client_id']) ? $_GET['client_id'] : null);
    dbg('clientId=' . ($clientId ?? 'NULL'));
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
        dbg('add data=' . json_encode($data));
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
        dbg("route not found: $method $path");
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
    }
} catch (Throwable $e) {
    $msg = "UNCAUGHT: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine() . "\n" . $e->getTraceAsString();
    file_put_contents($logFile, "[" . date('c') . "] " . $msg . "\n", FILE_APPEND);
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Server error', 'message' => $e->getMessage()]);
}
