export type SwfItem = {
  id: string;
  name: string;
  description: string;
  definition: string;
};

export type SwfListResult = {
  items: SwfItem[];
  totalCount: number;
  offset: number;
  limit: number;
};
