<template>
    <div>
        <div v-show="!setting" class="p-20">
            <el-row class="ovf-hd">
                <el-col class="m-b-10" :xs = "24" :md = "{span: 5}">
                  <el-row>
                    <el-col :span = "10">
                        <el-button type="primary" class="w-100p" @click="addressSetting">
                            <i class="el-icon-plus"></i>&nbsp;&nbsp;Add
                        </el-button>
                      </el-col>
                      <el-col :span = "10" :offset = "4">
                        <el-button type="warning"  class="w-100p" @click="deleteBtn">
                            <i class="el-icon-minus"></i>&nbsp;&nbsp;Delete
                        </el-button>
                      </el-col>
                    </el-row>
                </el-col>
                <el-col class="m-b-10" :xs = "24" :md = "{span: 5,offset:1}">
                    <el-input class="w-100p" placeholder="Please enter the model name" v-model="keywords">
                        <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
                    </el-input>
                </el-col>
                
            </el-row>
            <el-table :data="tableData" style="width: 100%" @selection-change="selectItem" @row-dblclick="rowDblclick"  :height="400">
                <el-table-column type="selection" width="50">
                </el-table-column>
                <el-table-column label="Country" prop="country" width="150">
                </el-table-column>
                <el-table-column label="Building" prop="address" width="150">
                </el-table-column>
                <el-table-column label="IP" prop="ip" width="150">
                </el-table-column>
                <el-table-column label="Port" prop="port" width="150">
                </el-table-column>
                <el-table-column label="MAC" prop="mac" width="200">
                </el-table-column>
                <el-table-column label="Latitude" prop="lat" width="200">
                </el-table-column>
                <el-table-column label="Longitude" prop="lng" width="150">
                </el-table-column>
                <el-table-column label="KW/USD" prop="kw_usd" width="150">
                </el-table-column>
                <el-table-column label="Comment" prop="comment"  width="300">
                </el-table-column>
            </el-table>
            <div class="pos-rel p-t-20">
                <div>
                    <!-- <el-button size="small" type="success" @click="setStatusBtn('enabled')">Enabled</el-button>
                    <el-button size="small" type="warning" @click="setStatusBtn('disabled')">Disabled</el-button>
                    <el-button size="small" type="danger" @click="deleteBtn()">Delete</el-button> -->
                </div>
                <div class="block pages">
                    <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="limit" :current-page="currentPage" :total="dataCount">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div v-if="setting">
            <add :add="add" :address="address" @goback="goback"></add>
        </div>
    </div>
</template>

<script>
import http from "../../../../assets/js/http";
import list from "../../../../assets/js/list";
import add from "./add";
export default {
  //  currentPage        页码
  //  keywords           关键字
  //  multipleSelection  被选中的数据
  //  limit              每页最大行数
  data() {
    return {
      tableData: [],
      // dataCount: null,
      currentPage: null,
      keywords: "",
      multipleSelection: [],
      limit: 15,
      add: true,
      setting: false,
      address: {}
    };
  },
  methods: {
    goback(bool) {
      this.setting = bool;
    },
    addressSetting() {
      this.add = true;
      this.setting = true;
      var address = {
        country: "",
        address: "",
        ip: "",
        port: "",
        mac: "",
        lat: "",
        lng: "",
        image: "",
        comment: "",
        operation: "0",
        status: "enabled"
      };
      this.address = address;
    },
    rowDblclick(row) {
      this.add = false;
      this.setting = true;
      this.address = row;
    },
    //获取被选中的数据
    selectItem(val) {
      this.multipleSelection = val;
    },
    //删除按钮事件
    deleteBtn() {
      let vm = this
      this.$confirm(
        "Are you sure to delete the selected data? The floor, room, and device that the building belongs to will also be deleted.",
        "Tips",
        {
          confirmButtonText: "Yse",
          cancelButtonText: "No",
          type: "warning"
        }
      )
        .then(() => {
          const data = {
            selections: this.multipleSelection
          };
          this.apiPost("admin/address/delete", data).then(res => {
            this.handelResponse(res, data => {
              _g.addDeviceProperty(data.device);
              vm.$store.dispatch("setAddress", data.address);
              vm.$store.dispatch("setDevices", data.device);
              vm.$store.dispatch("setFloor", data.floor);
              vm.$store.dispatch("setRoom", data.room);
              _g.toastMsg("success", data.result);
            });
          });
        })
        .catch(() => {
          // catch error
        });
    },
    getAllData() {
      // var pages = Math.ceil(this.dataCount/this.limit)
      var data = [];
      //   var devices = [];
      //   devices = devcice.cancat(this.devices);
      if (this.keywords != "") {
        for (var address of this.addresss) {
          if (address.address == this.keywords) {
            data.push(address);
          }
        }
      } else {
        data = this.addresss;
      }

      // var data = this.devices
      var start = this.limit * (this.currentPage - 1);
      var end = start + this.limit;
      this.tableData = data.slice(start, end);
    },
    //初始化时统一加载
    init() {
      this.getKeywords();
      this.getCurrentPage();
      this.getAllData();
    }
  },
  created() {
    console.log("address");
    this.init();
  },
  components: {
    add
  },
  computed: {
    //从vuex中获取设备数据
    addresss() {
      return this.$store.state.address;
    },
    //从vuex中获取设备数据条数
    dataCount() {
      return this.$store.state.address.length;
    }
  },
  watch: {
    $route(to, from) {
      this.init();
    },
    addresss: {
      handler: function(val, oldVal) {
        this.init();
      },
      deep: true
    }
  },
  mixins: [http, list]
};
</script>