import { enableValidationErrors } from "https://crux.land/gpu_err@1.0.0";

const adapter = (await navigator.gpu.requestAdapter())!;
const device = (await adapter.requestDevice())!;
enableValidationErrors(device, true);

const partOneShader = device.createShaderModule({
  label: "PartOne",
  code: await Deno.readTextFile(new URL("./part_one.wgsl", import.meta.url)),
});

async function solve(numbers: string[]) {
  const commonLength = numbers[0].length;
  const inputSize = 8 + (numbers.length * commonLength) * 4;

  const inputBuffer = device.createBuffer({
    size: inputSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.MAP_WRITE,
    mappedAtCreation: true,
  });

  const input = new Uint32Array(inputBuffer.getMappedRange());
  input.set([numbers.length, commonLength]);
  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];
    for (let j = 0; j < num.length; j++) {
      const bit = num[j];
      input[2 + i * commonLength + j] = Number(bit);
    }
  }

  inputBuffer.unmap();

  const resultSize = 2 * 4 * commonLength;

  const outputBuffer = device.createBuffer({
    size: resultSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const stagingBuffer = device.createBuffer({
    size: resultSize,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  });

  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "read-only-storage",
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage",
        },
      },
    ],
  });

  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [bindGroupLayout],
  });

  const pipeline = device.createComputePipeline({
    layout: pipelineLayout,
    compute: {
      module: partOneShader,
      entryPoint: "main",
    },
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
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
          buffer: outputBuffer,
        },
      },
    ],
  });

  const encoder = device.createCommandEncoder();

  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatch(commonLength, 1, 1);
  pass.endPass();

  encoder.copyBufferToBuffer(
    outputBuffer,
    0,
    stagingBuffer,
    0,
    resultSize,
  );

  device.queue.submit([encoder.finish()]);

  await stagingBuffer.mapAsync(GPUMapMode.READ);
  const data = new Uint32Array(stagingBuffer.getMappedRange().slice(0));
  stagingBuffer.unmap();

  const gamma = data.subarray(0, commonLength).reduce((p, a) => p + a, 0);
  const epsilon = data.subarray(commonLength).reduce((p, a) => p + a, 0);

  return gamma * epsilon;
}

console.log(
  await solve([
    "00100",
    "11110",
    "10110",
    "10111",
    "10101",
    "01111",
    "00111",
    "11100",
    "10000",
    "11001",
    "00010",
    "01010",
  ]),
);
