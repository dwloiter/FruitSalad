<?php


$dbservername = "localhost";
$dbusername = "id5623156_fruit";
$dbpassword = "salad";
$dbname = "id5623156_login";
$place = 1; 

// Create connection
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);
// Check connection
if ($conn->connect_error)
{
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT name,score FROM user ORDER BY score DESC LIMIT 5;";
$result = $conn->query($sql);

if($result->num_rows > 0){
  while($row = $result->fetch_assoc()){
    echo "<h2>" . $place . ". " . $row["name"] .". . . . .".$row["score"]. "</h2><br/>";
    $place++;
  }
}

$conn->close();

?>
