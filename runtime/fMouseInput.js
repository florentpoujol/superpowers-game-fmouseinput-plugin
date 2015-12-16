// cofig is of type fMouseInputConfigPub
// component is the Engine component (fMouseInput)
function setupComponent(player, component, config) {
    console.log("mouseinput runtime setupComponent", component, config, player);
    component.setCameraActorName(config.cameraActorName);
}
exports.setupComponent = setupComponent;
