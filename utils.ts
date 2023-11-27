let getItem = (key: string) => window.localStorage.getItem(key);
let setItem = (key: string, value: string | any) =>
  window.localStorage.setItem(
    key,
    typeof value === "object" ? JSON.stringify(value) : value
  );
let generateId = () :string => {
   return Math.random().toString(36).substring(2) + Date.now().toString(36)
}