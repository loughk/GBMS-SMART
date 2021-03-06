import api from "../api";
//字符串转数组
function strToarr(str) {
  var len = str.length / 2;
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(str.substr(i * 2, 2));
  }
  return arr;
}
//字符串转4个字符的数组
function strToarr4(str) {
  var len = str.length / 4;
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(str.substr(i * 4, 4));
  }
  return arr;
}
const musicApi = {
  socketio: {},
  albumInterval: "",
  songInterval: "",
  time_change(val, device) {
    // device.autotmp = val;
    // device.loading = true
    // const data = {
    //     params: {
    //         operatorCodefst: "02",
    //         operatorCodesec: "18",
    //         targetDeviceID: device.deviceid,
    //         additionalContentData: ("05,01,03"+ _g.toHex(val)).split(","),
    //         macAddress: device.mac ? device.mac.split(".") : "",
    //         dest_address: device.ip ? device.ip.split(".") : "",
    //         dest_port: device.port ? device.port.split(".") : "",
    //     }
    // }
    // api.apiGet('dmin/udp/sendUdp', data).then((res) => {
    //     // console.log('res = ', _g.j2s(res))
    //     // _g.closeGlobalLoading()
    // })
  },
  get_source_change(val, device) {
    var source = val == '02' ? '03' : val
    var operatorCodefst = "02",
      operatorCodesec = "18",
      additionalContentData = ["01", source]
    var data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
    return data
  },
  //切换音乐
  source_change(val, device) {
    var data = this.get_source_change(val, device)
    api.sendUdp(device, data)
  },
  get_vol_change(val, device) {
    device.loading = true;
    val = parseInt(((100 - val) / 100) * 79);
    var operatorCodefst = "02",
      operatorCodesec = "18",
      additionalContentData = ["05", "01", "03", _g.toHex(val)]
    var data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
    return data
  },
  //改变音量
  vol_change(val, device) {
    var data = this.get_vol_change(val, device)
    api.sendUdp(device, data)
  },
  //上一首
  pre(device) {
    var operatorCodefst = "02",
      operatorCodesec = "18",
      additionalContentData = ["04", "01", "00", "00"]
    var data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
    api.sendUdp(device, data)
  },
  //下一首
  next(device) {
    var operatorCodefst = "02",
      operatorCodesec = "18",
      additionalContentData = ["04", "02", "00", "00"]
    var data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
    api.sendUdp(device, data)
  },
  //开关
  switch_change(val, device) {
    device.on_off = val;
    var data = {}
    switch (val) {
      case true:
        var operatorCodefst = "02",
          operatorCodesec = "18",
          additionalContentData = ["04", "03", "00", "00"]
        var data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
        break
      case false:
        var operatorCodefst = "02",
          operatorCodesec = "18",
          additionalContentData = ["04", "04", "00", "00"]
        var data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
        break
    }
    api.sendUdp(device, data)
  },
  get_play(device) {
    device.on_off = true;
    var operatorCodefst = "02",
      operatorCodesec = "18",
      additionalContentData = ["04", "03", "00", "00"]
    var data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
    return data
  },
  //播放
  play(device) {
    var data = this.get_play(device)
    api.sendUdp(device, data)
  },
  get_pause(device) {
    device.on_off = false;
    var operatorCodefst = "02",
      operatorCodesec = "18",
      additionalContentData = ["04", "04", "00", "00"]
    var data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
    return data
  },
  //暂停
  pause(device) {
    var data = this.get_pause(device)
    api.sendUdp(device, data)
  },
  //模式切换
  modeChange(device) {
    var operatorCodefst,
      operatorCodesec,
      additionalContentData,
      data
    if (device.deviceProperty.mode == '4') {
      operatorCodefst = "19"
      operatorCodesec = "2e"
      additionalContentData = ["2a", "53", "31", "4d", "4f", "44", "45", "2d", "0d"]
      data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
      api.sendUdp(device, data)
      api.sendUdp(device, data)
      api.sendUdp(device, data)
    } else {
      operatorCodefst = "19"
      operatorCodesec = "2e"
      additionalContentData = ["2a", "53", "31", "4d", "4f", "44", "45", "2b", "0d"]
      data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
      api.sendUdp(device, data)
    }
  },
  //随机模式
  random(device) {
    var operatorCodefst = "02",
      operatorCodesec = "18",
      additionalContentData = ["02", "01", "00", "00"]
    var data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
    api.sendUdp(device, data)
  },
  //单曲模式
  single(device) {
    var operatorCodefst = "02",
      operatorCodesec = "18",
      additionalContentData = ["02", "02", "00", "00"]
    var data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
    api.sendUdp(device, data)
  },
  //列表循环模式
  allmusic(device) {
    var operatorCodefst = "02",
      operatorCodesec = "18",
      additionalContentData = ["02", "04", "00", "00"]
    var data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
    api.sendUdp(device, data)
  },
  get_selectSong(device, song) {
    var operatorCodefst = "02",
      operatorCodesec = "18",
      additionalContentData = ["06", song.albumNo, song.songNoHigh, song.songNoLow]
    var data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
    return data
  },
  //选中音乐
  selectSong(device, song) {
    var data = this.get_selectSong(device, song)
    api.sendUdp(device, data)
  },
  //停止循环
  closeSocket() {
    if (this.albumInterval)
      clearInterval(this.albumInterval)
    if (this.songInterval)
      clearInterval(this.songInterval)
  },
  //读取歌曲信息
  readSong(device) {
    console.log('music_api')
    var operatorCodefst = "02",
      operatorCodesec = "E0",
      additionalContentData = [device.deviceProperty.source]
    var data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
    api.sendUdp(device, data)
  },
  //读取音乐状态
  readStatus(device) {
    var operatorCodefst = "19",
      operatorCodesec = "2e",
      additionalContentData = ['2a', '5a', '01', '53', '54', '41', '54', '55', '53', '3F', '0D']
    var data = api.getUdp(device, operatorCodefst, operatorCodesec, additionalContentData)
    api.sendUdp(device, data)

    var modeOperatorCodefst = "19",
      modeOperatorCodesec = "2e",
      modeAdditionalContentData = ['2a', '53', '01', '50', '4c', '41', '59', '4d', '4f', '44', '45', '3f', '0d']
    var modeData = api.getUdp(device, modeOperatorCodefst, modeOperatorCodesec, modeAdditionalContentData)
    api.sendUdp(device, modeData)
  },
  //解析歌曲
  receiveSong(device, data) {

    var $this = this,
      operationcode = _g.getoperationcode(data),
      dataLength = data.length,
      stop = dataLength - 4;
    switch (operationcode) {
      //解析专辑包
      case "02e1":
        var source = _g.getadditional(data, 0);
        if (parseInt(device.deviceProperty.source) != parseInt(source)) {
          return;
        }
        var albumpack = data.substring(52, stop);
        var additionalData = strToarr(albumpack);
        additionalData.unshift(source);
        //获取专辑包信息
        var operatorCodefst = "02",
          operatorCodesec = "E2";
        var data = api.getUdp(
          device,
          operatorCodefst,
          operatorCodesec,
          additionalData
        );
        api.sendUdp(device, data);
        break;
      //解析专辑列表
      case "02e3":
        var source = _g.getadditional(data, 2);
        if (parseInt(device.deviceProperty.source) == parseInt(source)) {
          var albumCount = 0;
          var albumNum = _g.getadditional(data, 4);
          var albumListStr = data.substring(60);
          device.deviceProperty.albumList = [];
          device.deviceProperty.songList = [];
          device.deviceProperty.songListAll = [];
          var albumList = [];
          var songList = [];
          //循环专辑列表，获取专辑信息
          for (var i = 0; i < albumNum; i++) {
            var albumNo = albumListStr.substr(albumCount, 2);
            var albumLength = albumListStr.substr(albumCount + 2, 2);
            albumLength = parseInt("0x" + albumLength) * 2;
            var albumNameList = albumListStr.substr(
              albumCount + 4,
              albumLength
            );
            albumNameList = strToarr4(albumNameList);
            var albumName = [];
            for (var item of albumNameList) {
              albumName.push(String.fromCharCode("0x" + item));
            }
            albumName = albumName.join("");
            var albumObj = {
              albumName: albumName,
              albumNo: albumNo
            };
            //生成列表记录要发送的专辑
            albumList.push(albumObj);
            device.deviceProperty.albumCheckList[albumNo] = false;
            albumCount = albumCount + albumLength + 4;
          }
          var udpArrAlbum = [],
            udpArrSong = [],
            albumUdpNum = 1,
            songUdpNum = 1
          //循环发送读取专辑信息
          for (var key in device.deviceProperty.albumCheckList) {
            var operatorCodefst = "02",
              operatorCodesec = "E4",
              additionalContentData = [source, key];
            var data = api.getUdp(
              device,
              operatorCodefst,
              operatorCodesec,
              additionalContentData
            );
            var udpObj = {
              device: device,
              data: data,
              key: "album"
            };
            udpArrAlbum.push(udpObj);
          }
          $this.sendUdpArr(udpArrAlbum);
          $this.albumInterval = setInterval(function () {
            //判断专辑列表是否都已经返回数据，没返回则继续发送
            console.log(albumUdpNum)
            var check = true,
              udpArrAlbum = []


            // console.log(device.deviceProperty.albumCheckList)
            for (var key in device.deviceProperty.albumCheckList) {
              if (!device.deviceProperty.albumCheckList[key]) {
                check = false;
              }
            }
            if (check || albumUdpNum >= 3) {
              clearInterval($this.albumInterval);
              if (check == false && albumUdpNum >= 3) {
                _g.toastMsg("warning", 'The album failed to load, please make sure the device is online');
                return
              }
              albumList.sort(function (a, b) {
                // return a.songNo - b.songNo
                return parseInt(a.albumNo) - parseInt(b.albumNo);
              });
              device.deviceProperty.albumList = albumList;
              $this.sendUdpArr(udpArrSong);
              $this.songInterval = setInterval(function () {
                console.log(songUdpNum)
                var check = true,
                  udpArrSong = [];


                // console.log(device.deviceProperty.songCheckList)
                for (var key in device.deviceProperty.songCheckList) {
                  if (!device.deviceProperty.songCheckList[key]) {
                    check = false;
                  }
                }
                //判断歌曲列表，是否全部返回数据，没返回则继续发送
                if (check || songUdpNum >= 5) {
                  clearInterval($this.songInterval);
                  if (check == false && songUdpNum >= 5) {
                    _g.toastMsg("warning", 'Song failed to load, please make sure the device is online');
                    return
                  }
                  // var hash = {};
                  // songList = songList.reduce(function (item, next) {
                  //   hash[next.songNo] ? '' : hash[next.songNo] = true && item.push(next);
                  //   return item
                  // }, [])
                  // songList.sort(function (a, b) {
                  //   // return a.songNo - b.songNo
                  //   return parseInt(a.albumNo + a.No) - parseInt(b.albumNo + b.No)
                  // });
                  // device.deviceProperty.songList = songList;
                  // device.deviceProperty.songListAll = songList;

                  //关闭模态框，保存进缓存
                  device.deviceProperty.musicLoading = false;
                  Lockr.set(
                    "music_" +
                    device.subnetid + device.deviceid +
                    "_" +
                    device.deviceProperty.source,
                    device.deviceProperty
                  );
                } else {
                  songUdpNum++
                  for (var key in device.deviceProperty.songCheckList) {
                    if (!device.deviceProperty.songCheckList[key]) {
                      var operatorCodefst = "02",
                        operatorCodesec = "E6",
                        additionalContentData = [
                          source,
                          key.substr(0, 2),
                          key.substr(2, 2)
                        ];
                      var data = api.getUdp(
                        device,
                        operatorCodefst,
                        operatorCodesec,
                        additionalContentData
                      );
                      // api.sendUdp(device, data)
                      var udpObj = {
                        device: device,
                        data: data,
                        key: "song"
                      };
                      udpArrSong.push(udpObj);
                    }
                  }

                  $this.sendUdpArr(udpArrSong);
                }
              }, 3000);
            } else {
              albumUdpNum++
              for (var key in device.deviceProperty.albumCheckList) {
                if (!device.deviceProperty.albumCheckList[key]) {
                  var operatorCodefst = "02",
                    operatorCodesec = "E4",
                    additionalContentData = [source, key];
                  var data = api.getUdp(
                    device,
                    operatorCodefst,
                    operatorCodesec,
                    additionalContentData
                  );
                  var udpObj = {
                    device: device,
                    data: data,
                    key: "album"
                  };
                  udpArrAlbum.push(udpObj);
                }
              }
              $this.sendUdpArr(udpArrAlbum);
            }
          }, 2000);
        }
        break;
        //解析专辑包信息，并确认该专辑包已经返回
      case "02e5":
        var source = _g.getadditional(data, 0);
        if (parseInt(device.deviceProperty.source) == parseInt(source)) {
          var albumno = _g.getadditional(data, 1);
          var songpack = data.substring(54, 56);
          if (!device.deviceProperty.albumCheckList[albumno]) {
            device.deviceProperty.albumCheckList[albumno] = true;

            songpack = parseInt("0x" + songpack);
            var udpArrSong = []
            for (var i = 1; i <= songpack; i++) {
              device.deviceProperty.songCheckList[albumno + _g.toHex(i)] = false;
              var operatorCodefst = "02",
                operatorCodesec = "E6",
                additionalContentData = [
                  source,
                  albumno,
                  _g.toHex(i)
                ];
              var data = api.getUdp(
                device,
                operatorCodefst,
                operatorCodesec,
                additionalContentData
              );
              // api.sendUdp(device, data)
              var udpObj = {
                device: device,
                data: data,
                key: "song"
              };
              udpArrSong.push(udpObj);
            }
          }
        }
        break;
        //解析歌曲包信息，并确认该歌曲包已经返回
      case "02e7":
        var source = _g.getadditional(data, 2);
        if (parseInt(device.deviceProperty.source) == parseInt(source)) {
          var songNum = _g.getadditional(data, 5);
          songNum = parseInt("0x" + songNum);
          var songCount = 0;
          var songForNum = 0;
          var currentSonglist = data.substring(62);
          var albumno = _g.getadditional(data, 3);
          var packNo = _g.getadditional(data, 4);
          if (!device.deviceProperty.songCheckList[albumno + packNo]) {
            device.deviceProperty.songCheckList[albumno + packNo] = true;
            for (var i = 0; i < songNum; i++) {
              var songLength = currentSonglist.substr(
                songCount + 4,
                2
              );
              songLength = parseInt("0x" + songLength) * 2;
              var songName = currentSonglist.substr(
                songCount + 6,
                songLength
              );
              songName = strToarr4(songName);
              var songNameList = [];
              for (var item of songName) {
                songNameList.push(String.fromCharCode("0x" + item));
              }
              songName = songNameList.join("");
              var songObj = {};
              songObj.albumNo = albumno;
              songObj.No = parseInt(
                "0x" + currentSonglist.substr(songCount, 4)
              );
              songObj.songNo =
                songObj.albumNo +
                currentSonglist.substr(songCount, 4);
              songObj.songNoHigh = currentSonglist.substr(
                songCount,
                2
              );
              songObj.songNoLow = currentSonglist.substr(
                songCount + 2,
                2
              );
              songObj.songName = songName;
              songObj.select = false;
              device.deviceProperty.songList.push(songObj);
              device.deviceProperty.songListAll.push(songObj);
              songCount = songCount + songLength + 6;
            }
          }
        }
        break;
    }
  },
  //解析状态
  receiveStatus(device, data) {
    var additionalList = _g.getAdditionalList(data);
    if (
      additionalList[11] == "2c" &&
      additionalList[12] == "56" &&
      additionalList[13] == "4f" &&
      additionalList[14] == "4c"
    ) {
      //读音量
      if (additionalList[17] == "0d") {
        device.deviceProperty.vol = parseInt(
          (79 -
            ((parseInt("0x" + additionalList[15]) - 48) * 10 +
              parseInt("0x" + additionalList[16]) -
              48)) /
          79 *
          100
        );
      } else {
        device.deviceProperty.vol = parseInt(
          (79 - (parseInt("0x" + additionalList[15]) - 48)) / 79 * 100
        );
      }
      var source = String.fromCharCode("0x" + additionalList[10]);
      device.deviceProperty.source = '0' + source;
    } else if (
      additionalList[7] == "4d" &&
      additionalList[8] == "4f" &&
      additionalList[9] == "44" &&
      additionalList[10] == "45"
    ) {
      //读模式
      var mode = String.fromCharCode("0x" + additionalList[18]);
      device.deviceProperty.mode = mode;
    } else if (
      additionalList[11] == "2c" &&
      additionalList[12] == "44" &&
      additionalList[13] == "55" &&
      additionalList[14] == "52"
    ) {
      //读播放状态
      var additionalLength = additionalList.length;
      var str = additionalList[additionalLength - 4];
      device.deviceProperty.on_off = str == "32" ? true : false;
      var additionalStr = "";
      for (var additional of additionalList) {
        additionalStr += String.fromCharCode("0x" + additional);
      }
      var totalTime = "",
        nowTime = "",
        totalTimeIndex = additionalStr.indexOf(",POS"),
        nowTimeIndex = additionalStr.indexOf(",STATUS");
      totalTime = _g.sec_to_time(
        parseInt(additionalStr.substring(15, totalTimeIndex)) / 10
      );
      nowTime = _g.sec_to_time(
        parseInt(
          additionalStr.substring(totalTimeIndex + 4, nowTimeIndex)
        ) / 10
      );
      device.deviceProperty.totalTime = totalTime;
      device.deviceProperty.nowTime = nowTime;
    } else if (
      additionalList[3] == "44" &&
      additionalList[8] == "49" &&
      additionalList[9] == "4e" &&
      additionalList[10] == "45" &&
      additionalList[11] == "31"
    ) {
      //读播放专辑号
      var additionalLength = additionalList.length;
      var str = "";
      for (var i = 14; i <= additionalLength - 6; i += 2) {
        str =
          str +
          String.fromCharCode(
            "0x" + additionalList[i] + additionalList[i + 1]
          );
      }
      device.deviceProperty.list = str;
    } else if (
      additionalList[3] == "44" &&
      additionalList[8] == "49" &&
      additionalList[9] == "4e" &&
      additionalList[10] == "45" &&
      additionalList[11] == "32"
    ) {
      //读播放专辑名
      var additionalLength = additionalList.length;
      var str = "";
      for (var i = 14; i <= additionalLength - 6; i += 2) {
        str =
          str +
          String.fromCharCode(
            "0x" + additionalList[i] + additionalList[i + 1]
          );
      }
      device.deviceProperty.albumNow = str;
    } else if (
      additionalList[3] == "44" &&
      additionalList[8] == "49" &&
      additionalList[9] == "4e" &&
      additionalList[10] == "45" &&
      additionalList[11] == "33"
    ) {
      //读播放歌曲号
      var additionalLength = additionalList.length;
      var str = "";
      for (var i = 14; i <= additionalLength - 6; i += 2) {
        str =
          str +
          String.fromCharCode(
            "0x" + additionalList[i] + additionalList[i + 1]
          );
      }
      device.deviceProperty.track = str;
    } else if (
      additionalList[3] == "44" &&
      additionalList[8] == "49" &&
      additionalList[9] == "4e" &&
      additionalList[10] == "45" &&
      additionalList[11] == "34"
    ) {
      //读播放歌曲名
      var additionalLength = additionalList.length;
      var str = "";
      for (var i = 14; i <= additionalLength - 6; i += 2) {
        str =
          str +
          String.fromCharCode(
            "0x" + additionalList[i] + additionalList[i + 1]
          );
      }
      device.deviceProperty.songNow = str;
    }
  },
  sendUdpArr(arr, type) {
    if (!arr || arr.length == 0) return
    var $this = this
    var arrIndex = 0
    var sendUdp = function (device, data) {
      if (!type || type == "") {
        api.apiPost("admin/udp/sendUdp", data).then(res => {
        });
        var sendUdpFor = setInterval(function () {
          clearInterval(sendUdpFor);
          arrIndex++
          if (arr[arrIndex]) {
            if (arr[arrIndex].device.time && parseInt(arr[arrIndex].device.time) > 0) {
              var time = parseInt(arr[arrIndex].device.time) * 1000
              var timeCode = function () {
                sendUdp(arr[arrIndex].device, arr[arrIndex].data)
              }
              setTimeout(timeCode, time)
            } else {
              sendUdp(arr[arrIndex].device, arr[arrIndex].data)
            }
          }
          return;
          api.apiPost("admin/udp/sendUdp", data).then(res => {
          });
        }, 100);
      } else {
        var pass = false
        var index = 1
        var operatorCode = data.operatorCodefst + data.operatorCodesec
        operatorCode = _g.toHex(parseInt('0x' + operatorCode) + 1)
        if (operatorCode.length < 4) {
          var zero = ""
          for (var i = 0; i < 4 - operatorCode.length; i++) {
            zero = zero + '0'
          }
          operatorCode = zero + operatorCode
        }
        // window.socketio.on("music", function (data) {
        //   var subnetid = data.substr(34, 2);
        //   var deviceid = data.substr(36, 2);
        //   if (
        //     subnetid.toLowerCase() != device.subnetid.toLowerCase() ||
        //     deviceid.toLowerCase() != device.deviceid.toLowerCase()
        //   ) return
        //   var operatorCodeCurrent = data.substr(42, 4)
        //   if (operatorCodeCurrent != operatorCode) return
        //   if (operatorCodeCurrent.toLowerCase() == "02e5") {
        //     var source = _g.getadditional(data, 0)
        //     var albumNo = _g.getadditional(data, 1)
        //     if (data.additionalContentData[0] != source || data.additionalContentData[1] != albumNo) return
        //   } else if (operatorCodeCurrent.toLowerCase() == "02e7") {
        //     var source = _g.getadditional(data, 2)
        //     var albumNo = _g.getadditional(data, 3)
        //     var songNo = _g.getadditional(data, 4)
        //     if (data.additionalContentData[0] != source || data.additionalContentData[1] != albumNo || data.additionalContentData[2] != songNo) return
        //   }

        //   pass = true
        // })

        var sendUdpFor = setInterval(function () {
          if (pass || index > 3) {
            clearInterval(sendUdpFor);
            arrIndex++
            if (arr[arrIndex]) {
              if (arr[arrIndex].device.time && parseInt(arr[arrIndex].device.time) > 0) {
                var time = parseInt(arr[arrIndex].device.time) * 1000
                var timeCode = function () {
                  sendUdp(arr[arrIndex].device, arr[arrIndex].data)
                }
                setTimeout(timeCode, time)
              } else {
                sendUdp(arr[arrIndex].device, arr[arrIndex].data)
              }
            }
            return;
          }
          api.apiPost("admin/udp/sendUdp", data).then(res => {
          });
          index++
        }, 100);
      }


    }
    if (arr[arrIndex].device.time && parseInt(arr[arrIndex].device.time) > 0) {
      var time = parseInt(arr[arrIndex].device.time) * 1000
      var timeCode = function () {
        sendUdp(arr[arrIndex].device, arr[arrIndex].data)
      }
      setTimeout(timeCode, time)
    } else {
      sendUdp(arr[arrIndex].device, arr[arrIndex].data)
    }

  },
};

export default musicApi;
