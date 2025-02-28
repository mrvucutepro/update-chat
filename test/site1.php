<?php

$id = 'user1'; // user_id
$alias = 'SMD';
$host = $_SERVER['HTTP_HOST'];

$userID = "{$alias}{$id}";
$userCode = md5("{$userID}{$alias}{$host}6c548acd-d4b6-4c96-ab2f-fe321571f752");

$query = array(
    'userId' => $userID,
    'userGroup' => $alias,
    'userCode' => $userCode,
    'userDomain' => $host,
);

$talk_url = 'http://127.0.0.1:88/userToc/userMessage.html?' . http_build_query($query);

?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <a href="#" id="livechat" onclick="livechat();">실시간상담</a>

    <script>
        function livechat() {
            a = window.open('<?= $talk_url ?>', "1v1", "width=250px, height=300px");
            a.focus();
        }
    </script>
</body>

</html>