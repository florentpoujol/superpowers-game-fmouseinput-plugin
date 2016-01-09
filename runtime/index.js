
SupRuntime.registerPlugin("fMouseInput", {
  // component is the Engine component (fMouseInput)
  // config is of type fMouseInputConfigPub
  setupComponent: function setupComponent(player, component, config) {
    component.setCameraActorName(config.cameraActorName);
  }
});
