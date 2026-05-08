import { StoreCreateRequest, StoreResponse } from "../dtos/store.dto.js";
import { addStore } from "../repositories/store.repository.js";

export const createStore = async (
  regionId: number,
  data: StoreCreateRequest,
): Promise<StoreResponse> => {
  const insertId = await addStore(regionId, data);

  return <StoreResponse>{
    storeId: insertId,
    message: "가게가 성공적으로 추가되었습니다!",
  };
};
