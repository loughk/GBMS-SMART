<template>
    <el-row class="w-100p">
        <el-col :xs= "22" :md = "{span:6}" class="m-a-10">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="Mode Name">
                <el-input v-model.trim="form.breed" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="Auto Watts">
                <el-input v-model.trim="form.mode_auto" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="Fan Watts">
                <el-input v-model.trim="form.fan" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="Cool Watts">
                <el-input v-model.trim="form.cool" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="Heat Watts">
                <el-input v-model.trim="form.heat" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="Auto Wind Watts">
                <el-input v-model.trim="form.wind_auto" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="Low Wind Watts">
                <el-input v-model.trim="form.low" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="Medium Wind Watts">
                <el-input v-model="form.medium" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="High Wind Watts">
                <el-input v-model="form.high" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="Run Time(h)">
                <el-input v-model="form.run_time" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="add('form')" :loading="isLoading">Save</el-button>
                <el-button @click="goback()">Cancel</el-button>
            </el-form-item>
        </el-form>
        </el-col>
    </el-row>
</template>

<script>
import http from "../../../../../assets/js/http";
import fomrMixin from "../../../../../assets/js/form_com";

export default {
  data() {
    return {
      isLoading: false,
      form: {
        breed: "",
        mode_atuo: "",
        fan: "",
        cool: "",
        heat: "",
        wind_auto: "",
        low: "",
        medium: "",
        high: "",
        run_time: 0,
        status: "enabled"
      }
    };
  },
  methods: {
    add(form) {
      var vm = this;
      this.isLoading = !this.isLoading;
      const data = this.form;
      this.apiPost("admin/ac_breed", data).then(res => {
        this.handelResponse(res, data => {
          vm.apiGet("admin/ac_breed", {}).then(res => {
            vm.handelResponse(res, data => {
              vm.$store.dispatch("setAcBreed", data);
            });
          });
          _g.toastMsg("success", data);
          setTimeout(() => {
            vm.goback();
          }, 500);
        });

        vm.isLoading = false;
      });
    }
  },
  created() {
    console.log("ac_breed add");
  },
  mounted() {},
  components: {},
  mixins: [http, fomrMixin]
};
</script>