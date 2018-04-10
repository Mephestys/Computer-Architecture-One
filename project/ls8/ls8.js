const fs = require('fs');
const RAM = require('./ram');
const CPU = require('./cpu');

/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */

function loadMemory() {
  const program = [];
  let loadFile = fs.readFileSync(`./${process.argv[2]}`, {encoding: 'utf-8'});
  loadFile = loadFile.split('\n');

  for (let line of loadFile) {
    const comment = line.indexOf('#');

    if (comment != -1) {
      line = line.substr(0, comment);
    }
    line = line.trim();

    if (line === '') {
      continue;
    }
    program.push(line);
  }

  // Load the program into the CPU's memory a byte at a time
  for (let i = 0; i < program.length; i++) {
    cpu.poke(i, parseInt(program[i], 2));
  }
}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line

loadMemory(cpu);

cpu.startClock();
