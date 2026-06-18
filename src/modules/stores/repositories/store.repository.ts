import { prisma } from "../../../db.config.js";
import { StoreCreateRequest } from "../dtos/store.dto.js";

// 1. 가게를 DB에 추가하는 함수
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

// 2. 가게가 실제로 존재하는지 조회하는 함수
export const getStoreById = async (storeId: number) => {
  const store = await prisma.store.findFirst({
    where: { id: storeId },
  });

  return store;
};
