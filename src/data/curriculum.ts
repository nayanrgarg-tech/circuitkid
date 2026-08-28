import type { Lesson, Unit, Capstone } from '@/lib/types';
import { links } from './site';

/* ------------------------------------------------------------------ *
 *  This file is the whole course. Everything else reads from it.
 *
 *  ADDING A VIDEO
 *    Set a lesson's `video` to  https://www.youtube.com/embed/VIDEO_ID
 *    An empty string shows the "not filmed yet" card instead.
 *
 *  ADDING SLIDES / CODE / WIRING
 *    Push onto `resources`:
 *      { kind: 'code', label: 'Code', url: <normal link>, embed: <embed link> }
 *    `embed` is what gets shown inline on the lesson page. For Google Slides
 *    that is  /embed?start=false&loop=false&rm=minimal ; for a Google Doc it
 *    is  /preview . Leave `embed` null to render a plain link instead.
 *
 *  Anything with an embed has to be shared "anyone with the link can view",
 *  otherwise students just see a Google sign-in box.
 * ------------------------------------------------------------------ */

const unit0: RawLesson[] = [
  {
    slug: "0-1a-getting-to-know-your-kit",
    id: "0.1a",
    title: "Getting to Know Your Kit",
    blurb: "Open the box. Meet everything inside. None of it bites.",
    video: "https://www.youtube.com/embed/7icSu_tZg_c",
    materials: ["Your kit, still sealed", "A table you're allowed to make a mess on"],
    learn: ["What every part is called", "Which case each thing lives in", "How to pack it away so nothing goes missing"],
    resources: [],
  },
  {
    slug: "0-1b-getting-to-know-your-kit-part-2",
    id: "0.1b",
    title: "Getting to Know Your Kit, Part 2",
    blurb: "A quick look at the fiddly modules. The ones with extra pins and tiny writing on them.",
    video: "https://www.youtube.com/embed/TRVIFPdAhPE",
    materials: ["Your kit"],
    learn: ["Reading the label printed on a module", "Which parts to be gentle with"],
    resources: [],
  },
  {
    slug: "0-2-how-to-navigate-the-lessons",
    id: "0.2",
    title: "How to Navigate the Lessons",
    blurb: "How this works: watch, wire, run. Plus where the code lives and how to yell for help.",
    video: "https://www.youtube.com/embed/jbIeDJmIDos",
    materials: ["A computer or tablet"],
    learn: ["The watch, wire, run loop", "Where to find the code for any lesson", "How to get unstuck fast"],
    resources: [],
  },
  {
    slug: "0-3-downloading-the-arduino-software",
    id: "0.3",
    title: "Downloading the Arduino Software",
    blurb: "Get the free Arduino app onto your computer and plug the board in for the first time.",
    video: "https://www.youtube.com/embed/0yoyJhstrAs",
    materials: ["A Windows or Mac computer", "Arduino UNO R4 Minima", "USB cable"],
    learn: ["Installing the Arduino IDE", "Picking the right board and port", "What to do when the port doesn't show up"],
    resources: [],
  },
];

const unit1: RawLesson[] = [
  {
    slug: "1-1-what-is-a-computer",
    id: "1.1",
    title: "What is a Computer?",
    blurb: "Every computer does three things. Yours does them too, it just doesn't have a screen to brag about it.",
    video: "https://www.youtube.com/embed/5Rz174eP7Ao",
    materials: ["Arduino UNO R4 Minima"],
    learn: ["Input, thinking, output", "Why the Arduino counts as a real computer"],
    resources: [
      { kind: "slides", label: "Slides", url: "https://docs.google.com/presentation/d/1ZRGyYepPGACi7m-hVL-E45sG4gPnvHU_ELMjFrIX33c/edit?slide=id.p#slide=id.p", embed: "https://docs.google.com/presentation/d/1ZRGyYepPGACi7m-hVL-E45sG4gPnvHU_ELMjFrIX33c/embed?start=false&loop=false&rm=minimal&slide=id.p" },
    ],
  },
  {
    slug: "1-2-circuits-and-electricity",
    id: "1.2",
    title: "Circuits and Electricity",
    blurb: "Electricity is lazy. It only moves if you give it a loop to run around.",
    video: "https://www.youtube.com/embed/QNoPJS2bMvk",
    materials: ["Arduino UNO R4", "Jumper wires"],
    learn: ["What a closed circuit is", "Voltage and current, without the maths", "What a short circuit is and how not to make one"],
    resources: [
      { kind: "slides", label: "Slides", url: "https://docs.google.com/presentation/d/1jUE7wrL4sEy4uB3NHqPBmyJ7_YKpZb8dgdlCTTPQNs0/edit?slide=id.p#slide=id.p", embed: "https://docs.google.com/presentation/d/1jUE7wrL4sEy4uB3NHqPBmyJ7_YKpZb8dgdlCTTPQNs0/embed?start=false&loop=false&rm=minimal&slide=id.p" },
    ],
  },
  {
    slug: "1-3-the-breadboard",
    id: "1.3",
    title: "The Breadboard",
    blurb: "There is a secret map of connections hiding inside your breadboard. Here it is.",
    video: "https://www.youtube.com/embed/ZtAAsLaEO34",
    materials: ["830-point breadboard", "Jumper wires"],
    learn: ["Which holes are secretly joined up", "Building circuits with zero soldering"],
    resources: [],
  },
  {
    slug: "1-4-led",
    id: "1.4",
    title: "LED",
    blurb: "Light your first LED. Long leg, short leg, and why backwards gets you nothing.",
    video: "https://www.youtube.com/embed/Uzq_34kxbDY",
    materials: ["Breadboard", "LED", "220 ohm resistor", "Jumper wires"],
    learn: ["Which LED leg is which", "Wiring an LED without killing it"],
    resources: [
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/1Hjhp3ZCOWUS-4CjSLekWM85VEodgdR42VCgt1Btg7og/edit?slide=id.g3e70a9281e4_0_53#slide=id.g3e70a9281e4_0_53", embed: "https://docs.google.com/presentation/d/1Hjhp3ZCOWUS-4CjSLekWM85VEodgdR42VCgt1Btg7og/embed?start=false&loop=false&rm=minimal&slide=id.g3e70a9281e4_0_53" },
    ],
  },
  {
    slug: "1-5-resistors",
    id: "1.5",
    title: "Resistors",
    blurb: "Every LED needs a bodyguard. Meet the resistor, and learn to read its stripes.",
    video: "https://www.youtube.com/embed/AIZsa-e3DtI",
    materials: ["Breadboard", "Assorted resistors", "LED"],
    learn: ["What resistance actually does", "Reading the colour bands", "Why a missing resistor ends badly"],
    resources: [
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/1Hjhp3ZCOWUS-4CjSLekWM85VEodgdR42VCgt1Btg7og/edit?slide=id.g3e70a9281e4_0_59#slide=id.g3e70a9281e4_0_59", embed: "https://docs.google.com/presentation/d/1Hjhp3ZCOWUS-4CjSLekWM85VEodgdR42VCgt1Btg7og/embed?start=false&loop=false&rm=minimal&slide=id.g3e70a9281e4_0_59" },
    ],
  },
  {
    slug: "1-6-buttons",
    id: "1.6",
    title: "Buttons",
    blurb: "Add a button and suddenly you are in charge instead of the circuit.",
    video: "https://www.youtube.com/embed/rd-5tQTMXqM",
    materials: ["Breadboard", "Push button", "LED", "Resistors"],
    learn: ["What happens inside a push button", "Wiring a button into a circuit"],
    resources: [
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/1Hjhp3ZCOWUS-4CjSLekWM85VEodgdR42VCgt1Btg7og/edit?slide=id.g3e70a9281e4_0_65#slide=id.g3e70a9281e4_0_65", embed: "https://docs.google.com/presentation/d/1Hjhp3ZCOWUS-4CjSLekWM85VEodgdR42VCgt1Btg7og/embed?start=false&loop=false&rm=minimal&slide=id.g3e70a9281e4_0_65" },
    ],
  },
  {
    slug: "1-7-the-button-challenge",
    id: "1.7",
    title: "The Button Challenge",
    blurb: "Your first proper challenge. Two buttons, two LEDs, one puzzle, and no code allowed.",
    video: "",
    materials: ["Breadboard", "2 push buttons", "2 LEDs", "Resistors", "Jumper wires"],
    learn: ["Planning a circuit before you build it", "Finding the mistake when it doesn't work"],
    resources: [
      { kind: "slides", label: "Slides", url: "https://docs.google.com/presentation/d/1PtfCxYOJyRkKvHBe5Pjwlq_uAHAR-I97MA-r3P-FU1g/edit?slide=id.g3eb661caad3_0_62#slide=id.g3eb661caad3_0_62", embed: "https://docs.google.com/presentation/d/1PtfCxYOJyRkKvHBe5Pjwlq_uAHAR-I97MA-r3P-FU1g/embed?start=false&loop=false&rm=minimal&slide=id.g3eb661caad3_0_62" },
    ],
  },
  {
    slug: "1-8-buzzers",
    id: "1.8",
    title: "Buzzers",
    blurb: "Time to make noise. Two kinds of buzzer, and you can hear the difference.",
    video: "https://www.youtube.com/embed/fV4qWf2vknY",
    materials: ["Breadboard", "Active buzzer", "Passive buzzer", "Jumper wires"],
    learn: ["Active buzzers vs passive ones", "Turning electricity into sound"],
    resources: [
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/1Hjhp3ZCOWUS-4CjSLekWM85VEodgdR42VCgt1Btg7og/edit?slide=id.g3e70a9281e4_0_71#slide=id.g3e70a9281e4_0_71", embed: "https://docs.google.com/presentation/d/1Hjhp3ZCOWUS-4CjSLekWM85VEodgdR42VCgt1Btg7og/embed?start=false&loop=false&rm=minimal&slide=id.g3e70a9281e4_0_71" },
    ],
  },
  {
    slug: "1-9-inventor-challenge",
    id: "1.9",
    title: "Inventor Challenge",
    blurb: "End of Unit 1. Take the LEDs, buttons and buzzer and invent something nobody has built before.",
    video: "",
    materials: ["Everything from Unit 1"],
    learn: ["Designing a circuit from scratch", "Explaining how your invention works"],
    resources: [
      { kind: "slides", label: "Slides", url: "https://docs.google.com/presentation/d/1mVFky7XP3EK2cCPpldTttPsI_9Ih-pS7_LM4DYQVQvE/edit?slide=id.g3eb77611804_0_128#slide=id.g3eb77611804_0_128", embed: "https://docs.google.com/presentation/d/1mVFky7XP3EK2cCPpldTttPsI_9Ih-pS7_LM4DYQVQvE/embed?start=false&loop=false&rm=minimal&slide=id.g3eb77611804_0_128" },
    ],
  },
  {
    slug: "inside-a-computer-chip-factory",
    id: "\u2605",
    title: "Inside a Computer Chip Factory",
    blurb: "Side quest. How the chip on your Arduino actually gets made. It is wild.",
    video: "https://www.youtube.com/embed/dX9CGRZwD-w",
    optional: true,
    materials: ["Just your eyeballs"],
    learn: ["How silicon chips are manufactured"],
    resources: [],
  },
];

const unit2: RawLesson[] = [
  {
    slug: "2-1-led-blink",
    id: "2.1",
    title: "LED Blink",
    blurb: "The classic first program. Make a light blink. Then make it blink faster. You are a programmer now.",
    video: "https://www.youtube.com/embed/mWavIuNxlNs",
    materials: ["Arduino UNO R4", "Breadboard", "LED", "220 ohm resistor"],
    learn: ["setup() and loop()", "digitalWrite() and delay()", "Uploading code to the board"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3e70fb218e0_0_53#slide=id.g3e70fb218e0_0_53", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3e70fb218e0_0_53" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/edit?slide=id.g3e70c83bb97_0_53#slide=id.g3e70c83bb97_0_53", embed: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/embed?start=false&loop=false&rm=minimal&slide=id.g3e70c83bb97_0_53" },
    ],
  },
  {
    slug: "2-2-police-siren",
    id: "2.2",
    title: "Police Siren",
    blurb: "Two LEDs, flashing back and forth. It is all in the timing.",
    video: "https://www.youtube.com/embed/-oj4m6JNLuI",
    materials: ["2 LEDs", "Resistors", "Breadboard"],
    learn: ["Running several outputs in order", "Changing delay() to change the pattern"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3e70fb218e0_0_58#slide=id.g3e70fb218e0_0_58", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3e70fb218e0_0_58" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/edit?slide=id.g3e70c83bb97_0_59#slide=id.g3e70c83bb97_0_59", embed: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/embed?start=false&loop=false&rm=minimal&slide=id.g3e70c83bb97_0_59" },
    ],
  },
  {
    slug: "2-3-button-input",
    id: "2.3",
    title: "Button Input",
    blurb: "Teach the Arduino to listen. Press the button, something happens, instantly.",
    video: "https://www.youtube.com/embed/tPOGl-7Wy_M",
    materials: ["Push button", "LED", "Resistors", "Breadboard"],
    learn: ["digitalRead()", "if statements", "Pull-up resistors, explained gently"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3e70fb218e0_0_65#slide=id.g3e70fb218e0_0_65", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3e70fb218e0_0_65" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/edit?slide=id.g3e70c83bb97_0_65#slide=id.g3e70c83bb97_0_65", embed: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/embed?start=false&loop=false&rm=minimal&slide=id.g3e70c83bb97_0_65" },
    ],
  },
  {
    slug: "2-4-light-sensor",
    id: "2.4",
    title: "Light Sensor",
    blurb: "A photoresistor lets your robot see how bright the room is. Not on or off. An actual number.",
    video: "https://www.youtube.com/embed/XTOZf-_FB2s",
    materials: ["Photo-resistor module", "Breadboard", "Jumper wires"],
    learn: ["analogRead() and the 0 to 1023 range", "Reading the Serial Monitor"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3e70fb218e0_4_0#slide=id.g3e70fb218e0_4_0", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3e70fb218e0_4_0" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/edit?slide=id.g3e71691dfac_0_0#slide=id.g3e71691dfac_0_0", embed: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/embed?start=false&loop=false&rm=minimal&slide=id.g3e71691dfac_0_0" },
    ],
  },
  {
    slug: "2-5-light-switch",
    id: "2.5",
    title: "Light Switch",
    blurb: "Turn that light sensor into a night light that switches itself on when it gets dark.",
    video: "https://www.youtube.com/embed/GhnhyBQMEzQ",
    materials: ["Photo-resistor module", "LED", "Resistors"],
    learn: ["Picking a threshold", "Making the Arduino decide something"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3e8283dc2e0_1_0#slide=id.g3e8283dc2e0_1_0", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3e8283dc2e0_1_0" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/edit?slide=id.g3e82973668a_1_0#slide=id.g3e82973668a_1_0", embed: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/embed?start=false&loop=false&rm=minimal&slide=id.g3e82973668a_1_0" },
    ],
  },
  {
    slug: "2-6-reaction-time-game-part-1",
    id: "2.6",
    title: "Reaction Time Game, Part 1",
    blurb: "Start of the Unit 2 build. Wire the game up and get the light to say GO.",
    video: "https://www.youtube.com/embed/OX-Wlt_LL5U",
    materials: ["LED", "Push button", "Buzzer", "Resistors", "Breadboard"],
    learn: ["Planning a project in parts", "Random timing with random()"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3e8283dc2e0_1_7#slide=id.g3e8283dc2e0_1_7", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3e8283dc2e0_1_7" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/edit?slide=id.g3e82973668a_4_0#slide=id.g3e82973668a_4_0", embed: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/embed?start=false&loop=false&rm=minimal&slide=id.g3e82973668a_4_0" },
    ],
  },
  {
    slug: "2-7-reaction-time-game-part-2",
    id: "2.7",
    title: "Reaction Time Game, Part 2",
    blurb: "Now measure how fast you actually are, down to the millisecond.",
    video: "https://www.youtube.com/embed/5be2IC5C2yQ",
    materials: ["Your Part 1 build"],
    learn: ["millis() and measuring time", "Storing a value in a variable"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3ece589eb45_0_0#slide=id.g3ece589eb45_0_0", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3ece589eb45_0_0" },
    ],
  },
  {
    slug: "2-8-reaction-time-game-part-3",
    id: "2.8",
    title: "Reaction Time Game, Part 3",
    blurb: "Add a high score, catch the cheaters, play a victory sound. Then go beat your friends.",
    video: "https://www.youtube.com/embed/Y-gk8LLKnho",
    materials: ["Your Part 2 build"],
    learn: ["Keeping a best score", "Catching early presses", "Playing tones on a buzzer"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3ece589eb45_0_7#slide=id.g3ece589eb45_0_7", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3ece589eb45_0_7" },
    ],
  },
  {
    slug: "2-9-rgb-led",
    id: "2.9",
    title: "RGB LED",
    blurb: "One LED. Sixteen million colours. Mix them yourself out of red, green and blue.",
    video: "https://www.youtube.com/embed/KYaxDTtPdSk",
    materials: ["RGB LED module", "Breadboard", "Jumper wires"],
    learn: ["analogWrite() and PWM", "Making a colour out of numbers"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3ecefd30dd8_0_0#slide=id.g3ecefd30dd8_0_0", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3ecefd30dd8_0_0" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/edit?slide=id.g3e8f4850443_0_0#slide=id.g3e8f4850443_0_0", embed: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/embed?start=false&loop=false&rm=minimal&slide=id.g3e8f4850443_0_0" },
    ],
  },
  {
    slug: "2-10-temperature-and-humidity-sensor",
    id: "2.10",
    title: "Temperature and Humidity Sensor",
    blurb: "Find out how hot the room really is, using a sensor and somebody else's code library.",
    video: "https://www.youtube.com/embed/hU_JvPL-OFI",
    materials: ["Temperature and humidity sensor module", "Jumper wires"],
    learn: ["Installing an Arduino library", "Printing sensor readings"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3ecefd30dd8_0_7#slide=id.g3ecefd30dd8_0_7", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3ecefd30dd8_0_7" },
    ],
  },
  {
    slug: "2-11-rgb-led-temperature-sensor",
    id: "2.11",
    title: "RGB LED + Temperature Sensor",
    blurb: "Two lessons glued together. The LED goes blue when it is cold and red when it is hot.",
    video: "https://www.youtube.com/embed/vxWdau1A5IU",
    materials: ["RGB LED module", "Temperature and humidity sensor module"],
    learn: ["Turning a sensor range into a colour", "map() and constrain()"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3ecefd30dd8_0_14#slide=id.g3ecefd30dd8_0_14", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3ecefd30dd8_0_14" },
    ],
  },
  {
    slug: "2-12-joystick",
    id: "2.12",
    title: "Joystick",
    blurb: "Two directions and a click. Read a joystick like a game controller.",
    video: "https://www.youtube.com/embed/1nchLE2OKqk",
    materials: ["Joystick module", "Jumper wires"],
    learn: ["Reading two axes at once", "Finding the middle, also known as the dead zone"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3ed9c1af536_0_0#slide=id.g3ed9c1af536_0_0", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3ed9c1af536_0_0" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/edit?slide=id.g3f1526560a7_0_0#slide=id.g3f1526560a7_0_0", embed: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/embed?start=false&loop=false&rm=minimal&slide=id.g3f1526560a7_0_0" },
    ],
  },
  {
    slug: "2-13-tilt-sensor",
    id: "2.13",
    title: "Tilt Sensor",
    blurb: "A switch that flips when you tip it. Perfect for alarms and secret traps.",
    video: "https://www.youtube.com/embed/jf7lx9SEupM",
    materials: ["Tilt switch module", "LED", "Jumper wires"],
    learn: ["What is rattling around inside a tilt switch", "Smoothing out a jumpy signal"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3ed9c1af536_0_6#slide=id.g3ed9c1af536_0_6", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3ed9c1af536_0_6" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/edit?slide=id.g3f1526560a7_0_6#slide=id.g3f1526560a7_0_6", embed: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/embed?start=false&loop=false&rm=minimal&slide=id.g3f1526560a7_0_6" },
    ],
  },
  {
    slug: "2-14-water-level-sensor",
    id: "2.14",
    title: "Water Level Sensor",
    blurb: "Detect water. Build a rain alarm, or a plant that tells you it is thirsty.",
    video: "https://www.youtube.com/embed/O8pw7XI04Q8",
    materials: ["Water level sensor module", "Buzzer", "Jumper wires"],
    learn: ["Reading a water sensor", "Keeping electronics and water apart safely"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3ed9c1af536_0_12#slide=id.g3ed9c1af536_0_12", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3ed9c1af536_0_12" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/edit?slide=id.g3f1526560a7_0_12#slide=id.g3f1526560a7_0_12", embed: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/embed?start=false&loop=false&rm=minimal&slide=id.g3f1526560a7_0_12" },
    ],
  },
  {
    slug: "2-15-magnetic-sensor",
    id: "2.15",
    title: "Magnetic Sensor",
    blurb: "Sense a magnet straight through a wall. It is the trick behind every door alarm.",
    video: "https://www.youtube.com/embed/IoxupJSAV9E",
    materials: ["Magnetic spring module", "A magnet", "LED"],
    learn: ["How a reed switch works", "Building a door-open detector"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/edit?slide=id.g3ee0e5d5067_0_0#slide=id.g3ee0e5d5067_0_0", embed: "https://docs.google.com/presentation/d/1Hx181QIKci2teW0jk8dH2kqu_-Px1pu9PCArC4hUiL8/embed?start=false&loop=false&rm=minimal&slide=id.g3ee0e5d5067_0_0" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/edit?slide=id.g3ee0c075f46_0_0#slide=id.g3ee0c075f46_0_0", embed: "https://docs.google.com/presentation/d/12uiyJvesK_WfxFUVB0biTmpIoI7tNxZrz6rqs-srwx4/embed?start=false&loop=false&rm=minimal&slide=id.g3ee0c075f46_0_0" },
    ],
  },
];

const unit3: RawLesson[] = [
  {
    slug: "3-1-intro-to-motors",
    id: "3.1",
    title: "Intro to Motors",
    blurb: "Electricity that moves things. Meet DC motors and servos, and find out why motors need their own power.",
    video: "https://www.youtube.com/embed/TDvlr7_MziA",
    materials: ["DC motor", "Servo motor"],
    learn: ["DC motors vs servos", "Why a motor can brown out your Arduino"],
    resources: [],
  },
  {
    slug: "3-2-dc-motor",
    id: "3.2",
    title: "DC Motor",
    blurb: "Spin a real motor with an H-bridge. Forwards, backwards, stop.",
    video: "https://www.youtube.com/embed/HJXEmc6--L8",
    materials: ["DC motor", "L298N H-bridge module", "External power", "Jumper wires"],
    learn: ["What an H-bridge does", "Reversing a motor in code", "Powering motors separately"],
    resources: [
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/1hgAhlnQUjCCRQEmlvPIWOLubtUSzJKWygKrNZKSMSwY/edit?slide=id.g3f30d729ff5_0_53#slide=id.g3f30d729ff5_0_53", embed: "https://docs.google.com/presentation/d/1hgAhlnQUjCCRQEmlvPIWOLubtUSzJKWygKrNZKSMSwY/embed?start=false&loop=false&rm=minimal&slide=id.g3f30d729ff5_0_53" },
    ],
  },
  {
    slug: "3-3-servo-motor",
    id: "3.3",
    title: "Servo Motor",
    blurb: "A motor that goes to an exact angle and stays put. This is the muscle behind arms and turrets.",
    video: "https://www.youtube.com/embed/9F-d9UWQ4BQ",
    materials: ["Servo motor", "Jumper wires"],
    learn: ["The Servo library", "Angles from 0 to 180 degrees", "Sweeping smoothly"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1_FC4n9EtjnFa77RW7gfp4wWwUS0BreP5j-p8a9620aU/edit?slide=id.g3f0c91cb1d8_0_53#slide=id.g3f0c91cb1d8_0_53", embed: "https://docs.google.com/presentation/d/1_FC4n9EtjnFa77RW7gfp4wWwUS0BreP5j-p8a9620aU/embed?start=false&loop=false&rm=minimal&slide=id.g3f0c91cb1d8_0_53" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/1hgAhlnQUjCCRQEmlvPIWOLubtUSzJKWygKrNZKSMSwY/edit?slide=id.g3f30d729ff5_1_1#slide=id.g3f30d729ff5_1_1", embed: "https://docs.google.com/presentation/d/1hgAhlnQUjCCRQEmlvPIWOLubtUSzJKWygKrNZKSMSwY/embed?start=false&loop=false&rm=minimal&slide=id.g3f30d729ff5_1_1" },
    ],
  },
  {
    slug: "3-4-rotary-encoder",
    id: "3.4",
    title: "Rotary Encoder",
    blurb: "Wire a knob to a motor. Twist it and the wheel speeds up. Twist back and it slows down.",
    video: "https://www.youtube.com/embed/Jaj9Ftfpj7Q",
    materials: ["Rotary encoder module", "DC motor", "L298N H-bridge module", "External power"],
    learn: ["Counting encoder clicks", "Turning a knob into motor speed", "PWM speed control"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1_FC4n9EtjnFa77RW7gfp4wWwUS0BreP5j-p8a9620aU/edit?slide=id.g3f0c91cb1d8_1_1#slide=id.g3f0c91cb1d8_1_1", embed: "https://docs.google.com/presentation/d/1_FC4n9EtjnFa77RW7gfp4wWwUS0BreP5j-p8a9620aU/embed?start=false&loop=false&rm=minimal&slide=id.g3f0c91cb1d8_1_1" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/1hgAhlnQUjCCRQEmlvPIWOLubtUSzJKWygKrNZKSMSwY/edit?slide=id.g3f30d729ff5_1_7#slide=id.g3f30d729ff5_1_7", embed: "https://docs.google.com/presentation/d/1hgAhlnQUjCCRQEmlvPIWOLubtUSzJKWygKrNZKSMSwY/embed?start=false&loop=false&rm=minimal&slide=id.g3f30d729ff5_1_7" },
    ],
  },
  {
    slug: "how-rotary-encoders-work",
    id: "\u2605",
    title: "How Rotary Encoders Work",
    blurb: "Side quest. Sixty seconds on the clever pattern hiding inside the knob.",
    video: "https://www.youtube.com/embed/uqVZFPFt7xA",
    optional: true,
    materials: ["Just your eyeballs"],
    learn: ["The quadrature pattern encoders use"],
    resources: [],
  },
];

const unit4: RawLesson[] = [
  {
    slug: "4-1-what-are-displays",
    id: "4.1",
    title: "What are Displays?",
    blurb: "Pixels, characters and segments. All the ways a machine can show you something.",
    video: "https://www.youtube.com/embed/GOndGB_R7a0",
    materials: ["LCD1602 module", "OLED display module"],
    learn: ["Character displays vs pixel displays", "How I2C saves you a pile of pins"],
    resources: [
      { kind: "slides", label: "Slides", url: "https://docs.google.com/presentation/d/1Z4WFdTzZ2r1QnCxEBsiCU6kNiUUH1zU1rRyAV-X3C9M/edit?slide=id.p#slide=id.p", embed: "https://docs.google.com/presentation/d/1Z4WFdTzZ2r1QnCxEBsiCU6kNiUUH1zU1rRyAV-X3C9M/embed?start=false&loop=false&rm=minimal&slide=id.p" },
    ],
  },
  {
    slug: "4-2-lcd-screen",
    id: "4.2",
    title: "LCD Screen",
    blurb: "Put your own words on a real screen. The classic 16x2 LCD, wired up and working.",
    video: "https://www.youtube.com/embed/HXm8xcmTBuA",
    materials: ["LCD1602 module", "Breadboard", "Jumper wires"],
    learn: ["Wiring an LCD1602", "lcd.print() and moving the cursor"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1y1ZVZHGdQcM-XqlzS2xlpc1waKGYCwz738bbasTprIY/edit?slide=id.g3f46b8cd77b_0_53&pli=1#slide=id.g3f46b8cd77b_0_53", embed: "https://docs.google.com/presentation/d/1y1ZVZHGdQcM-XqlzS2xlpc1waKGYCwz738bbasTprIY/embed?start=false&loop=false&rm=minimal&slide=id.g3f46b8cd77b_0_53" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/1c_v03GBz_jtlpOH7NIYGGhZvE_NlQW3Nwry1ONurfaM/edit?slide=id.g3f7e6b3b337_0_53#slide=id.g3f7e6b3b337_0_53", embed: "https://docs.google.com/presentation/d/1c_v03GBz_jtlpOH7NIYGGhZvE_NlQW3Nwry1ONurfaM/embed?start=false&loop=false&rm=minimal&slide=id.g3f7e6b3b337_0_53" },
    ],
  },
  {
    slug: "4-3-custom-characters",
    id: "4.3",
    title: "Custom Characters",
    blurb: "Draw your own tiny 5x8 pictures. Hearts, faces, whatever you want, and print them.",
    video: "https://www.youtube.com/embed/MtBEAmX3MH4",
    materials: ["Your LCD build from 4.2"],
    learn: ["Designing a character bitmap", "createChar() and byte arrays"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1y1ZVZHGdQcM-XqlzS2xlpc1waKGYCwz738bbasTprIY/edit?slide=id.g3f46b8cd77b_0_59#slide=id.g3f46b8cd77b_0_59", embed: "https://docs.google.com/presentation/d/1y1ZVZHGdQcM-XqlzS2xlpc1waKGYCwz738bbasTprIY/embed?start=false&loop=false&rm=minimal&slide=id.g3f46b8cd77b_0_59" },
    ],
  },
  {
    slug: "4-4-oled-screen",
    id: "4.4",
    title: "OLED Screen",
    blurb: "Upgrade to a crisp pixel display. Two wires and it glows.",
    video: "https://www.youtube.com/embed/f9sFSAKJ_QQ",
    materials: ["OLED display module", "Jumper wires"],
    learn: ["Wiring I2C, meaning SDA and SCL", "Using a graphics library", "Text sizes and positions"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1y1ZVZHGdQcM-XqlzS2xlpc1waKGYCwz738bbasTprIY/edit?slide=id.g3f46b8cd77b_0_66&pli=1#slide=id.g3f46b8cd77b_0_66", embed: "https://docs.google.com/presentation/d/1y1ZVZHGdQcM-XqlzS2xlpc1waKGYCwz738bbasTprIY/embed?start=false&loop=false&rm=minimal&slide=id.g3f46b8cd77b_0_66" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/1c_v03GBz_jtlpOH7NIYGGhZvE_NlQW3Nwry1ONurfaM/edit?slide=id.g3f7e6b3b337_0_59&pli=1#slide=id.g3f7e6b3b337_0_59", embed: "https://docs.google.com/presentation/d/1c_v03GBz_jtlpOH7NIYGGhZvE_NlQW3Nwry1ONurfaM/embed?start=false&loop=false&rm=minimal&slide=id.g3f7e6b3b337_0_59" },
    ],
  },
  {
    slug: "4-5-drawing-shapes",
    id: "4.5",
    title: "Drawing Shapes",
    blurb: "Lines, circles, rectangles. Then make them move and you have a tiny game screen.",
    video: "https://www.youtube.com/embed/2uzOR9lN9sg",
    materials: ["Your OLED build from 4.4"],
    learn: ["The pixel coordinate system", "Drawing shapes in code", "Simple animation"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1y1ZVZHGdQcM-XqlzS2xlpc1waKGYCwz738bbasTprIY/edit?slide=id.g3f593dc6101_0_0&pli=1#slide=id.g3f593dc6101_0_0", embed: "https://docs.google.com/presentation/d/1y1ZVZHGdQcM-XqlzS2xlpc1waKGYCwz738bbasTprIY/embed?start=false&loop=false&rm=minimal&slide=id.g3f593dc6101_0_0" },
    ],
  },
  {
    slug: "4-6-temperature-dashboard",
    id: "4.6",
    title: "Temperature Dashboard",
    blurb: "A live dashboard on the OLED showing temperature and humidity, with a graph that scrolls.",
    video: "https://www.youtube.com/embed/IMH7CZWl0So",
    materials: ["OLED display module", "DHT11 temperature and humidity sensor", "Jumper wires"],
    learn: ["Putting a sensor and a screen together", "Laying out something readable", "Plotting values over time"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1y1ZVZHGdQcM-XqlzS2xlpc1waKGYCwz738bbasTprIY/edit?slide=id.g3f593dc6101_0_7&pli=1#slide=id.g3f593dc6101_0_7", embed: "https://docs.google.com/presentation/d/1y1ZVZHGdQcM-XqlzS2xlpc1waKGYCwz738bbasTprIY/embed?start=false&loop=false&rm=minimal&slide=id.g3f593dc6101_0_7" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/1c_v03GBz_jtlpOH7NIYGGhZvE_NlQW3Nwry1ONurfaM/edit?slide=id.g3f593c3c0cd_0_0&pli=1#slide=id.g3f593c3c0cd_0_0", embed: "https://docs.google.com/presentation/d/1c_v03GBz_jtlpOH7NIYGGhZvE_NlQW3Nwry1ONurfaM/embed?start=false&loop=false&rm=minimal&slide=id.g3f593c3c0cd_0_0" },
    ],
  },
  {
    slug: "4-7-serial-input",
    id: "4.7",
    title: "Serial Input",
    blurb: "Talk to your Arduino. Type commands from your computer and watch it obey.",
    video: "https://www.youtube.com/embed/vgNcuj9nn3A",
    materials: ["Arduino UNO R4", "Jumper wires"],
    learn: ["Serial.available() and reading text", "Understanding a typed command"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/presentation/d/1y1ZVZHGdQcM-XqlzS2xlpc1waKGYCwz738bbasTprIY/edit?slide=id.g3f5e0f02eaf_0_0&pli=1#slide=id.g3f5e0f02eaf_0_0", embed: "https://docs.google.com/presentation/d/1y1ZVZHGdQcM-XqlzS2xlpc1waKGYCwz738bbasTprIY/embed?start=false&loop=false&rm=minimal&slide=id.g3f5e0f02eaf_0_0" },
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/presentation/d/1c_v03GBz_jtlpOH7NIYGGhZvE_NlQW3Nwry1ONurfaM/edit?slide=id.g3f5e1682371_0_0&pli=1#slide=id.g3f5e1682371_0_0", embed: "https://docs.google.com/presentation/d/1c_v03GBz_jtlpOH7NIYGGhZvE_NlQW3Nwry1ONurfaM/embed?start=false&loop=false&rm=minimal&slide=id.g3f5e1682371_0_0" },
    ],
  },
];

const unit5: RawLesson[] = [
  {
    slug: "5-1-welcome-to-the-inventor-lab",
    id: "5.1",
    title: "Welcome to the Inventor Lab",
    blurb: "How the big projects work, what you need for each, and which one to build first.",
    video: "https://www.youtube.com/embed/08bVl-2jeCg",
    materials: ["Everything you have built so far"],
    learn: ["What each project involves", "How to plan a build that takes more than one sitting"],
    resources: [],
  },
  {
    slug: "5a-1-rc-car-assembling-the-chassis",
    id: "5A.1",
    title: "RC Car: Assembling the Chassis",
    blurb: "Screws, wheels, motors, frame. Build the body before it can drive anywhere.",
    video: "https://www.youtube.com/embed/Rkrz83IIDNk",
    project: "A",
    materials: ["2WD robot chassis kit", "2 DC motors", "A screwdriver"],
    learn: ["Putting the frame together", "Mounting the motors and wheels"],
    resources: [],
  },
  {
    slug: "5a-2-rc-car-wiring",
    id: "5A.2",
    title: "RC Car: Wiring",
    blurb: "Get both motors talking to the L298N, and give them power that is not your Arduino.",
    video: "https://www.youtube.com/embed/YGsCSRQZ820",
    project: "A",
    materials: ["Your chassis", "L298N H-bridge module", "Battery pack", "Jumper wires"],
    learn: ["Wiring two motors to an H-bridge", "Powering motors separately"],
    resources: [],
  },
  {
    slug: "5a-3-rc-car-coding",
    id: "5A.3",
    title: "RC Car: Coding",
    blurb: "Make it drive. Forwards, backwards, turns, and then tune out the wobble.",
    video: "https://www.youtube.com/embed/b3EhZNpTzUU",
    project: "A",
    materials: ["Your wired car", "USB cable"],
    learn: ["Driving two motors together", "Steering by changing speeds", "Fixing a car that pulls to one side"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/document/d/18dkgLWV--NGaHg4jnKFivaPOHlc479-FJEp5M-uAYT0/edit?tab=t.0", embed: "https://docs.google.com/document/d/18dkgLWV--NGaHg4jnKFivaPOHlc479-FJEp5M-uAYT0/preview" },
    ],
  },
  {
    slug: "5b-1-tic-tac-toe-wiring",
    id: "5B.1",
    title: "Tic-Tac-Toe: Wiring",
    blurb: "Lay out the board. This is the biggest wiring job so far, so take it slow.",
    video: "https://www.youtube.com/embed/Y2r6S5K0QeM",
    project: "B",
    materials: ["Breadboard", "LEDs", "Buttons", "Jumper wires"],
    learn: ["Wiring a 3x3 grid", "Keeping a big breadboard tidy"],
    resources: [
      { kind: "wiring", label: "Wiring", url: "https://docs.google.com/document/d/1v_W348jTXLI5fdpbK-WxoxwUaG9HBnNGi_7_J7zdgKU/edit?tab=t.0", embed: "https://docs.google.com/document/d/1v_W348jTXLI5fdpbK-WxoxwUaG9HBnNGi_7_J7zdgKU/preview" },
    ],
  },
  {
    slug: "5b-2-tic-tac-toe-drawing-the-board",
    id: "5B.2",
    title: "Tic-Tac-Toe: Drawing the Board",
    blurb: "Get the grid showing up properly before you worry about the game.",
    video: "https://www.youtube.com/embed/w6OBxboqn2g",
    project: "B",
    materials: ["Your wired board"],
    learn: ["Storing the board in an array", "Showing the board state"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/document/d/1v_W348jTXLI5fdpbK-WxoxwUaG9HBnNGi_7_J7zdgKU/edit?tab=t.0", embed: "https://docs.google.com/document/d/1v_W348jTXLI5fdpbK-WxoxwUaG9HBnNGi_7_J7zdgKU/preview" },
    ],
  },
  {
    slug: "5b-3-tic-tac-toe-placing-the-marks",
    id: "5B.3",
    title: "Tic-Tac-Toe: Placing the Marks",
    blurb: "Pick a square, place your mark. It starts to feel like a game.",
    video: "https://www.youtube.com/embed/9PFbDT3aRr4",
    project: "B",
    materials: ["Your wired board"],
    learn: ["Reading which square was chosen", "Stopping people playing on a taken square"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/document/d/1v_W348jTXLI5fdpbK-WxoxwUaG9HBnNGi_7_J7zdgKU/edit?tab=t.0", embed: "https://docs.google.com/document/d/1v_W348jTXLI5fdpbK-WxoxwUaG9HBnNGi_7_J7zdgKU/preview" },
    ],
  },
  {
    slug: "5b-4-tic-tac-toe-two-player-tic-tac-toe",
    id: "5B.4",
    title: "Tic-Tac-Toe: Two Player Tic-Tac-Toe",
    blurb: "Take turns, spot the winner, handle a draw. Now go grab a friend.",
    video: "https://www.youtube.com/embed/Vmf-XyJzWkE",
    project: "B",
    materials: ["Your wired board"],
    learn: ["Swapping turns", "Checking rows, columns and diagonals", "Spotting a tie"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/document/d/1v_W348jTXLI5fdpbK-WxoxwUaG9HBnNGi_7_J7zdgKU/edit?tab=t.0", embed: "https://docs.google.com/document/d/1v_W348jTXLI5fdpbK-WxoxwUaG9HBnNGi_7_J7zdgKU/preview" },
    ],
  },
  {
    slug: "5b-5-tic-tac-toe-one-player-tic-tac-toe",
    id: "5B.5",
    title: "Tic-Tac-Toe: One Player Tic-Tac-Toe",
    blurb: "Write the opponent. Teach it to block you, then teach it to be really annoying.",
    video: "https://www.youtube.com/embed/ugV4G8AJw6U",
    project: "B",
    materials: ["Your wired board"],
    learn: ["Making the Arduino choose a move", "Blocking the player", "Playing to win"],
    resources: [
      { kind: "code", label: "Code", url: "https://docs.google.com/document/d/1v_W348jTXLI5fdpbK-WxoxwUaG9HBnNGi_7_J7zdgKU/edit?tab=t.0", embed: "https://docs.google.com/document/d/1v_W348jTXLI5fdpbK-WxoxwUaG9HBnNGi_7_J7zdgKU/preview" },
    ],
  },
];

const extras: RawLesson[] = [
  {
    slug: "troubleshooting",
    id: "T",
    title: "Troubleshooting",
    blurb: "Nothing lighting up? Code will not upload? Start here. These are the problems everybody hits.",
    video: "https://www.youtube.com/embed/5c8PiAv21xE",
    materials: ["Your build, exactly as broken as it is"],
    learn: ["The five things to check first", "Reading an upload error", "When to just rewire it from scratch"],
    resources: [],
  },
  {
    slug: "live-help-sessions",
    id: "★",
    title: "Live Help Sessions",
    blurb: "Every week I run an online session. Bring whatever you're stuck on and we'll fix it together.",
    video: "",
    materials: ["Whatever you're building", "Internet that works"],
    learn: ["How to show off your build", "How to ask a question that gets you unstuck"],
    resources: [{ kind: "form", label: "Book a time", url: links.scheduleMeeting, embed: null }],
  },
];

export const capstones: Capstone[] = [
  {
    letter: "A",
    name: "RC Car",
    emoji: "\ud83c\udfce\ufe0f",
    blurb: "Build a two-wheel-drive car from a bare chassis, then drive it around your house.",
    skills: ["DC motors", "L298N H-bridge", "Chassis build", "Speed control"],
    lessonCount: 3,
    /* The shared code workbook tab for this project. */
    workbook: "https://docs.google.com/spreadsheets/d/1-7jHE1tAl7S2G3s1sex_742mG_TpRC1j8OkLTxLyikM/edit?gid=2116686604#gid=2116686604",
  },
  {
    letter: "B",
    name: "Tic-Tac-Toe",
    emoji: "\ud83c\udfaf",
    blurb: "An LED board, buttons, and an opponent you wrote yourself.",
    skills: ["Arrays & game state", "Win detection", "Simple AI", "Big-board wiring"],
    lessonCount: 5,
    /* The shared code workbook tab for this project. */
    workbook: "https://docs.google.com/spreadsheets/d/1-7jHE1tAl7S2G3s1sex_742mG_TpRC1j8OkLTxLyikM/edit?gid=1283806538#gid=1283806538",
  },
  {
    letter: "C",
    name: "Laser Harp",
    emoji: "\ud83c\udfbc",
    blurb: "Invisible strings made of light. Wave your hand through a beam and it plays a note.",
    skills: ["Lasers & photoresistors", "Calibration", "Tone generation"],
    lessonCount: 0,
    /* The shared code workbook tab for this project. */
    workbook: "https://docs.google.com/spreadsheets/d/1-7jHE1tAl7S2G3s1sex_742mG_TpRC1j8OkLTxLyikM/edit?gid=116043300#gid=116043300",
  },
  {
    letter: "D",
    name: "Crack the Vault",
    emoji: "\ud83d\udd10",
    blurb: "A keypad-locked vault with a servo bolt, an alarm, and a combination only you know.",
    skills: ["Keypad input", "Servo lock", "State machines"],
    lessonCount: 0,
    /* The shared code workbook tab for this project. */
    workbook: "https://docs.google.com/spreadsheets/d/1-7jHE1tAl7S2G3s1sex_742mG_TpRC1j8OkLTxLyikM/edit?gid=1877608252#gid=1877608252",
  },
  {
    letter: "E",
    name: "Sentry Turret",
    emoji: "\ud83d\udee1\ufe0f",
    blurb: "A pan-tilt turret that scans the room, locks onto a target and fires.",
    skills: ["Pan-tilt servos", "Ultrasonic ranging", "Target tracking"],
    lessonCount: 0,
    /* The shared code workbook tab for this project. */
    workbook: "https://docs.google.com/spreadsheets/d/1-7jHE1tAl7S2G3s1sex_742mG_TpRC1j8OkLTxLyikM/edit?gid=484184405#gid=484184405",
  },
];

type RawLesson = Omit<Lesson, 'unitId'>;

const rawUnits: (Omit<Unit, 'lessons'> & { lessons: RawLesson[] })[] = [
  {
    id: "unit-0",
    num: "0",
    title: "Getting Started",
    emoji: "\ud83d\udce6",
    tagline: "Open the box",
    blurb: "Unpack the kit, install the software, and figure out how this whole thing works.",
    accent: "orange",
    lessons: unit0,
  },
  {
    id: "unit-1",
    num: "1",
    title: "Intro to Robotics & Circuits",
    emoji: "\u26a1",
    tagline: "Make electricity do things",
    blurb: "Circuits, breadboards, LEDs, resistors, buttons and buzzers \u2014 all before you write a single line of code.",
    accent: "amber",
    lessons: unit1,
  },
  {
    id: "unit-2",
    num: "2",
    title: "Sensors & Interaction",
    emoji: "\ud83d\udef0\ufe0f",
    tagline: "Give your robot senses",
    blurb: "Your first real code, then eleven sensors: light, heat, tilt, water, magnets and more.",
    accent: "cyan",
    lessons: unit2,
  },
  {
    id: "unit-3",
    num: "3",
    title: "Motors & Movement",
    emoji: "\u2699\ufe0f",
    tagline: "Make it move",
    blurb: "DC motors, servos and an H-bridge, ending with a knob that controls a real spinning motor.",
    accent: "lime",
    lessons: unit3,
  },
  {
    id: "unit-4",
    num: "4",
    title: "Displays & Communication",
    emoji: "\ud83d\udcfa",
    tagline: "Make it talk back",
    blurb: "LCD and OLED screens, your own pixel art, a live sensor dashboard, and typing commands to your board.",
    accent: "violet",
    lessons: unit4,
  },
  {
    id: "unit-5",
    num: "5",
    title: "Inventor Lab",
    emoji: "🚀",
    tagline: "Build the big ones",
    blurb: "The five big builds. RC Car and Tic-Tac-Toe are ready to go; the other three are still being filmed.",
    accent: "pink",
    lessons: unit5,
  },
  {
    id: "extras",
    num: "★",
    title: "Extras",
    emoji: "🧰",
    tagline: "When something breaks",
    blurb: "Troubleshooting, and the weekly session where I help you unbreak it.",
    accent: "slate",
    lessons: extras,
  },
];

export const units: Unit[] = rawUnits.map((u) => ({
  ...u,
  lessons: u.lessons.map((l) => ({ ...l, unitId: u.id })),
}));

/** Flat, in course order — drives prev/next and progress. */
export const allLessons: Lesson[] = units.flatMap((u) => u.lessons);

export const lessonBySlug = new Map(allLessons.map((l) => [l.slug, l]));
export const unitById = new Map(units.map((u) => [u.id, u]));

export function lessonNeighbours(slug: string) {
  const i = allLessons.findIndex((l) => l.slug === slug);
  return {
    prev: i > 0 ? allLessons[i - 1] : null,
    next: i >= 0 && i < allLessons.length - 1 ? allLessons[i + 1] : null,
    index: i,
  };
}

/** Side quests don't count toward progress. */
export const trackedLessons = allLessons.filter((l) => !l.optional);

/** The lessons that make up one Inventor Lab project. */
export const projectLessons = (letter: string) =>
  allLessons.filter((l) => l.project === letter);

export const stats = {
  lessons: allLessons.length,
  videos: allLessons.filter((l) => l.video).length,
  units: rawUnits.length - 1,
  capstones: capstones.length,
  sensors: 30,
} as const;
