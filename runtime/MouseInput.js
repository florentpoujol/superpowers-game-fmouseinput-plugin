// cofig is typeof MouseInputConfig
// component is the Engine component
function setupComponent(player, component, config) {
    console.log("mouseinput runtime setupComponent", component, config, player);
    component.setCameraActorName(config.cameraActorName);
}
exports.setupComponent = setupComponent;
