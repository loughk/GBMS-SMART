<template>
    <el-card class="box-card">
        <i v-if="device.warn" class="el-icon-warning device-card-warn"></i>
        <i class="el-icon-close device-close" @click="deviceDelete"></i>
        <div class="device-box">
            
            <div @click.stop="deviceContral(device)">
                <i class="fa device-box-icon" :class="iconstyle(device.devicetype)"></i>
            </div>
            <div style="margin-top:5px">
                <el-switch v-model="device.deviceProperty.on_off" @change="switch_change">
                </el-switch>
            </div>

        </div>
        <div class="box-card-line">
            <p style="margin:0">{{device.device}}</p>
        </div>
    </el-card>
</template>

<style>
@media screen and (max-width: 992px) {
  .box-card {
    position: relative;
    width: 80px;
    padding: 0;
    margin-right: 10px;
    margin-bottom: 8px;
    text-align: center;
  }
  .box-card .device-box .device-box-icon {
    font-size: 40px;
    color: #ccc;
  }
}
@media screen and (min-width: 400px)  and (max-width: 992px) {
  .box-card {
    position: relative;
    width: 100px;
    padding: 0;
    margin-right: 10px;
    margin-bottom: 8px;
    text-align: center;
  }
  .box-card .device-box .device-box-icon {
    font-size: 40px;
    color: #ccc;
  }
}
@media screen and (min-width: 992px) {
  .box-card {
    position: relative;
    width: 150px;
    padding: 0;
    margin-right: 30px;
    margin-bottom: 16px;
    text-align: center;
  }
  .box-card .device-box .device-box-icon {
    font-size: 80px;
    color: #ccc;
  }
}

.box-card .box-card-line {
  padding: 0;
  margin: 0;
  height: 30px;
  line-height: 30px;
  color: #aaa;
  border-top: 1px solid #515151;
}
.box-card .device-box {
  padding: 0;
  margin-bottom: 10px;
}
.box-card .device-card-warn {
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 16px;
  color: #ff4949;
}
.box-card .device-close {
  position: absolute;
  top: 3px;
  right: 3px;
  padding: 3px;
  border-radius: 3px;
  font-size: 6px;
  color: rgb(204, 204, 204);
}
.box-card .device-close:hover {
  background-color: #ff4949;
  color: #fff;
}
</style>

<script>
import http from "../../assets/js/http";
import lightApi from "../Content/devices/light/api.js";
import acApi from "../Content/devices/ac/api.js";
import ledApi from "../Content/devices/led/api.js";
import musicApi from "../Content/devices/music/api.js";
import curtainApi from "../Content/devices/curtain/api.js";
import floorHeatApi from "../Content/devices/floorheat/api.js";
export default {
  data() {
    return {};
  },
  props: ["device"],
  methods: {
    //删除设备
    deviceDelete() {
      var vm = this;
      this.$confirm("Are you sure to delete the selected data?", "Tips", {
        confirmButtonText: "Yse",
        cancelButtonText: "No",
        type: "warning"
      })
        .then(() => {
          const data = {
            selections: [this.device]
          };
          this.apiPost("admin/device/delete", data).then(res => {
            this.handelResponse(res, data => {
              var devices = vm.$store.state.devices;
              for (var i = 0; i < devices.length; i++) {
                if (devices[i].id == vm.device.id) {
                  devices.splice(i, 1);
                }
              }
              vm.$store.dispatch("setDevices", devices);
              _g.toastMsg("success", data);
            });
          });
        })
        .catch(() => {
          // catch error
        });
    },
    //打开设备详细操作页
    deviceContral(device) {
      // this.$store.dispatch("showContral", true);
      // let url = "/home/contral/" + device.devicetype;
      // console.log('typelist:' + url + '/n');
      // console.log('123')
      this.$store.dispatch("setDevice", device);
      this.$store.dispatch("setShowRightPage", false);
      this.$store.dispatch("setShowRightPage", true);
      // if (url != this.$route.path) {
      //   router.push(url);
      // } else {
      //   _g.shallowRefresh(this.$route.name);
      // }
    },
    //设备开关
    switch_change(val) {
      switch (this.device.devicetype) {
        case "light":
          lightApi.switch_change(val, this.device);
          break;
        case "ac":
          acApi.switch_change(val, this.device);
          break;
        case "led":
          ledApi.switch_change(val, this.device);
          break;
        case "music":
          musicApi.switch_change(val, this.device);
          break;
        case "curtain":
          curtainApi.switch_change(val, this.device);
          break;
        case "ir":
          curtainApi.switch_change(val, this.device);
          break;
        case "floorheat":
          floorHeatApi.switch_change(val, this.device);
          break;
      }
    },
    //读取设备开关状态
    readOpen() {
      switch (this.device.devicetype) {
        case "light":
          lightApi.readOpen(this.device);
          break;
        case "ac":
          acApi.readOpen(this.device);
          break;
        case "led":
          ledApi.readOpen(this.device);
          break;
        case "music":
          // this.device.on_off = false
          musicApi.readStatus(this.device);
          break;
        case "curtain":
          curtainApi.readOpen(this.device);
          break;
        case "floorheat":
          floorHeatApi.readOpen(this.device);
          break;
      }
      // console.log("OK");
    },
    //根据设备类型选择图标
    iconstyle(type) {
      switch (type) {
        case "light":
          return "fa-lightbulb-o";
          break;
        case "led":
          return "fa-lightbulb-o";
          break;
        case "ac":
          return "fa-thermometer";
          break;
        case "music":
          return "fa-music";
          break;
        case "curtain":
          return "fa-columns";
          break;
        case "ir":
          return "fa-life-ring";
          break;
        case "security":
          return "fa-lock";
          break;
        case "floorheat":
          return "fa-thermometer";
          break;
      }
    }
  },
  created() {
    console.log("device");
  },
  props: ["device"],
  components: {},
  computed: {},
  mixins: [http]
};
</script>