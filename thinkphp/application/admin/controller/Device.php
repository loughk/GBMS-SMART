<?php
// +----------------------------------------------------------------------
// | Description: 设备
// +----------------------------------------------------------------------
// | Author: Jensen
// +----------------------------------------------------------------------

namespace app\admin\controller;

class Device extends ApiCommon
{

    public function index()
    {   
        $deviceModel = model('Device');
        $param = $this->param;
        $keywords = !empty($param['keywords']) ? $param['keywords']: '';
        $page = !empty($param['page']) ? $param['page']: '';
        $limit = !empty($param['limit']) ? $param['limit']: '';    
        $data = $deviceModel->getDataList($keywords, $page, $limit);
        return resultArray(['data' => $data]);
    }

    public function read()
    {
        $deviceModel = model('Device');
        $param = $this->param;
        $data = $deviceModel->getDataById($param);
        if (!$data) {
            return resultArray(['error' => $deviceModel->getError()]);
        } 
        return resultArray(['data' => $data]);
    }

   public function save()
   {
       $deviceModel = model('Device');
       $param = $this->param;
       $data = $deviceModel->createData($param);
       if (!$data) {
           return resultArray(['error' => $deviceModel->getError()]);
       }
       $data['result'] = 'Add success';
       return resultArray(['data' => $data]);
   }

    public function update()
    {
        $deviceModel = model('Device');
        $param = $this->param;
        $data = $deviceModel->updateDataById($param);
        if (!$data) {
            return resultArray(['error' => $deviceModel->getError()]);
        } 
        $data['result'] = 'Update success';
        return resultArray(['data' => $data]);
    }

    public function delete()
    {
        $deviceModel = model('Device');
        $param = $this->param;
        $data = $deviceModel->delDatas($param);
        if (!$data) {
            return resultArray(['error' => $deviceModel->getError()]);
        } 
        return resultArray(['data' => 'Delete success']);
    }
    public function updateLocation()
    {
        $deviceModel = model('Device');
        $param = $this->param;
        $data = $deviceModel->updateLocation($param);
        if (!$data) {
            return resultArray(['error' => $deviceModel->getError()]);
        } 
        return resultArray(['data' => 'Delete success']);
    }
    public function setColor()
    {
        $deviceModel = model('Device');
        $param = $this->param;
        $data = $deviceModel->setColor($param);
        if (!$data) {
            return resultArray(['error' => $deviceModel->getError()]);
        } 
        return resultArray(['data' => 'Delete success']);
    }
    public function getIrOperation()
    {
        $deviceModel = model('Device');
        $param = $this->param;
        $data = $deviceModel->getIrOperation($param);
        if (!$data) {
            return resultArray(['error' => $deviceModel->getError()]);
        } 
        return resultArray(['data' => 'Delete success']);
    }
    public function insertIrOperation()
    {
        $deviceModel = model('Device');
        $param = $this->param;
        $data = $deviceModel->insertIrOperation($param);
        if (!$data) {
            return resultArray(['error' => $deviceModel->getError()]);
        } 
        return resultArray(['data' => 'Delete success']);
    }
    public function updateIrOperation()
    {
        $deviceModel = model('Device');
        $param = $this->param;
        $data = $deviceModel->updateIrOperation($param);
        if (!$data) {
            return resultArray(['error' => $deviceModel->getError()]);
        } 
        return resultArray(['data' => 'Delete success']);
    }
    public function setTime()
    {
        $deviceModel = model('Device');
        $param = $this->param;
        $data = $deviceModel->setTime($param);
        if (!$data) {
            return resultArray(['error' => $deviceModel->getError()]);
        } 
        return resultArray(['data' => 'Delete success']);
    }
}
 