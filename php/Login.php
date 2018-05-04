<?php

// get user
// $username = $_POST["name"];
// $password = md5($_POST["password"]);

// test
$username = "Justin";
$password = "aaaaaaaaaa";

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

// test output
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "name: " . $row["name"]. " - email: " . $row["email"]. "<br>";
    }
} else {
    echo "0 results";
}
$conn->close();

?>
