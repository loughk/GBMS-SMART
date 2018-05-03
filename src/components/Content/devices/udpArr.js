import api from "./api";
import ac from "./ac/api";
import light from "./light/api";
import led from "./led/api";
import curtain from "./curtain/api";
import music from "./music/api";
const udpArr = {
    sendUdpArr(deviceList){
        var udpArr = [];
          for (var device of deviceList) {
            switch (device.devicetype) {
              case "ac":
                if (device.on_off == "1") {
                  udpArr.push({
                    device: device,
                    data: ac.get_switch_change(true, device)
                  });
                  switch (device.mode) {
                    case "cool":
                      udpArr.push({
                        device: device,
                        data: ac.get_coolbtn(device)
                      });
                      udpArr.push({
                        device: device,
                        data: ac.get_cooltmp_change(device.status_1, device)
                      });
                      break;
                    case "fan":
                      udpArr.push({
                        device: device,
                        data: ac.get_fanbtn(device)
                      });
                      udpArr.push({
                        device: device,
                        data: ac.get_cooltmp_change(device.status_1, device)
                      });
                      break;
                    case "heat":
                      udpArr.push({
                        device: device,
                        data: ac.get_heatbtn(device)
                      });
                      udpArr.push({
                        device: device,
                        data: ac.get_heattmp_change(device.status_1, device)
                      });
                      break;
                    case "auto":
                      udpArr.push({
                        device: device,
                        data: ac.get_autobtn(device)
                      });
                      udpArr.push({
                        device: device,
                        data: ac.get_autotmp_change(device.status_1, device)
                      });
                      break;
                  }
                  switch (device.grade) {
                    case "wind_auto":
                      udpArr.push({
                        device: device,
                        data: ac.get_wind_change("0", device)
                      });
                      break;
                    case "high":
                      udpArr.push({
                        device: device,
                        data: ac.get_wind_change("1", device)
                      });
                      break;
                    case "medial":
                      udpArr.push({
                        device: device,
                        data: ac.get_wind_change("2", device)
                      });
                      break;
                    case "low":
                      udpArr.push({
                        device: device,
                        data: ac.get_wind_change("3", device)
                      });
                      break;
                  }
                } else {
                  udpArr.push({
                    device: device,
                    data: ac.get_switch_change(false, device)
                  });
                }
                break;
              case "light":
                if (device.on_off == "1") {
                  var deviceProperty = {
                    brightness: 100
                  };
                  udpArr.push({
                    device: device,
                    data: light.get_switch_change(true, device, deviceProperty)
                  });
                } else {
                  var deviceProperty = {
                    brightness: 0
                  };
                  udpArr.push({
                    device: device,
                    data: light.get_switch_change(false, device, deviceProperty)
                  });
                }
                break;
              case "led":
                if (device.on_off == "1") {
                  var deviceProperty = {
                    color: device.mode
                  };
                  udpArr.push({
                    device: device,
                    data: led.get_switch_change(true, device, deviceProperty)
                  });
                  // udpArr.push(light.get_slider_change(true, device));
                } else {
                  var deviceProperty = {
                    color: "#000000"
                  };
                  udpArr.push({
                    device: device,
                    data: led.get_switch_change(false, device, deviceProperty)
                  });
                }
                break;
              case "curtain":
                if (device.on_off == "1") {
                  udpArr.push({
                    device: device,
                    data: curtain.get_switch_change(true, device)
                  });
                  // udpArr.push(light.get_slider_change(true, device));
                } else {
                  udpArr.push({
                    device: device,
                    data: curtain.get_switch_change(false, device)
                  });
                }
                break;
              case "music":
                break;
            }
          }
          api.sendUdpArr(udpArr);
      }
}
export default udpArr;