[[block]]
struct Input {
  number_count: u32;
  board_count: u32;
  // first {number_count} elements are the number sequence to play the board in
  // rest of the {board_count * 25} elements are the numbers on the boards
  data: [[stride(4)]] array<u32>;
};

[[block]]
struct Result {
  data: [[stride(4)]] array<u32>;
};

[[block]]
struct Revealed {
  data: [[stride(4)]] array<u32>;
};

[[group(0), binding(0)]]
var<storage, read> input: Input;

[[group(0), binding(1)]]
var<storage, read_write> result: Result;

[[group(0), binding(2)]]
var<storage, read_write> revealed: Revealed;

fn has_revealed(flags: u32, index: u32) -> bool {
  var bit: u32 = 1u << index;
  return (flags & bit) == bit;
}

fn revealed_every(flags: u32, n1: u32, n2: u32, n3: u32, n4: u32, n5: u32) -> bool {
  return
       has_revealed(flags, n1)
    && has_revealed(flags, n2)
    && has_revealed(flags, n3)
    && has_revealed(flags, n4)
    && has_revealed(flags, n5);
}

fn has_won(flags: u32) -> bool {
  let result: bool = 
     revealed_every(flags,  0u,  1u,  2u,  3u,  4u)
  || revealed_every(flags,  5u,  6u,  7u,  8u,  9u)
  || revealed_every(flags, 10u, 11u, 12u, 13u, 14u)
  || revealed_every(flags, 15u, 16u, 17u, 18u, 19u)
  || revealed_every(flags, 20u, 21u, 22u, 23u, 24u)

  || revealed_every(flags,  0u,  5u, 10u, 15u, 20u)
  || revealed_every(flags,  1u,  6u, 11u, 16u, 21u)
  || revealed_every(flags,  2u,  7u, 12u, 17u, 22u)
  || revealed_every(flags,  3u,  8u, 13u, 18u, 23u)
  || revealed_every(flags,  4u,  9u, 14u, 19u, 24u);

  return result;
}

fn find_board_index(board_index: u32, num: u32) -> i32 {
  let board_start: u32 = input.number_count + (board_index * 25u);
  
  for (var i: u32 = 0u; i < 25u; i = i + 1u) {
    let board_num: u32 = input.data[board_start + i];
    if (num == board_num) {
      return i32(i);
    }
  }

  return -1;
}

[[stage(compute), workgroup_size(1)]]
fn main([[builtin(global_invocation_id)]] gid: vec3<u32>) {
  let board_index: u32 = gid.x;
  let result_index: u32 = board_index * 2u;

  var num_index: u32 = 0u;
  var num: u32 = 0u;

  loop {
    num = input.data[num_index];
    let index = find_board_index(board_index, num);

    if (index > -1) {
      var curr_rev: u32 = revealed.data[board_index];
      curr_rev = curr_rev | (1u << u32(index));
      
      if (has_won(curr_rev)) {
        let board_start: u32 = input.number_count + (board_index * 25u);
        var score: u32 = 0u;
        
        for (var i = 0u; i < 25u; i = i + 1u) {
          if (!has_revealed(curr_rev, i)) {
            score = score + input.data[board_start + i];
          }
        }
        
        result.data[result_index] = num_index;
        result.data[result_index + 1u] = score * num;
        return;
      } else {
        revealed.data[board_index] = curr_rev;
      }
    }

    num_index = num_index + 1u;
    if (input.number_count <= num_index) {
      return;
    }
  }
}
