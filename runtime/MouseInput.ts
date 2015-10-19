
// cofig is typeof MouseInputConfig
// component is the Engine component
export function setupComponent(player: SupRuntime.Player, component: any, config: any) {
  console.log("mouseinput runtime setupComponent", component, config, player);
  component.setCameraActorName(config.cameraActorName);
}
