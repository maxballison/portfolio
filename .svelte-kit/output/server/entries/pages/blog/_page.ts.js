import { U as UserInfoEndpoint } from "../../../chunks/Constants.js";
import { e as error } from "../../../chunks/index.js";
async function load({ fetch }) {
  let devToArticles;
  try {
    devToArticles = await fetch(`${UserInfoEndpoint}ladvace`);
    devToArticles = await devToArticles.json();
  } catch (e) {
    throw error(404, "Not found");
  }
  return {
    devToArticles
  };
}
export {
  load
};
