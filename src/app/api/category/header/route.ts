import db from "@/db/db";
import { res } from "@/functions/res";
import { errorWrap } from "@/functions/error";
import { times } from "@/functions/times";
import redis from "@/redis/redis";

export const GET = errorWrap(async () => {
  const ie = await redis.get("header_category_list");

  if (ie == null) {
    const cls = await selectCategoryList();
    await redis.setex("header_category_list", times.week, JSON.stringify(cls));
    return res(cls);
  }

  return res(JSON.parse(ie));
});

function selectCategoryList() {
  return db.categories.findMany({
    select: {
      name: true,
      link: true,
      subcategories: {
        select: {
          name: true,
          link: true,
          subcategoryitems: {
            select: { name: true, link: true },
            orderBy: { index: "asc" },
          },
        },
        orderBy: { index: "asc" },
      },
    },
    orderBy: { index: "asc" },
  });
}
