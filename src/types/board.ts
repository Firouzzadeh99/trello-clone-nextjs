export type BoardId = string;
export type ListId = string;
export type CardId = string;

export interface Board {
  id: BoardId;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  id: ListId;
  title: string;
  order: number;
}

export interface Card {
  id: CardId;
  listId: ListId;
  title: string;
  order: number;
  commentCount: number;
}

