<?php
include '../database.php';

$action =  $_REQUEST["action"];

switch ($action)
{
    case "insert":
        $room = isset($_REQUEST["room"]) ? $_REQUEST["room"] : '';
        $room_name = isset($_REQUEST["room_name"]) ? $_REQUEST["room_name"] : '';
        $image = isset($_REQUEST["image"]) ? $_REQUEST["image"] : '';
        $floor = isset($_REQUEST["floor"]) ? $_REQUEST["floor"] : '';
        $address = isset($_REQUEST["address"]) ? $_REQUEST["address"] : '';
        $sql="insert into room (room,room_name,image,floor,address) values ('".$room."','".$room_name."','".$image."','".$floor."','".$mac."','".$address."','enabled')";
        if (!mysqli_query($con,$sql))
        {
            $message = [];
            $message[0] = false;
            $message[1] = "insert failed: " . mysqli_error($con);
            echo(json_encode($message)); 
        }else{
            $message = [];
            $message[0] = true;
            $message[1] = "insert successfully";
            echo(json_encode($message)); 
        }
        break;
    case "update":
        $room = isset($_REQUEST["room"]) ? $_REQUEST["room"] : '';
        $room_name = isset($_REQUEST["room_name"]) ? $_REQUEST["room_name"] : '';
        $image = isset($_REQUEST["image"]) ? $_REQUEST["image"] : '';
        $floor = isset($_REQUEST["floor"]) ? $_REQUEST["floor"] : '';
        $address = isset($_REQUEST["address"]) ? $_REQUEST["address"] : '';
        $sql="update room set room_name = '".$room_name."',image = '".$image."' where room = '".$room."' and floor = '".$floor."' and address = '".$address."'";
        if (!mysqli_query($con,$sql))
        {
            $message = [];
            $message[0] = false;
            $message[1] = "update failed: " . mysqli_error($con);
            echo(json_encode($message)); 
        }else{
            $message = [];
            $message[0] = true;
            $message[1] = "update successfully";
            echo(json_encode($message)); 
        }
    break;
    case "delete":
        $ids = isset($_REQUEST["ids"]) ? $_REQUEST["ids"] : [];
        $re_str = "";
        $re = true;
        for ($i = 0; $i  < count($ids); $i++) {
            $id = json_decode($ids[$i]);
            $sql = " delete from schedule where id = '".$id."'";
            if (!mysqli_query($con,$sql))
            {
                $re = false;
                $re_str = $re_str." Delete failed: " .$id ;
            }
            
        }
        if (!$re)
        {
            $message = [];
            $message[0] = false;
            $message[1] = $re_str;
            echo(json_encode($message)); 
        }
        else{
            $message = [];
            $message[0] = true;
            $message[1] = "Delete successfully";
            echo(json_encode($message)); 
        }
        break;
    case "delete_command":
        
        $id = isset($_REQUEST["id"]) ? $_REQUEST["id"] : '';
        $re = true;
        $sql = " delete from schedule_command where id = '".$id."'";
        if (!mysqli_query($con,$sql))
        {
            $re = false;
            $re_str = " Delete failed: " .$id;
        }
        if (!$re)
        {
            $message = [];
            $message[0] = false;
            $message[1] = $re_str;
            echo(json_encode($message)); 
        }
        else{
            $message = [];
            $message[0] = true;
            $message[1] = "Delete successfully";
            echo(json_encode($message)); 
        }
        break;
    case "search":
        $schedule = isset($_REQUEST["schedule"]) ? " and schedule = '".$_REQUEST["schedule"]."'" : '';
        $keywords = isset($_REQUEST["schedule"]) ? " and schedule like '%".$_REQUEST["schedule"]."%'" : '';
        $page = intval(isset($_REQUEST["page"]) ? $_REQUEST["page"] : 0);
        $limit = intval(isset($_REQUEST["limit"]) ? $_REQUEST["limit"] : 0);
        $start = $limit*($page-1);
        $end = $limit*($page);
        $getSchedule="SELECT * FROM schedule where 1=1  ".$schedule." ".$keywords." limit ".$start.",".$end."";
        // $getCommand="SELECT * FROM (SELECT * FROM  schedule where 1=1  ".$schedule." ".$keywords." limit ".$start.",".$end.") as a left join schedule_command as b on a.id = b.schedule";
        $schedule = mysqli_query($con,$getSchedule);
        // $command = mysqli_query($con,$getCommand);
        $schedules = array();
        // $commands = array();
        // $results =array();
        while ($row = mysqli_fetch_assoc($schedule)) {
            $schedules[] = $row;
        }
        // while ($row = mysqli_fetch_assoc($command)) {
        //     $commands[] = $row;
        // }
        // $results[0] = $schedules;
        // $results[1] = $commands;
        $json_results = str_replace("\/","/",json_encode($schedules)); 
        echo $json_results;
    break;    
    case "insert_command":
    $id = isset($_REQUEST["id"]) ? $_REQUEST["id"] : '';
    $schedule = isset($_REQUEST["schedule"]) ? $_REQUEST["schedule"] : '';
    $type = isset($_REQUEST["type"]) ? $_REQUEST["type"] : '';
    $time_1 = isset($_REQUEST["time_1"]) ? $_REQUEST["time_1"] : '';
    $time_2 = isset($_REQUEST["time_2"]) ? $_REQUEST["time_2"] : '';
    $mon = isset($_REQUEST["mon"]) ? $_REQUEST["mon"] : '';
    $tues = isset($_REQUEST["tues"]) ? $_REQUEST["tues"] : '';
    $wed = isset($_REQUEST["wed"]) ? $_REQUEST["wed"] : '';
    $thur = isset($_REQUEST["thur"]) ? $_REQUEST["thur"] : '';
    $fri = isset($_REQUEST["fri"]) ? $_REQUEST["fri"] : '';
    $sat = isset($_REQUEST["sat"]) ? $_REQUEST["sat"] : '';
    $sun = isset($_REQUEST["sun"]) ? $_REQUEST["sun"] : '';
    $devices = isset($_REQUEST["devices"]) ? $_REQUEST["devices"] : [];
    
    if($id == ''){
        $updateSchedule = "insert into schedule (schedule,type,time_1,time_2,mon,tues,wed,thur,fri,sat,sun) values ('".$schedule."','".$type."','".$time_1."','".$time_2."','".$mon."','".$tues."','".$wed."','".$thur."','".$fri."','".$sat."','".$sun."')";
        mysqli_query($con,$updateSchedule);
        $id = "select max(id) as id from schedule";
        $id = mysqli_query($con,$id);
        $id = mysqli_fetch_assoc($id);
        $id = $id['id'];
    }
    else{
        $updateSchedule = "update schedule set schedule = '".$schedule."',type = '".$type."',time_1 = '".$time_1."',time_2 = '".$time_2."',mon = '".$mon."',tues = '".$tues."',wed = '".$wed."',thur = '".$thur."',fri = '".$fri."',sat = '".$sat."',sun = '".$sun."' where id = '".$id."'";
        mysqli_query($con,$updateSchedule);
    }
    $deleteCommand = "delete from schedule_command where schedule = '".$id."'";
    mysqli_query($con,$deleteCommand);
    $re = true;
    $re_str = "";
    for ($i = 0; $i  < count($devices); $i++) {
        $device = json_decode($devices[$i]);
        $insertCommand = "insert into schedule_command (schedule,device,on_off,mode,grade,status_1,status_2,status_3,status_4,status_5) values ('".$id."','".$device->id."','".$device->on_off."','".$device->mode."','".$device->grade."','".$device->operation_1."','".$device->operation_2."','".$device->operation_3."','".$device->operation_4."','".$device->operation_5."')";
        if (!mysqli_query($con,$insertCommand))
        {
            $re = false;
            $re_str = $re_str." Delete failed: " .$device->device;
        }
    }
        
    if (!$re)
    {
        $message = [];
        $message[0] = false;
        $message[1] = $re_str;
        echo(json_encode($message)); 
    }
    else{
        $message = [];
        $message[0] = true;
        $message[1] = "Insert successfully";
        echo(json_encode($message)); 
    }
    break; 
    case "search_command":
    $schedule = isset($_REQUEST["schedule"]) ? $_REQUEST["schedule"] : '';

    $sql="SELECT schedule,a.id as schedule_id,a.device as id,subnetid,deviceid,b.device as device,devicetype,a.on_off,a.mode,a.grade,status_1,status_2,status_3,status_4,status_5,b.address,b.floor,b.room,room_name  FROM  schedule_command as a left join device as b on a.device = b.id left join room as c on b.room = c.room and b.address = c.address and b.floor = c.floor  where  schedule = '".$schedule."' order by devicetype";
        $result = mysqli_query($con,$sql);
        $results = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $results[] = $row;
        }
        $json_results = str_replace("\/","/",json_encode($results)); 
        echo $json_results;
    break; 
};
mysqli_close($con);


?>