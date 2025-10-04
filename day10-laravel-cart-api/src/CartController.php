<?php
class CartController
{
    private $dir;

    public function __construct($storageDir)
    {
        $this->dir = rtrim($storageDir, '/\\');
        if (!is_dir($this->dir)) {
            mkdir($this->dir, 0777, true);
        }
    }

    private function fileFor($clientId)
    {
        $safe = preg_replace('/[^a-zA-Z0-9_\\-]/', '_', $clientId);
        return $this->dir . DIRECTORY_SEPARATOR . $safe . '.json';
    }

    private function load($clientId)
    {
        $file = $this->fileFor($clientId);
        if (!file_exists($file)) {
            return ['items' => [], 'total' => 0.0];
        }
        $json = file_get_contents($file);
        $data = json_decode($json, true);
        return $data ?: ['items' => [], 'total' => 0.0];
    }

    private function save($clientId, $cart)
    {
        file_put_contents($this->fileFor($clientId), json_encode($cart, JSON_PRETTY_PRINT));
    }

    private function recalc(&$cart)
    {
        $total = 0.0;
        foreach ($cart['items'] as &$item) {
            $total += $item['price'] * $item['quantity'];
        }
        $cart['total'] = round($total, 2);
    }

    public function getCart($clientId)
    {
        return $this->load($clientId);
    }

    public function addItem($clientId, $data)
    {
        if (!is_array($data) || !isset($data['product_id'])) {
            http_response_code(400);
            return ['error' => 'product_id required'];
        }

        $cart = $this->load($clientId);

        // merge if exists
        $found = false;
        foreach ($cart['items'] as &$item) {
            if ($item['product_id'] === $data['product_id']) {
                $item['quantity'] += isset($data['quantity']) ? (int)$data['quantity'] : 1;
                $found = true;
                break;
            }
        }

        if (!$found) {
            $cart['items'][] = [
                'product_id' => $data['product_id'],
                'name' => isset($data['name']) ? $data['name'] : '',
                'price' => isset($data['price']) ? (float)$data['price'] : 0.0,
                'quantity' => isset($data['quantity']) ? (int)$data['quantity'] : 1,
            ];
        }

        $this->recalc($cart);
        $this->save($clientId, $cart);

        return ['success' => true, 'cart' => $cart];
    }

    public function removeItem($clientId, $data)
    {
        if (!is_array($data) || !isset($data['product_id'])) {
            http_response_code(400);
            return ['error' => 'product_id required'];
        }

        $cart = $this->load($clientId);
        $new = [];
        foreach ($cart['items'] as $item) {
            if ($item['product_id'] === $data['product_id']) {
                continue;
            }
            $new[] = $item;
        }
        $cart['items'] = $new;

        $this->recalc($cart);
        $this->save($clientId, $cart);

        return ['success' => true, 'cart' => $cart];
    }

    public function clearCart($clientId)
    {
        $cart = ['items' => [], 'total' => 0.0];
        $this->save($clientId, $cart);
        return ['success' => true, 'cart' => $cart];
    }
}
