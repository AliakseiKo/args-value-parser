/* eslint-env jest */
const { escape } = require('../src/utils');

describe('escape function:', () => {
  test('must escape \\ in the string by default', () => {
    expect(escape('hello\\word')).toEqual('hello\\\\word');
    expect(escape('!@"#№$;%^:&?* \\ .,/()[]{}')).toEqual('!@"#№$;%^:&?* \\\\ .,/()[]{}');
  });

  test('must escape string safety', () => {
    expect(escape('hello\\word', [])).toEqual('hello\\word');
    expect(escape('hello\\word', ['\\'])).toEqual('hello\\\\word');
    expect(escape('hello\\word', ['\\', '\\'])).toEqual('hello\\\\word');

    expect(escape('hello\\word')).toEqual('hello\\\\word');
    expect(escape('hello\\\\word')).toEqual('hello\\\\word');
    expect(escape('hello\\\\\\word')).toEqual('hello\\\\\\\\word');

    const charSet2 = ['|'];
    expect(escape('hello|word', charSet2)).toEqual('hello\\|word');
    expect(escape('hello\\|word', charSet2)).toEqual('hello\\|word');
    expect(escape('hello\\\\|word', charSet2)).toEqual('hello\\\\|word');
    expect(escape('hello||word', charSet2)).toEqual('hello\\|\\|word');
    expect(escape('hello\\||word', charSet2)).toEqual('hello\\|\\|word');
    expect(escape('hello|\\\\|word', charSet2)).toEqual('hello\\|\\\\|word');

    const charSet3 = ['|', '\\'];
    expect(escape('hello|word', charSet3)).toEqual('hello\\|word');
    expect(escape('hello\\|word', charSet3)).toEqual('hello\\|word');
    expect(escape('hello\\\\|word', charSet3)).toEqual('hello\\\\\\|word');
    expect(escape('hello||word', charSet3)).toEqual('hello\\|\\|word');
    expect(escape('hello\\||word', charSet3)).toEqual('hello\\|\\|word');
    expect(escape('hello|\\\\|word', charSet3)).toEqual('hello\\|\\\\\\|word');

    const charSet4 = ['|', '$'];
    expect(escape('hello$|word', charSet4)).toEqual('hello\\$\\|word');
    expect(escape('hello\\$\\|word', charSet4)).toEqual('hello\\$\\|word');
    expect(escape('hello\\$\\\\|word', charSet4)).toEqual('hello\\$\\\\|word');
    expect(escape('hello$||word', charSet4)).toEqual('hello\\$\\|\\|word');
    expect(escape('hello\\$\\||word', charSet4)).toEqual('hello\\$\\|\\|word');
    expect(escape('hello\\$|\\\\|word', charSet4)).toEqual('hello\\$\\|\\\\|word');

    const charSet5 = ['|', '\\', '^', '$'];
    expect(escape('^hello|word$', charSet5)).toEqual('\\^hello\\|word\\$');
    expect(escape('^hello|\\word$', charSet5)).toEqual('\\^hello\\|\\\\word\\$');
    expect(escape('\\^hello|\\word$\\', charSet5)).toEqual('\\^hello\\|\\\\word\\$\\\\');
    expect(escape('\\\\^hello\\|\\\\word$\\\\', charSet5)).toEqual('\\\\\\^hello\\|\\\\word\\$\\\\');
  });

  test('must escape string unsafety', () => {
    expect(escape('hello\\word', [], false)).toEqual('hello\\word');
    expect(escape('hello\\word', ['\\'], false)).toEqual('hello\\\\word');
    expect(escape('hello\\word', ['\\', '\\'], false)).toEqual('hello\\\\word');

    const charSet1 = ['\\'];
    expect(escape('hello\\word', charSet1, false)).toEqual('hello\\\\word');
    expect(escape('hello\\\\word', charSet1, false)).toEqual('hello\\\\\\\\word');
    expect(escape('hello\\\\\\word', charSet1, false)).toEqual('hello\\\\\\\\\\\\word');

    const charSet2 = ['|'];
    expect(escape('hello|word', charSet2, false)).toEqual('hello\\|word');
    expect(escape('hello\\|word', charSet2, false)).toEqual('hello\\\\|word');
    expect(escape('hello\\\\|word', charSet2, false)).toEqual('hello\\\\\\|word');
    expect(escape('hello||word', charSet2, false)).toEqual('hello\\|\\|word');
    expect(escape('hello\\||word', charSet2, false)).toEqual('hello\\\\|\\|word');
    expect(escape('hello|\\\\|word', charSet2, false)).toEqual('hello\\|\\\\\\|word');

    const charSet3 = ['|', '\\'];
    expect(escape('hello|word', charSet3, false)).toEqual('hello\\|word');
    expect(escape('hello\\|word', charSet3, false)).toEqual('hello\\\\\\|word');
    expect(escape('hello\\\\|word', charSet3, false)).toEqual('hello\\\\\\\\\\|word');
    expect(escape('hello||word', charSet3, false)).toEqual('hello\\|\\|word');
    expect(escape('hello\\||word', charSet3, false)).toEqual('hello\\\\\\|\\|word');
    expect(escape('hello|\\\\|word', charSet3, false)).toEqual('hello\\|\\\\\\\\\\|word');

    const charSet4 = ['|', '$'];
    expect(escape('hello$|word', charSet4, false)).toEqual('hello\\$\\|word');
    expect(escape('hello\\$\\|word', charSet4, false)).toEqual('hello\\\\$\\\\|word');
    expect(escape('hello\\$\\\\|word', charSet4, false)).toEqual('hello\\\\$\\\\\\|word');
    expect(escape('hello$||word', charSet4, false)).toEqual('hello\\$\\|\\|word');
    expect(escape('hello\\$\\||word', charSet4, false)).toEqual('hello\\\\$\\\\|\\|word');
    expect(escape('hello\\$|\\\\|word', charSet4, false)).toEqual('hello\\\\$\\|\\\\\\|word');

    const charSet5 = ['|', '\\', '^', '$'];
    expect(escape('^hello|word$', charSet5, false)).toEqual('\\^hello\\|word\\$');
    expect(escape('^hello|\\word$', charSet5, false)).toEqual('\\^hello\\|\\\\word\\$');
    expect(escape('\\^hello|\\word$\\', charSet5, false)).toEqual('\\\\\\^hello\\|\\\\word\\$\\\\');
    expect(escape('\\\\^hello\\|\\\\word$\\\\', charSet5, false)).toEqual('\\\\\\\\\\^hello\\\\\\|\\\\\\\\word\\$\\\\\\\\');
  });
});
