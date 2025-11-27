export const to = (params = {}) =>
    "/products?" + new URLSearchParams(params).toString();
