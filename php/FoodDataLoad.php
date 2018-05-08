<?php

class FoodData
{
    public $Name;
    public $Price;
    public $Hunger;
    public $Meat;
    public $Grain;
    public $Vegetable;
}

// load credentials
$foodDataFile = "./Data/FoodData.csv";
$text = file_get_contents($foodDataFile);
$lines = explode("\n", $text);
unset($lines[0]);
$FoodDatas = array();

foreach($lines as $line)
{
    $data = explode(",", $line);
    $fd = new FoodData();
    $fd->Name = $data[0];
    $fd->Price = intval($data[1]);
    $fd->Hunger = intval($data[2]);
    $fd->Meat = intval($data[3]);
    $fd->Grain = intval($data[4]);
    $fd->Vegetable = intval($data[5]);
    array_push($FoodDatas, $fd);
}

$i = 0;

// test output
for (; $i < sizeof($FoodDatas); ++$i)
{
    echo $FoodDatas[$i]->Name," ", $FoodDatas[$i]->Price," ",  $FoodDatas[$i]->Hunger," ",  $FoodDatas[$i]->Meat," ",  $FoodDatas[$i]->Grain," ",  $FoodDatas[$i]->Vegetable," ",  PHP_EOL;
}
?>

<script type="text/javascript">
	var foodDatas = <?php echo(json_encode($FoodDatas)); ?>;
</script>