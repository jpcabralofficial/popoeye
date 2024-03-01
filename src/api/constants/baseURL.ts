type BaseURL = {
  API_SERVER: string;
};

const dev: BaseURL = {
  API_SERVER: '',
};

const region = dev;

export const API_SERVER = region.API_SERVER;
