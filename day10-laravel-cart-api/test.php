<?php
file_put_contents(__DIR__ . '/storage/debug.log', "TEST-HIT\n", FILE_APPEND);
echo "ok";
