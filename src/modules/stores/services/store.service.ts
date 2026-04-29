import { StoreCreateRequest, responseFromStore } from "../dtos/store.dto.js";
import { addStore } from "../repositories/store.repository.js";

export const createStore = async (
  regionId: number,
  data: StoreCreateRequest,
) => {
  const insertId = await addStore(regionId, data);

  return responseFromStore(insertId);
};
