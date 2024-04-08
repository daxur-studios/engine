// https://github.com/devstronomy/nasa-data-scraper/tree/master/data/json

/**
 * Mass (1024kg)
 *
 * Diameter (km)
 *
 * Density (kg/m3)
 *
 * Gravity (m/s2)
 *
 * Escape Velocity (km/s)
 *
 * Rotation Period (hours)
 *
 * Length of Day (hours)
 *
 * Distance from Sun (106 km)
 *
 * Perihelion (106 km)
 *
 * Aphelion (106 km)
 *
 * Orbital Period (days)
 *
 * Orbital Velocity (km/s)
 *
 * Orbital Inclination (degrees)
 *
 * Orbital Eccentricity
 *
 * Obliquity to Orbit (degrees)
 *
 * Mean Temperature (C)
 *
 * Surface Pressure (bars)
 *
 * Number of Moons (number)
 *
 * Ring System? (Yes/No)
 *
 * Global Magnetic Field? (Yes/No)
 *
 */
export interface Planet {
  id: number;
  name: string;
  mass: number;
  diameter: number;
  density: number;
  gravity: number;
  escapeVelocity: number;
  rotationPeriod: number;
  lengthOfDay: number;
  distanceFromSun: number;
  perihelion: number;
  aphelion: number;
  orbitalPeriod: number;
  orbitalVelocity: number;
  orbitalInclination: number;
  orbitalEccentricity: number;
  obliquityToOrbit: number;
  meanTemperature: number;
  surfacePressure: number | null;
  numberOfMoons: number;
  hasRingSystem: boolean;
  hasGlobalMagneticField: boolean;
}

export const planets: Planet[] = [
  {
    id: 1,
    name: 'Mercury',
    mass: 0.33,
    diameter: 4879.0,
    density: 5427.0,
    gravity: 3.7,
    escapeVelocity: 4.3,
    rotationPeriod: 1407.6,
    lengthOfDay: 4222.6,
    distanceFromSun: 57.9,
    perihelion: 46.0,
    aphelion: 69.8,
    orbitalPeriod: 88.0,
    orbitalVelocity: 47.4,
    orbitalInclination: 7.0,
    orbitalEccentricity: 0.205,
    obliquityToOrbit: 0.034,
    meanTemperature: 167.0,
    surfacePressure: 0.0,
    numberOfMoons: 0,
    hasRingSystem: false,
    hasGlobalMagneticField: false,
  },
  {
    id: 2,
    name: 'Venus',
    mass: 4.87,
    diameter: 12104.0,
    density: 5243.0,
    gravity: 8.9,
    escapeVelocity: 10.4,
    rotationPeriod: -5832.5,
    lengthOfDay: 2802.0,
    distanceFromSun: 108.2,
    perihelion: 107.5,
    aphelion: 108.9,
    orbitalPeriod: 224.7,
    orbitalVelocity: 35.0,
    orbitalInclination: 3.4,
    orbitalEccentricity: 0.007,
    obliquityToOrbit: 177.4,
    meanTemperature: 464.0,
    surfacePressure: 92.0,
    numberOfMoons: 0,
    hasRingSystem: false,
    hasGlobalMagneticField: false,
  },
  {
    id: 3,
    name: 'Earth',
    mass: 5.97,
    diameter: 12756.0,
    density: 5514.0,
    gravity: 9.8,
    escapeVelocity: 11.2,
    rotationPeriod: 23.9,
    lengthOfDay: 24.0,
    distanceFromSun: 149.6,
    perihelion: 147.1,
    aphelion: 152.1,
    orbitalPeriod: 365.2,
    orbitalVelocity: 29.8,
    orbitalInclination: 0.0,
    orbitalEccentricity: 0.017,
    obliquityToOrbit: 23.4,
    meanTemperature: 15.0,
    surfacePressure: 1.0,
    numberOfMoons: 1,
    hasRingSystem: false,
    hasGlobalMagneticField: false,
  },
  {
    id: 4,
    name: 'Mars',
    mass: 0.642,
    diameter: 6792.0,
    density: 3933.0,
    gravity: 3.7,
    escapeVelocity: 5.0,
    rotationPeriod: 24.6,
    lengthOfDay: 24.7,
    distanceFromSun: 227.9,
    perihelion: 206.6,
    aphelion: 249.2,
    orbitalPeriod: 687.0,
    orbitalVelocity: 24.1,
    orbitalInclination: 1.9,
    orbitalEccentricity: 0.094,
    obliquityToOrbit: 25.2,
    meanTemperature: -65.0,
    surfacePressure: 0.01,
    numberOfMoons: 2,
    hasRingSystem: false,
    hasGlobalMagneticField: false,
  },
  {
    id: 5,
    name: 'Jupiter',
    mass: 1898.0,
    diameter: 142984.0,
    density: 1326.0,
    gravity: 23.1,
    escapeVelocity: 59.5,
    rotationPeriod: 9.9,
    lengthOfDay: 9.9,
    distanceFromSun: 778.6,
    perihelion: 740.5,
    aphelion: 816.6,
    orbitalPeriod: 4331.0,
    orbitalVelocity: 13.1,
    orbitalInclination: 1.3,
    orbitalEccentricity: 0.049,
    obliquityToOrbit: 3.1,
    meanTemperature: -110.0,
    surfacePressure: null,
    numberOfMoons: 79,
    hasRingSystem: false,
    hasGlobalMagneticField: false,
  },
  {
    id: 6,
    name: 'Saturn',
    mass: 568.0,
    diameter: 120536.0,
    density: 687.0,
    gravity: 9.0,
    escapeVelocity: 35.5,
    rotationPeriod: 10.7,
    lengthOfDay: 10.7,
    distanceFromSun: 1433.5,
    perihelion: 1352.6,
    aphelion: 1514.5,
    orbitalPeriod: 10747.0,
    orbitalVelocity: 9.7,
    orbitalInclination: 2.5,
    orbitalEccentricity: 0.057,
    obliquityToOrbit: 26.7,
    meanTemperature: -140.0,
    surfacePressure: null,
    numberOfMoons: 62,
    hasRingSystem: false,
    hasGlobalMagneticField: false,
  },
  {
    id: 7,
    name: 'Uranus',
    mass: 86.8,
    diameter: 51118.0,
    density: 1271.0,
    gravity: 8.7,
    escapeVelocity: 21.3,
    rotationPeriod: -17.2,
    lengthOfDay: 17.2,
    distanceFromSun: 2872.5,
    perihelion: 2741.3,
    aphelion: 3003.6,
    orbitalPeriod: 30589.0,
    orbitalVelocity: 6.8,
    orbitalInclination: 0.8,
    orbitalEccentricity: 0.046,
    obliquityToOrbit: 97.8,
    meanTemperature: -195.0,
    surfacePressure: null,
    numberOfMoons: 27,
    hasRingSystem: false,
    hasGlobalMagneticField: false,
  },
  {
    id: 8,
    name: 'Neptune',
    mass: 102.0,
    diameter: 49528.0,
    density: 1638.0,
    gravity: 11.0,
    escapeVelocity: 23.5,
    rotationPeriod: 16.1,
    lengthOfDay: 16.1,
    distanceFromSun: 4495.1,
    perihelion: 4444.5,
    aphelion: 4545.7,
    orbitalPeriod: 59800.0,
    orbitalVelocity: 5.4,
    orbitalInclination: 1.8,
    orbitalEccentricity: 0.011,
    obliquityToOrbit: 28.3,
    meanTemperature: -200.0,
    surfacePressure: null,
    numberOfMoons: 14,
    hasRingSystem: false,
    hasGlobalMagneticField: false,
  },
  {
    id: 9,
    name: 'Pluto',
    mass: 0.0146,
    diameter: 2370.0,
    density: 2095.0,
    gravity: 0.7,
    escapeVelocity: 1.3,
    rotationPeriod: -153.3,
    lengthOfDay: 153.3,
    distanceFromSun: 5906.4,
    perihelion: 4436.8,
    aphelion: 7375.9,
    orbitalPeriod: 90560.0,
    orbitalVelocity: 4.7,
    orbitalInclination: 17.2,
    orbitalEccentricity: 0.244,
    obliquityToOrbit: 122.5,
    meanTemperature: -225.0,
    surfacePressure: 1.0e-5,
    numberOfMoons: 5,
    hasRingSystem: false,
    hasGlobalMagneticField: false,
  },
];
