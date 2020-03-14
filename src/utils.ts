let timer: number;
type work = () => boolean;

const startWork = (works: work[]) => {
  if (timer) return;
  let next = works[0];
  timer = setTimeout(() => {

  }, 500);
}