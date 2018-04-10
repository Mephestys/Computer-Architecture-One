/**
 * LS-8 v2.0 emulator skeleton code
 */

 /* Instructions */
 const ADD  = 0b10101000; // ADD R R
 const AND  = 0b10110011; // AND R R
 const CALL = 0b01001000; // CALL R
 const CMP  = 0b10100000; // CMP R R
 const DEC  = 0b01111001; // DEC R
 const DIV  = 0b10101011; // DIV R R
 const HLT  = 0b00000001; // Halt CPU
 const INC  = 0b01111000; // INC R
 const INT  = 0b01001010; // Software interrupt R
 const IRET = 0b00001011; // Return from interrupt
 const JEQ  = 0b01010001; // JEQ R
 const JGT  = 0b01010100; // JGT R
 const JLT  = 0b01010011; // JLT R
 const JMP  = 0b01010000; // JMP R
 const JNE  = 0b01010010; // JNE R
 const LD   = 0b10011000; // Load R,R
 const LDI  = 0b10011001; // LDI R,I(mmediate)
 const MOD  = 0b10101100; // MOD R R
 const MUL  = 0b10101010; // MUL R,R
 const NOP  = 0b00000000; // NOP
 const NOT  = 0b01110000; // NOT R
 const OR   = 0b10110001; // OR R R
 const POP  = 0b01001100; // Pop R
 const PRA  = 0b01000010; // Print alpha char
 const PRN  = 0b01000011; // Print numeric register
 const PUSH = 0b01001101; // Push R
 const RET  = 0b00001001; // Return
 const ST   = 0b10011010; // Store R,R
 const SUB  = 0b10101001; // SUB R R
 const XOR  = 0b10110010; // XOR R R

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

  /**
   * Initialize the CPU
   */
  constructor(ram) {
    this.ram = ram;

    this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
    
    // Special-purpose registers
    this.reg.PC = 0; // Program Counter
  }
	
  /**
   * Store value in memory address, useful for program loading
   */
  poke(address, value) {
    this.ram.write(address, value);
  }

  /**
   * Starts the clock ticking on the CPU
   */
  startClock() {
    this.clock = setInterval(() => {
      this.tick();
    }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
  }

  /**
   * Stops the clock
   */
  stopClock() {
    clearInterval(this.clock);
  }

  /**
   * ALU functionality
   *
   * The ALU is responsible for math and comparisons.
   *
   * If you have an instruction that does math, i.e. MUL, the CPU would hand
   * it off to it's internal ALU component to do the actual work.
   *
   * op can be: ADD SUB MUL DIV INC DEC CMP
   */
  alu(op, regA, regB) {
    switch (op) {
      case 'MUL':
        this.reg[regA] *= this.reg[regB];
        break;
    }
  }

  /**
   * Advances the CPU one cycle
   */
  tick() {
    // Load the instruction register (IR--can just be a local variable here)
    // from the memory address pointed to by the PC. (I.e. the PC holds the
    // index into memory of the instruction that's about to be executed
    // right now.)
    const IR = this.ram.read(this.reg.PC);

    // Debugging output
    // console.log(`${this.reg.PC}: ${IR.toString(2)}`);

    // Get the two bytes in memory _after_ the PC in case the instruction
    // needs them.

    const operandA = this.ram.read(this.reg.PC + 1);
    const operandB = this.ram.read(this.reg.PC + 2);

    // Execute the instruction. Perform the actions for the instruction as
    // outlined in the LS-8 spec.

    switch(IR) {
      case HLT:
        this.stopClock();
        break;
      case LDI:
        this.reg[operandA] = operandB;
        break;
      case PRN:
        console.log(this.reg[operandA]);
        break;
      case MUL:
        this.alu('MUL', operandA, operandB);
        break;
      default:
        let instError = IR.toString(2);
        instError = '00000000'.substr(instError.length) + instError;
        console.error(`Error, unknown instruction at PC ${this.reg.PC} : ${instError}`)
        this.stopClock();
        break;
    }

    // Increment the PC register to go to the next instruction. Instructions
    // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
    // instruction byte tells you how many bytes follow the instruction byte
    // for any particular instruction.
    
    if (IR !== CALL && IR !== RET) {
      this.reg.PC += (IR >>> 6) + 1;
    }
  }
}

module.exports = CPU;
