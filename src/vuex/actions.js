const actions = {
  showLeftMenu({ commit }, status) {
    commit("showLeftMenu", status);
  },
  // showGlobalLoading({ commit }, globalLoading) {
  //   commit("showGlobalLoading", globalLoading);
  // },
  showLoading({ commit }, status) {
    commit("showLoading", status);
  },
  showContral({ commit }, status) {
    commit("showContral", status);
  },
  setMenus({ commit }, menus) {
    commit("setMenus", menus);
  },
  setRules({ commit }, rules) {
    commit("setRules", rules);
  },
  setUsers({ commit }, users) {
    commit("setUsers", users);
  },
  setUserGroups({ commit }, userGroups) {
    commit("setUserGroups", userGroups);
  },
  setOrganizes({ commit }, organizes) {
    commit("setOrganizes", organizes);
  },
  setDevice({ commit }, device) {
    commit("setDevice", device);
  },
  setDevices({ commit }, devices) {
    commit("setDevices", devices);
  },
  setAcBreed({ commit }, ac_breed) {
    commit("setAcBreed", ac_breed);
  },
  setLightBreed({ commit }, light_breed) {
    commit("setLightBreed", light_breed);
  },
  setLedBreed({ commit }, led_breed) {
    commit("setLedBreed", led_breed);
  },
  setRecord({ commit }, record) {
    commit("setRecord", record);
  },
  setCurrentRecord({ commit }, currentRecord) {
    commit("setCurrentRecord", currentRecord);
  },
  setCountryArr({ commit }, countryArr) {
    commit("setCountryArr", countryArr);
  },
  setAddress({ commit }, address) {
    commit("setAddress", address);
  },
  setFloor({ commit }, floor) {
    commit("setFloor", floor);
  },
  setRoom({ commit }, room) {
    commit("setRoom", room);
  },
  setWarn({ commit }, warn) {
    commit("setWarn", warn);
  },
  setRecordLoading({ commit }, recordLoading) {
    commit("setRecordLoading", recordLoading);
  },
  setMaxid({ commit }, maxid) {
    commit("setMaxid", maxid);
  },
  setShowHotel({ commit }, showHotel) {
    commit("setShowHotel", showHotel);
  },
  setShowFloor({ commit }, showFloor) {
    commit("setShowFloor", showFloor);
  },
  setShowRoom({ commit }, showRoom) {
    commit("setShowRoom", showRoom);
  },
  setShowRightPage({ commit }, showRightPage) {
    commit("setShowRightPage", showRightPage);
  },
  setUdpDevice({ commit }, udpDevice) {
    commit("setUdpDevice", udpDevice);
  },
  setOriginalDevices({ commit }, originalDevices) {
    commit("setOriginalDevices", originalDevices);
  },
  setalexaToken({ commit }, alexaToken) {
    commit("setalexaToken", alexaToken);
  },
  setPhoneNav({ commit }, phoneNav) {
    commit("setPhoneNav", phoneNav);
  },
};

export default actions;
