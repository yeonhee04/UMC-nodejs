import { prisma } from "../../../db.config.js";
import { StoreCreateRequest } from "../dtos/store.dto.js";

export const addStore = async (regionId: number, data: StoreCreateRequest) => {
  const created = await prisma.store.create({
    data: {
      regionId: regionId,
      foodCategoryId: data.categoryId,
      name: data.name,
      address: data.address,
    },
  });

  return created.id; // 새로 만들어진 가게의 ID 반환
};
