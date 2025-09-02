
export interface MovieLocalInterface {
  id: number;
  title: string;
  synopsis: string;
  release: string;
  classification: string;
  genre: string;
  characters: LocalCharacterInterface[];
  director: {
    name: string;
    biography: string;
    reputation: number;
  };
  producers: {
    name: string;
    biography: string;
    role: string;
  }[];
  studio: {
    name: string;
    country: string;
    foundation: string;
  };
  images: {
    url: string;
    description: string;
  }[];
  trailer: {
    url: string;
    description: string;
    duration: number;
  }[];
}


export interface LocalCharacterInterface {
  name: string
  biography: string
  category: string
}