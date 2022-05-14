import { TestEvent, TestEventCallback } from '../TestEvent';

const sleep = (time: number): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => resolve(), time);
  });
};

const runBrowserTests = async (callback: TestEventCallback): Promise<boolean> => {
  callback(TestEvent.START, '');
  await sleep(1000);
  callback(TestEvent.END, 'success');
  return true;
};

export default runBrowserTests;
