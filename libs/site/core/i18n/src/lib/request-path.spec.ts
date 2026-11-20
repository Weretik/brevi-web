import { REQUEST_PRODUCT_PARAM, requestHref, withRequestProduct } from './request-path';

describe('request link', () => {
  it('leads to the request page of the language', () => {
    expect(requestHref('uk')).toBe('/uk/request');
    expect(requestHref('ru')).toBe('/ru/request');
  });

  it('carries the product name, so the form opens filled in', () => {
    expect(requestHref('uk', 'Костюм «Імпульс» 2')).toBe(
      `/uk/request?${REQUEST_PRODUCT_PARAM}=%D0%9A%D0%BE%D1%81%D1%82%D1%8E%D0%BC+%C2%AB%D0%86%D0%BC%D0%BF%D1%83%D0%BB%D1%8C%D1%81%C2%BB+2`,
    );
  });

  it('leaves out an empty product', () => {
    expect(requestHref('uk', '  ')).toBe('/uk/request');
  });

  it('adds the product to a link a card got from its page', () => {
    expect(withRequestProduct('/ru/request', 'Каска')).toBe(
      '/ru/request?product=%D0%9A%D0%B0%D1%81%D0%BA%D0%B0',
    );
  });
});
