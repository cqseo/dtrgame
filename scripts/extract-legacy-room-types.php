<?php

if ($argc < 2) {
    fwrite(STDERR, "Usage: php extract-legacy-room-types.php <legacy-root>\n");
    exit(2);
}

$legacyRoot = rtrim($argv[1], DIRECTORY_SEPARATOR);
$config = $legacyRoot . '/include/roommng/roommng.config.php';
if (!is_file($config)) {
    fwrite(STDERR, "Legacy room configuration not found: {$config}\n");
    exit(2);
}

require $config;

echo json_encode([
    'maxRoomNum' => $max_room_num,
    'maxPrivateRoomNum' => $max_private_room_num,
    'soloRoomResetTime' => $soleroom_resettime,
    'soloRoomPrivateResetTime' => $soleroom_private_resettime,
    'roomTypes' => $roomtypelist,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
