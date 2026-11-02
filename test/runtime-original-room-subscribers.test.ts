import {afterEach,expect,it,vi} from 'vitest';
import {OriginalRoomSubscribers} from '../src/runtime/original-room-subscribers';
afterEach(()=>vi.useRealTimers());
it('does not lose a broadcast between reading the room and subscribing',async()=>{
  const subscribers=new OriginalRoomSubscribers(),version=subscribers.version;
  subscribers.notify();
  expect(await subscribers.wait(version)).toBe(true);
});
it('wakes both players and removes all waiting timers',async()=>{
  vi.useFakeTimers();
  const subscribers=new OriginalRoomSubscribers();
  const first=subscribers.wait(0),second=subscribers.wait(0);
  subscribers.notify();
  expect(await Promise.all([first,second])).toEqual([true,true]);
  expect(vi.getTimerCount()).toBe(0);
});
it('keeps the original 30-second empty timeout and cleans up disconnected clients',async()=>{
  vi.useFakeTimers();
  const subscribers=new OriginalRoomSubscribers(),controller=new AbortController();
  const disconnected=subscribers.wait(0,controller.signal),timeout=subscribers.wait(0);
  controller.abort();expect(await disconnected).toBe(false);
  await vi.advanceTimersByTimeAsync(29_999);
  expect(vi.getTimerCount()).toBe(1);
  await vi.advanceTimersByTimeAsync(1);expect(await timeout).toBe(false);
  expect(vi.getTimerCount()).toBe(0);
});
