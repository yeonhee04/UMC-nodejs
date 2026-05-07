export interface StoreCreateRequest {
  name: string;
  address: string;
  categoryId: number;
}

export const bodyToStore = (body: any): StoreCreateRequest => {
  return {
    name: body.name,
    address: body.address,
    categoryId: body.category_id,
  };
};

// 3. 가게 추가가 완료되었을 때 클라이언트에게 보낼 응답 형태입니다.
export const responseFromStore = (insertId: number) => {
  return {
    storeId: insertId,
    message: "가게가 성공적으로 추가되었습니다!",
  };
};
