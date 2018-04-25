<?php
// +----------------------------------------------------------------------
// | Description: 公共模型,所有模型都可继承此模型，基于RESTFUL CRUD操作
// +----------------------------------------------------------------------
// | Author: Jensen
// +----------------------------------------------------------------------

namespace app\admin\model;

use think\Model;

class Common extends Model
{ 
    // 设置当前模型的数据库连接
	protected $connection = [];
	public function _initialize()
	{
		$connection = [
			// 数据库类型
			'type' => 'mysql',
			// 数据库连接DSN配置
			'dsn' => '',
			// 服务器地址
			'hostname' => '127.0.0.1',
			// 数据库名
			'database' => $GLOBALS['userInfo']['database'],
			// 数据库用户名
			'username' => 'root',
			// 数据库密码
			'password' => 'root',
			// 数据库连接端口
			'hostport' => '3306',
			// 数据库连接参数
			'params' => [],
			// 数据库编码默认采用utf8
			'charset' => 'utf8',
			// 数据库表前缀
			'prefix' => '',
		];
	}
	/**
	 * [getDataList 获取数据]
	 * @param     string                   $id [主键]
	 * @return    [array]                       
	 */
	public function getDataList($keywords, $page, $limit)
	{
		$data = $this
			->select();
		return $data;
	}
	/**
	 * [getDataById 根据主键获取详情]
	 * @param     string                   $id [主键]
	 * @return    [array]                       
	 */
	public function getDataById($param)
	{
		$data = $this->get($param['id']);
		if (!$data) {
			$this->error = 'This data is not available';
			return false;
		}
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

		try {
			$this->allowField(true)->save($param, [$this->getPk() => $param['id']]);
			return true;
		} catch (\Exception $e) {
			$this->error = 'Update failure';
			return false;
		}
	}

	/**
	 * [delDataById 根据id删除数据]
	 * @param     string                   $id     [主键]
	 * @param     boolean                  $delSon [是否删除子孙数据]
	 * @return    [type]                           [description]
	 */
	public function delDataById($param)
	{

		$this->startTrans();
		try {
			$this->where($this->getPk(), $param['id'])->delete();
			$this->commit();
			return true;
		} catch (\Exception $e) {
			$this->error = 'Delete failure';
			$this->rollback();
			return false;
		}
	}

	/**
	 * [delDatas 批量删除数据]
	 * @param     array                   $ids    [主键数组]
	 * @param     boolean                 $delSon [是否删除子孙数据]
	 * @return    [type]                          [description]
	 */
	public function delDatas($param)
	{
		$ids = $param['ids'];
		if (empty($ids)) {
			$this->error = 'Please select data';
			return false;
		}
		
		// 查找所有子元素
		if ($delSon) {
			foreach ($ids as $k => $v) {
				if (!is_numeric($v)) continue;
				$childIds = $this->getAllChild($v);
				$ids = array_merge($ids, $childIds);
			}
			$ids = array_unique($ids);
		}

		try {
			$this->where($this->getPk(), 'in', $ids)->delete();
			return true;
		} catch (\Exception $e) {
			$this->error = 'Delete failure';
			return false;
		}

	}



}