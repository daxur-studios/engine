interface Info {
  label: string;
  description: string;

  tags?: string[];
}

interface IEngineArchitecture {
  coreValues: Info[];
  coreLibraries: Info[];
  programmingLanguages: Info[];

  components: Info[];
  services: Info[];
  actors: Info[];
}

const engine: IEngineArchitecture = {
  coreValues: [
    {
      label: 'Simplicity',
      description: 'Simple, clean, and easy to use',
    },
    {
      label: 'Extensibility',
      description: 'Easy to extend and customize',
    },
    {
      label: 'X-Platform',
      description: 'Cross-platform, works on PC and mobile',
    },
    {
      label: 'Yours',
      description: 'Open source, well documented, and free to use',
    },
  ],
  coreLibraries: [
    {
      label: 'Angular',
      description: 'web framework',
    },
    {
      label: 'Three.js',
      description: '3D library',
    },
    {
      label: 'Dexie.js',
      description: 'IndexedDB wrapper',
    },
    {
      label: 'Firebase',
      description: 'Backend as a Service',
    },
  ],
  programmingLanguages: [
    {
      label: 'TypeScript',
      description: 'JavaScript superset',
    },
    {
      label: 'HTML',
      description: 'Markup language',
    },
    {
      label: 'CSS',
      description: 'Style sheet language',
    },
    {
      label: 'GLSL',
      description: 'OpenGL Shading Language',
    },
    {
      label: 'JSON',
      description: 'Data format',
    },
  ],

  components: [
    {
      label: 'CanvasComponent',
      description: 'Three.js canvas with responsive resizing',
    },
    {
      label: 'EngineComponent',
      description: 'Engine root component, contains CanvasComponent',
      tags: ['CanvasComponent', 'Angular'],
    },
  ],
  services: [
    {
      label: 'EngineService',
      description: 'New instance for each EngineComponent',
    },
  ],
  actors: [
    {
      label: 'SkyDome',
      description: 'Sky dome with sun and moon',
    },
    {
      label: 'Terrain',
      description: 'Terrain with height map',
    },
    {
      label: 'DefaultCamera',
      description: 'Default Camera with orbit controls and free movement',
    },
    {
      label: 'VirtualGrid',
      description: 'Grid with virtual tiles',
    },
    {
      label: 'Imposter',
      description: 'Imposter with billboard and sprite based on camera angle',
    },
  ],
};
