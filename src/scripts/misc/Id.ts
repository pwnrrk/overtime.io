export function getId(name: string) {
  const id =
    name + "_" + Math.round(Date.now().valueOf() * Math.random()).toString(8);
  return id;
}
