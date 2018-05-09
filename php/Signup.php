<?php
session_start();

// get user
$username = $_POST["uname"];
$password = md5($_POST["psw"]);
$email = $_POST["email"];

$dbservername = "localhost";
$dbusername = "id5623156_fruit";
$dbpassword = "salad";
$dbname = "id5623156_login";

// Create connection
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);
// Check connection
if ($conn->connect_error)
{
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT name FROM user WHERE name = \"". $username. "\"";
$result = $conn->query($sql);

// test output
if ($result->num_rows > 0)
{
    echo "name already exists";
}
else {
	$sql = "SELECT name FROM user WHERE email = \"". $email."\"";
	$result = $conn->query($sql);

	if ($result->num_rows > 0)
	{
		echo "email already exists";
	}
	else
	{
        header("Location: ../html/index.html");
	}
}

$conn->close();

?>
