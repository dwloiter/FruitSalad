<?php
session_start();

// get user
$username = $_POST["uname"];
$password = md5($_POST["psw"]);

$dbservername = "localhost";
$dbusername = "id5623156_fruit";
$dbpassword = "salad";
$dbname = "id5623156_login";

// Create connection
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT name, email FROM user WHERE name = \"". $username. "\" AND password = \"". $password."\"";
$result = $conn->query($sql);

// send user to index
if ($result->num_rows > 0) {
    header("Location: ../html/index.html");
} else {
    echo "Sorry, we couldn't find that combination of username, password";
}
$conn->close();

?>
