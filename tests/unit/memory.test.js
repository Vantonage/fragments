const index = require('../../src/model/data/memory/index');

describe('index', () => {
  // to read fragment, there needs to be a fragment. So write one and then read it.
  test('read fragment', async () => {
    let fragment = { ownerId: 'a', id: 'b', value: 123 };
    await index.writeFragment(fragment);
    const result = await index.readFragment('a', 'b');
    expect(result).toEqual(fragment);
  });

  // to write a fragment, send in the ownerId and id with the package(fragment). To check
  // if it was sent in properly, read it.
  test('write fragment', async () => {
    let fragment = { ownerId: 'a', id: 'b', value: 123 };
    const result = await index.writeFragment(fragment);
    expect(result).toEqual(undefined);
  });

  test('readFragmentData', async () => {
    let fragment = { ownerId: 'a', id: 'b', value: 123 };
    await index.writeFragmentData(fragment.ownerId, fragment.id, fragment.value);
    const result = await index.readFragmentData(fragment.ownerId, fragment.id);
    expect(result).toEqual(123);
  });

  test('writeFragmentData', async () => {
    let fragment = { ownerId: 'a', id: 'b', value: 123 };
    const result = await index.writeFragmentData(fragment.ownerId, fragment.id, fragment.value);
    expect(result).toEqual(undefined);
  });
});
