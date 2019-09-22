import { delay, toHexColor } from './util';
import { assert } from 'chai';

describe('delay', () => {
  const threshold = 30;
  it('should wait about 100 ms', async () => {
    const time = Date.now();
    const delayTime = 100;
    await delay(delayTime);
    const end = Date.now();
    const delta = end - time - delayTime;
    assert.isBelow(Math.abs(delta), threshold);
  });

  it('should wait about 1 ms', async () => {
    const time = Date.now();
    const delayTime = 1;
    await delay(delayTime);
    const end = Date.now();
    const delta = end - time - delayTime;
    assert.isBelow(Math.abs(delta), threshold);
  });

  it('should wait about 200 ms', async () => {
    const time = Date.now();
    const delayTime = 200;
    await delay(delayTime);
    const end = Date.now();
    const delta = end - time - delayTime;
    assert.isBelow(Math.abs(delta), threshold);
  });
});

describe('toHexColor', () => {
  it('should work for 0x0', () => {
    assert.equal(toHexColor(0x0), '#000000');
  });
  it('should work for FF', () => {
    assert.equal(toHexColor(0xffffff), '#ffffff');
  });

  it('should work for 0x405136', () => {
    assert.equal(toHexColor(0x405136), '#405136');
  });
  it('should work for 0x6f9240', () => {
    assert.equal(toHexColor(0x6f9240), '#6f9240');
  });
  it('should work for 0x362e26', () => {
    assert.equal(toHexColor(0x362e26), '#362e26');
  });
  it('should work for 0x53b0e2', () => {
    assert.equal(toHexColor(0x53b0e2), '#53b0e2');
  });
});
