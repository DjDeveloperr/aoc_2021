[[block]]
struct Input {
  length: u32;
  inner_length: u32;
  numbers: [[stride(4)]] array<u32>;
};

[[block]]
struct Result {
  data: [[stride(4)]] array<u32>;
};

[[group(0), binding(0)]]
var<storage, read> input: Input;
[[group(0), binding(1)]]
var<storage, read_write> result: Result;

fn two_pow(to: u32) -> u32 {
  var res: u32 = 1u;
  for (var i = 0u; i < to; i = i + 1u) {
    res = res * 2u;
  }
  return res;
}

[[stage(compute), workgroup_size(1)]]
fn main([[builtin(global_invocation_id)]] gid: vec3<u32>) {
  let bit_index: u32 = gid.x;
  var zeroes: u32 = 0u;
  var ones: u32 = 0u;
  
  for (var i: u32 = 0u; i < input.length; i = i + 1u) {
    let reversed_bit_index: u32 = input.inner_length - bit_index - 1u;
    let mapped_2d_index: u32 = i * input.inner_length + reversed_bit_index;
    let bit: u32 = input.numbers[mapped_2d_index];
    if (bit == 1u) {
      ones = ones + 1u;
    } else {
      zeroes = zeroes + 1u;
    }
  }

  var mcb: u32 = 0u;
  var lcb: u32 = 1u;
  if (ones > zeroes) {
    mcb = 1u;
    lcb = 0u;
  }

  result.data[bit_index] = mcb * two_pow(bit_index);
  result.data[input.inner_length + bit_index] = lcb * two_pow(bit_index);
}
