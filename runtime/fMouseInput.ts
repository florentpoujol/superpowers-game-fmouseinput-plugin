
// component is the Engine component (fMouseInput)
// config is of type fMouseInputConfigPub
export function setupComponent(player: SupRuntime.Player, component: any, config: any) {
  component.setCameraActorName(config.cameraActorName);
}
