<?php
// +----------------------------------------------------------------------
// | Description: 楼层
// +----------------------------------------------------------------------
// | Author: Jensen
// +----------------------------------------------------------------------

namespace app\admin\model;

use think\Db;
use app\admin\model\Common;
use com\verify\HonrayVerify;

class Floor extends Common
{

	protected $name = 'floor';

	public function getDataList($keywords = "", $page = 0, $limit = 0)
	{

		if ($_SERVER['SERVER_NAME'] == "localhost") {
			$host_name = exec("hostname");
			$host_ip = gethostbyname($host_name);
		} else {
			$host_ip = $_SERVER['SERVER_NAME'];
		}
		$image_addr = "http://" . $host_ip . ":" . $_SERVER["SERVER_PORT"];

		$data = $this->order('address,floor+0')->select();
		foreach ($data as $k => $v) {
			$v["image_addr"] = $image_addr;
			$v["image_full"] = $v["image"] == "" ? "" : $image_addr . $v["image"];
		}
		// usort($data, function ($a, $b) {
		// 	if (intval($a->floor) == intval($b->floor)) return 0;
		// 	if (intval($a->floor) < intval($b->floor)) {
		// 		return -1;
		// 	} else {
		// 		return 1;
		// 	}
		// });
		return $data;
	}

	/**
	 * [createData 新建]
	 * @param     array                    $param [description]
	 * @return    [array]                         [description]
	 */
	public function createData($param)
	{
		
		// 验证
		$validate = validate($this->name);
		if (!$validate->check($param)) {
			$this->error = $validate->getError();
			return false;
		}
		try {
			$this->data($param)->allowField(true)->save();
			$room_num = intval($param['room_num']);
			$room_list = [];
			for ($i = 1; $i <= $room_num; $i++) {
				$room_data = ['room' => $i, 'room_name' => $i, 'address' => $param['address'], 'floor' => $param['floor'], 'status' => 'enabled'];
				array_push($room_list, $room_data);
			}
			Db::table('room')->insertAll($room_list);
			return true;
		} catch (\Exception $e) {
			$this->error = 'Add failure';
			return false;
		}
	}

	/**
	 * [updateDataById 编辑]
	 * @param     [type]                   $param [description]
	 * @param     [type]                   $id    [description]
	 * @return    [type]                          [description]
	 */
	public function updateDataById($param)
	{
		$checkData = $this->get($param['id']);
		if (!$checkData) {
			$this->error = 'This data is not available';
			return false;
		}

		// 验证
		$validate = validate($this->name);
		if (!$validate->check($param)) {
			$this->error = $validate->getError();
			return false;
		}
		$room_count = Db::table('room')->where(['address' => ['=', $param['address']], 'floor' => ['=', $param['floor']]])->count('id');
		$room_num = intval($param['room_num']);
		try {
            //更新地址表
			$this->allowField(true)->save($param, ['address' => ['=', $param['address']], 'floor' => ['=', $param['floor']]]);
            //更新房间数量
			$room_list = [];
			if ($room_num > $room_count) {
				for ($i = $room_count + 1; $i <= $room_num; $i++) {
					$room_data = ['room' => $i, 'room_name' => $i, 'address' => $param['address'], 'floor' => $param['floor'], 'status' => 'enabled'];
					array_push($room_list, $room_data);
				}
				Db::table('room')->insertAll($room_list);
			} else if ($room_num < $room_count) {
				Db::table('room')->where(['address' => ['=', $param['address']], 'floor' => ['=', $param['floor']], 'room' => ['>', $room_num]])->delete();
				Db::table('device')->where(['address' => ['=', $param['address']], 'floor' => ['=', $param['floor']], 'room' => ['>', $room_num]])->delete();
			}
			return true;
		} catch (\Exception $e) {
			$this->error = 'Update failure';
			return false;
		}
	}

	/**
	 * 删除Schedule
	 * @param  array $param [description]
	 */
	public function delDatas($param)
	{
		$selections = $param['selections'];
		$this->startTrans();
		try {
			foreach ($selections as $k => $v) {
				$this->where(['address' => ['=', $v['address']], 'floor' => ['=', $v['floor']]])->delete();
				Db::table('room')->where(['address' => ['=', $v['address']], 'floor' => ['=', $v['floor']]])->delete();
				Db::table('device')->where(['address' => ['=', $v['address']], 'floor' => ['=', $v['floor']]])->delete();
			}
			$this->commit();
			return true;
		} catch (\Exception $e) {
			$this->rollback();
			$this->error = 'Delete failure';
			return false;
		}
	}
}