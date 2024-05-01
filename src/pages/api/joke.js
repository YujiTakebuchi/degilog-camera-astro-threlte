export async function get() {
  const res = await fetch("https://official-joke-api.appspot.com/jokes/random");
  // console.log(res);
  return res;
}