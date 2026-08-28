/**
 * Brand + real external links for CircuitKid.
 * Everything a non-developer might want to change lives in this file.
 */

/**
 * Files in public/ are NOT rewritten by Next's basePath — <Link> hrefs and
 * _next/* assets are, but a raw public path handed to next/image is emitted
 * verbatim (especially with images.unoptimized). Wrap every public asset in
 * asset() so it keeps working when the site is served from a subpath, e.g.
 * https://user.github.io/circuitkid.
 *
 * Reads the same env var as next.config.mjs, so the two never drift.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const asset = (path: string) => `${BASE_PATH}${path}`;

export const site = {
  name: 'CircuitKid',
  domain: 'circuitkid.com',
  tagline: 'Learn robotics by building robots.',
  description:
    'A video-lesson robotics and electronics course for kids and total beginners. Real Arduino hardware, real projects, zero coding experience required.',
  ages: 'Ages 6–13',
  email: 'nayanrgarg@gmail.com',
  phone: '+17207952998',
  phoneLabel: '(720) 795-2998',
} as const;

export const links = {
  /** Kit purchase / course enrollment form. */
  signUp:
    'https://docs.google.com/forms/d/e/1FAIpQLScB6bZaFrZT_-dNpr-5-8blCHyi-BhBkgRFJ9QCQnk9N-iivA/viewform',
  /** "Ask a Question!" form from the lesson hub. */
  askQuestion:
    'https://docs.google.com/forms/d/e/1FAIpQLScwo_d6slX6Q0vXS-Wl2Ap91KTUDuxqQ8q8kXqUqmfJdRJNXA/viewform',
  /** "Schedule a meeting!" — weekly live help sessions. */
  scheduleMeeting: 'https://forms.gle/3iEGvQevP8wGpQY97',
  arduinoSoftware: 'https://www.arduino.cc/en/software',
  /** Shared code workbook; each lesson links a specific tab via ?gid=. */
  codeWorkbook:
    'https://docs.google.com/spreadsheets/d/1-7jHE1tAl7S2G3s1sex_742mG_TpRC1j8OkLTxLyikM/edit',
  /** Socials — replace with real handles when they exist. */
  youtube: '',
  instagram: '',
  tiktok: '',
} as const;

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/curriculum', label: 'Curriculum' },
  { href: '/kit', label: 'Kit' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

/** Real photos of the kit, pulled from the original kit page. */
export const gallery = [
  {
    src: '/images/kit/kit-lcd-build.jpg',
    alt: "Arduino UNO R4 wired to a breadboard and an LCD showing 'I heart Arduino'",
    caption: 'Your first build ✨',
  },
  {
    src: '/images/kit/kit-lcd-closeup.jpg',
    alt: "Close-up of the LCD1602 display showing 'I heart Arduino'",
    caption: 'It really says hi! 💬',
  },
  {
    src: '/images/kit/kit-contents.jpg',
    alt: 'Sorted cases of sensor modules and a membrane keypad included in the kit',
    caption: 'Everything, organized 🗂️',
  },
  {
    src: '/images/kit/kit-control-modules.jpg',
    alt: 'Relay, joystick, ultrasonic sensor, water sensor and power supply modules',
    caption: 'Joysticks & gadgets 🎮',
  },
  {
    src: '/images/kit/kit-sensors.jpg',
    alt: 'Case of sensor modules including sound, light, temperature and tracking sensors',
    caption: '30+ sensor modules 📡',
  },
  {
    src: '/images/kit/kit-robot-car.jpg',
    alt: '2WD robot car chassis with four wheels, motors and hardware',
    caption: 'Build your own car 🚗',
  },
  {
    src: '/images/kit/kit-wheels-motors.jpg',
    alt: 'Close-up of the robot car wheels and DC gear motors',
    caption: 'Zoom zoom 🛞',
  },
] as const;

/** Full bill of materials, grouped the way the box is organized. */
export const kitContents = [
  {
    emoji: '🧠',
    group: 'Core Controller',
    items: ['1 × Arduino UNO R4 Minima'],
  },
  {
    emoji: '🔌',
    group: 'Prototyping & Basic Electronics',
    items: [
      '1 × Breadboard (830 point)',
      '1 × Jumper wire set',
      '18 × Assorted LEDs',
      '100 × Resistors',
      '1 × Button module (plus extra push buttons)',
      '2 × Buzzer modules (active + passive)',
    ],
  },
  {
    emoji: '🎮',
    group: 'Control Modules',
    items: [
      '1 × Joystick module',
      '1 × Rotary encoder module',
      '1 × Membrane switch module',
      '1 × IR receiver module',
      '1 × IR emission module',
      '1 × Relay module',
    ],
  },
  {
    emoji: '📡',
    group: 'Sensor Modules',
    items: [
      '1 × Ultrasonic sensor module',
      '1 × PIR motion sensor (HC-SR501)',
      '1 × Flame sensor module',
      '1 × Linear hall sensor module',
      '1 × Metal touch sensor module',
      '1 × Digital temperature sensor module',
      '1 × 18B20 temperature sensor module',
      '1 × Photo-resistor (light sensor) module',
      '1 × Temperature & humidity sensor module',
      '1 × GY-521 accelerometer / gyroscope module',
      '1 × Photo-interrupter module',
      '1 × Tap sensor module',
      '1 × Avoidance sensor module',
      '1 × Tracking sensor module',
      '1 × Water level sensor module',
      '1 × Shake sensor module',
      '1 × Tilt switch module',
    ],
  },
  {
    emoji: '🔊',
    group: 'Sound & Light Modules',
    items: [
      '1 × Big sound sensor module',
      '1 × Small sound sensor module',
      '1 × RGB LED module',
      '1 × SMD RGB module',
      '1 × Two-tone color module',
      '1 × 7-color flash module',
    ],
  },
  {
    emoji: '⚙️',
    group: 'Output & Actuation',
    items: [
      '1 × Servo motor',
      '2 × DC motors',
      '2 × H-bridge motor driver modules (L298N)',
    ],
  },
  {
    emoji: '🔥',
    group: 'Special Function Modules',
    items: [
      '1 × Laser emission module',
      '1 × Magnetic spring module',
      '1 × Power supply module',
      '1 × DS1307 real-time clock module',
    ],
  },
  {
    emoji: '📺',
    group: 'Display',
    items: ['1 × LCD1602 module (with pin header)', '1 × OLED display module'],
  },
  {
    emoji: '🚗',
    group: 'Mechanical System',
    items: ['1 × 2WD robot chassis kit (with wheels)'],
  },
] as const;

/** Extra builds students have made with the same kit. */
export const showcase = [
  {
    src: '/images/projects/plant-waterer.png',
    alt: 'Automatic plant waterer project',
    name: 'Automatic Plant Waterer',
    blurb: 'A water sensor plus a relay that keeps a houseplant alive on its own.',
  },
  {
    src: '/images/projects/avoidance-car.png',
    alt: 'Object avoidance car project',
    name: 'Object Avoidance Car',
    blurb: 'The robot chassis plus an ultrasonic sensor, dodging walls by itself.',
  },
  {
    src: '/images/projects/tic-tac-toe.png',
    alt: 'Tic tac toe robotics game project',
    name: 'Tic-Tac-Toe Machine',
    blurb: 'An LED grid, buttons, and an Arduino that plays to win.',
  },
] as const;
