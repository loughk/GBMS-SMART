<template>
    <div  v-loading="isLoading" class="m-t-20 m-l-30">
        <div style="margin-bottom:20px;padding-left:10px;height:30px;line-height:30px;background-color:#58B7FF;color:#fff;border-radius:5px">
                    <p>Runing device</p>
                </div>
        <device ref="device" class="fl" v-for="(val,key) in runList" :key = "key" :device="val"></device>
        <right-page v-if="showRightPage">
          
        </right-page>
    </div>
</template>

<script>
import http from "../../../assets/js/http.js";
import device from "../../Common/device";
import rightPage from "../../Common/rightPage";
export default {
  data() {
    return {
      //   runList: [],
      isLoading: false,
      interval: ""
    };
  },
  methods: {},
  created() {
    console.log("runing");
  },
  mounted() {
    var vm = this;
    var devices = vm.$refs.device
    var i = 0;
    var len = devices.length;
    if (len > 0) {
      vm.interval = setInterval(function() {
        devices[i].readOpen();
        i = i + 1;
        if (i >= len) {
          clearInterval(vm.interval);
          // return;
        }
      }, 100);
    }
  },
  destroyed() {
    clearInterval(this.interval);
  },
  components: {
    device,
    rightPage
  },
  computed: {
    runList() {
      var runList = [];
      for (var device of this.$store.state.devices) {
        if (device.deviceProperty.on_off == true) {
          runList.push(device);
        }
      }
      return runList;
    },
    showRightPage() {
      return this.$store.state.showRightPage;
    }
  },
  watch: {
    // $route(to, from) {
    //   this.init();
    // },
    // devices: {
    //   handler: function(val, oldVal) {
    //     for (var device of val) {
    //       if ((device.on_off = "on")) {
    //         this.runList.push(device);
    //       }
    //     }
    //   },
    //   deep: true
    // }
  },
  mixins: [http]
};
</script>