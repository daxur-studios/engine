type InputAction = () => void;

interface InputMappingContext {
  contextName: string;
  inputBindings: { [key: string]: InputAction };
}

class InputMappingSystem {
  private activeContext: InputMappingContext | null;
  private contextMap: { [key: string]: InputMappingContext };

  constructor() {
    this.activeContext = null;
    this.contextMap = {};
  }

  public createContext(
    contextName: string,
    inputBindings: { [key: string]: InputAction }
  ) {
    const newContext: InputMappingContext = {
      contextName,
      inputBindings,
    };

    this.contextMap[contextName] = newContext;
  }

  public setActiveContext(contextName: string) {
    this.activeContext = this.contextMap[contextName] || null;
  }

  public handleInputEvent(inputEvent: string) {
    if (this.activeContext && this.activeContext.inputBindings[inputEvent]) {
      this.activeContext.inputBindings[inputEvent]();
    }
  }
}
