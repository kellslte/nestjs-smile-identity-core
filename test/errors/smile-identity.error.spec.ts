import { SmileIdentityError } from '../../src/errors/smile-identity.error';

describe('SmileIdentityError', () => {
  it('should be defined', () => {
    expect(SmileIdentityError).toBeDefined();
  });

  it('should create an error with all properties', () => {
    const error = new SmileIdentityError('Test error', 400, 'BAD_REQUEST', { data: 'test' });

    expect(error.message).toBe('Test error');
    expect(error.status).toBe(400);
    expect(error.code).toBe('BAD_REQUEST');
    expect(error.data).toEqual({ data: 'test' });
    expect(error.name).toBe('SmileIdentityError');
  });

  it('should create error from response', () => {
    const response = {
      message: 'API Error',
      status: 500,
      code: 'INTERNAL_ERROR',
      data: { details: 'test' },
    };

    const error = SmileIdentityError.fromResponse(response);

    expect(error.message).toBe('API Error');
    expect(error.status).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.data).toEqual({ details: 'test' });
  });

  it('should create error from HTTP error', () => {
    const error = SmileIdentityError.fromHttpError(404, 'Not Found', { path: '/test' });

    expect(error.message).toBe('Not Found');
    expect(error.status).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.data).toEqual({ path: '/test' });
  });

  it('should convert to JSON', () => {
    const error = new SmileIdentityError('Test error', 400, 'BAD_REQUEST', { data: 'test' });
    const json = error.toJSON();

    expect(json.name).toBe('SmileIdentityError');
    expect(json.message).toBe('Test error');
    expect(json.status).toBe(400);
    expect(json.code).toBe('BAD_REQUEST');
    expect(json.data).toEqual({ data: 'test' });
  });
});
