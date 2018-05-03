<?php
// +----------------------------------------------------------------------
// | Description: 场景
// +----------------------------------------------------------------------
// | Author: GBMS-SMART
// +----------------------------------------------------------------------

namespace app\admin\model;

use think\Db;
use app\admin\model\Common;
use com\verify\HonrayVerify;

class Macro extends Common
{

    protected $name = 'macro';

    /**
     * [getDataList 列表]
     * @AuthorHTL
     * @DateTime  2017-02-10T22:19:57+0800
     * @param     [string]                   $keywords [关键字]
     * @param     [number]                   $page     [当前页数]
     * @param     [number]                   $limit    [t每页数量]
     * @return    [array]                             [description]
     */
    public function getDataList($keywords="", $page=0, $limit=0)
    {
        $map = [];
        //根据keywords筛选Macro信息
        if ($keywords) {
            $map['macro'] = ['like', '%' . $keywords . '%'];
        }
        $data = $this->where($map);

        // 若有分页
        if ($page && $limit) {
            $data = $data->page($page, $limit);
        }
        $data = $data->select();
        return $data;
    }

    /**
     * 创建Macro
     * @param  array $param [description]
     */
    public function createData($param)
    {
        $id = $param['id'];
        $macro = $param['macro'];
        $devices = $param['devices'];
       // 验证
        $validate = validate($this->name);
        if (!$validate->check($param)) {
            $this->error = $validate->getError();
            return false;
        }

        $this->startTrans();
        try {

            if (empty($id)) {
                $this->data(['macro' => $macro])->insert();
                $id = $this->max('id')->get();
            } else {
                $this->data(['macro' => $macro])->where('id', $id)->update();
                Db::table('marco_command')->where('marco', $id)->delete();
            }
            foreach ($devices as $k => $v) {
                $device = json_decode($v);
                $data = ['macro' => $id, 'device' => $device->id, 'on_off' => $device->on_off, 'mode' => $device->mode, 'grade' => $device->grade, 'status_1' => $device->operation_1, 'status_2' => $device->operation_2, 'status_3' => $device->operation_3, 'status_4' => $device->operation_4, 'status_5' => $device->operation_5, 'time' => $device->time];
                Db::table('marco_command')->data($data)->insert();
            }
            $this->commit();
            return true;
        } catch (\Exception $e) {
            $this->rollback();
            $this->error = 'Add failure';
            return false;
        }
    }

    /**
     * 删除Macro
     * @param  array $param [description]
     */
    public function delDataById($param)
    {
        $ids = $param['ids'];
        $this->startTrans();
        try {
            foreach ($ids as $k => $v) {
                $this->where('id', '=', $v)->delete();
                Db::table('marco_command')->where('marco', '=', $v)->delete();
            }
            $this->commit();
            return true;
        } catch (\Exception $e) {
            $this->rollback();
            $this->error = 'Add failure';
            return false;
        }
    }
    /**
     * 删除Macro
     * @param  array $param [description]
     */
    public function delCommandById($param)
    {
        $id = $param['id'];
        $this->startTrans();
        try {
            Db::table('marco_command')->where('id', '=', $id)->delete();
            $this->commit();
            return true;
        } catch (\Exception $e) {
            $this->rollback();
            $this->error = 'Add failure';
            return false;
        }
    }
}