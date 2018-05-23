<?php
session_start();
if(!isset($_SESSION["username"])){
  header("Location: ../html/login.html");
} else {
  $name = $_SESSION["username"];
}
?>
