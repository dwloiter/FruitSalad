<?php
session_start();
$dbservername = "localhost";
$dbusername = "id5623156_fruit";
$dbpassword = "salad";
$dbname = "id5623156_login";


$score = $_POST["score"];

// Create connection
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "UPDATE `user` SET `score`= ". $score . " WHERE name = \"" . $_SESSION["username"] . "\"
        AND score < ". $score .";";

$result = $conn->query($sql);
$conn->close();
?>
