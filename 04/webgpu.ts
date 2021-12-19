import { enableValidationErrors } from "https://crux.land/gpu_err@1.0.0";
import { Input, parse, solve, solvePartTwo } from "./solution.ts";

const adapter = (await navigator.gpu.requestAdapter())!;
const device = (await adapter.requestDevice())!;
enableValidationErrors(device, true);

const shader = device.createShaderModule({
  code: await Deno.readTextFile(new URL("./compute.wgsl", import.meta.url)),
});

const bindGroupLayout = device.createBindGroupLayout({
  entries: [
    {
      binding: 0,
      buffer: {
        type: "read-only-storage",
      },
      visibility: GPUShaderStage.COMPUTE,
    },
    {
      binding: 1,
      buffer: {
        type: "storage",
      },
      visibility: GPUShaderStage.COMPUTE,
    },
    {
      binding: 2,
      buffer: {
        type: "storage",
      },
      visibility: GPUShaderStage.COMPUTE,
    },
  ],
});

const pipelineLayout = device.createPipelineLayout({
  bindGroupLayouts: [bindGroupLayout],
});

const pipeline = device.createComputePipeline({
  layout: pipelineLayout,
  compute: {
    module: shader,
    entryPoint: "main",
  },
});

async function compute(input: Input) {
  const inputSize = 2 * 4 + input.numbers.length * 4 +
    input.boards.length * 25 * 4;
  const resultSize = 8 * input.boards.length;

  const inputBuffer = device.createBuffer({
    label: "Input Buffer",
    size: inputSize,
    mappedAtCreation: true,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.MAP_WRITE,
  });

  const data = new Uint32Array(inputBuffer.getMappedRange());

  data[0] = input.numbers.length;
  data[1] = input.boards.length;

  for (let i = 0; i < input.numbers.length; i++) {
    data[2 + i] = input.numbers[i];
  }

  for (let i = 0; i < input.boards.length; i++) {
    const board = input.boards[i];
    for (let j = 0; j < board.length; j++) {
      data[2 + input.numbers.length + (i * 25) + j] = board[j];
    }
  }

  inputBuffer.unmap();

  const revealedBuffer = device.createBuffer({
    label: "Revealed Buffer",
    size: input.boards.length * 4,
    usage: GPUBufferUsage.STORAGE,
  });

  const resultBuffer = device.createBuffer({
    label: "Result Buffer",
    size: resultSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const stagingBuffer = device.createBuffer({
    label: "Staging Buffer",
    size: resultSize,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  });

  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: inputBuffer,
        },
      },
      {
        binding: 1,
        resource: {
          buffer: resultBuffer,
        },
      },
      {
        binding: 2,
        resource: {
          buffer: revealedBuffer,
        },
      },
    ],
  });

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatch(input.boards.length, 1, 1);
  pass.endPass();

  encoder.copyBufferToBuffer(resultBuffer, 0, stagingBuffer, 0, resultSize);

  device.queue.submit([encoder.finish()]);

  await stagingBuffer.mapAsync(GPUMapMode.READ);
  const result = new Uint32Array(stagingBuffer.getMappedRange());
  stagingBuffer.unmap();

  const indices = result.filter((_, i) => i % 2 === 0);
  const firstWin = Math.min(...indices);
  const lastWin = Math.max(...indices);
  const partOneScore = result.find((_, i) =>
    i % 2 !== 0 && result[i - 1] === firstWin
  );
  const partTwoScore = result.find((_, i) =>
    i % 2 !== 0 && result[i - 1] === lastWin
  );

  return {
    partOneScore,
    partTwoScore,
  };
}

const EXAMPLE_CASE = parse(
  Deno.readTextFileSync(new URL("./input.txt", import.meta.url)),
);

let start = 0;

start = performance.now();
await compute(EXAMPLE_CASE);
console.log("gpu took", performance.now() - start);

start = performance.now();
solve(EXAMPLE_CASE);
solvePartTwo(EXAMPLE_CASE);
console.log("cpu took", performance.now() - start);
