
// cofig is of type fMouseInputConfigPub
// component is the Engine component (fMouseInput)
export function setupComponent(player: SupRuntime.Player, component: any, config: any) {
  console.log("mouseinput runtime setupComponent", component, config, player);
  component.setCameraActorName(config.cameraActorName);
}
