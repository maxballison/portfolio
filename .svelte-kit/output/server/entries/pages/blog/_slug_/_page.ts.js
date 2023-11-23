import { A as ArticleEndPoint } from "../../../../chunks/Constants.js";
const load = async ({ params }) => {
  let response = await fetch(`${ArticleEndPoint}/${params.slug}`);
  return {
    article: response.ok && await response.json()
  };
};
export {
  load
};
