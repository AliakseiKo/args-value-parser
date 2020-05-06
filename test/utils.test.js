/* eslint-env jest */
const { escape } = require('../src/utils');

describe('escape function:', () => {
  test('must escape \\ in the string by default', () => {
    expect(escape('hello\\World')).toEqual('hello\\\\World');
    expect(escape('!@"#№$;%^:&?* \\ .,/()[]{}')).toEqual('!@"#№$;%^:&?* \\\\ .,/()[]{}');
  });

  test('must escape string safety', () => {
    expect(escape('hello\\World', [])).toEqual('hello\\World');
    expect(escape('hello\\World', ['\\'])).toEqual('hello\\\\World');
    expect(escape('hello\\World', ['\\', '\\'])).toEqual('hello\\\\World');

    expect(escape('hello\\World')).toEqual('hello\\\\World');
    expect(escape('hello\\\\World')).toEqual('hello\\\\World');
    expect(escape('hello\\\\\\World')).toEqual('hello\\\\\\\\World');

    const charSet2 = ['|'];
    expect(escape('hello|World', charSet2)).toEqual('hello\\|World');
    expect(escape('hello\\|World', charSet2)).toEqual('hello\\|World');
    expect(escape('hello\\\\|World', charSet2)).toEqual('hello\\\\|World');
    expect(escape('hello||World', charSet2)).toEqual('hello\\|\\|World');
    expect(escape('hello\\||World', charSet2)).toEqual('hello\\|\\|World');
    expect(escape('hello|\\\\|World', charSet2)).toEqual('hello\\|\\\\|World');

    const charSet3 = ['|', '\\'];
    expect(escape('hello|World', charSet3)).toEqual('hello\\|World');
    expect(escape('hello\\|World', charSet3)).toEqual('hello\\|World');
    expect(escape('hello\\\\|World', charSet3)).toEqual('hello\\\\\\|World');
    expect(escape('hello||World', charSet3)).toEqual('hello\\|\\|World');
    expect(escape('hello\\||World', charSet3)).toEqual('hello\\|\\|World');
    expect(escape('hello|\\\\|World', charSet3)).toEqual('hello\\|\\\\\\|World');

    const charSet4 = ['|', '$'];
    expect(escape('hello$|World', charSet4)).toEqual('hello\\$\\|World');
    expect(escape('hello\\$\\|World', charSet4)).toEqual('hello\\$\\|World');
    expect(escape('hello\\$\\\\|World', charSet4)).toEqual('hello\\$\\\\|World');
    expect(escape('hello$||World', charSet4)).toEqual('hello\\$\\|\\|World');
    expect(escape('hello\\$\\||World', charSet4)).toEqual('hello\\$\\|\\|World');
    expect(escape('hello\\$|\\\\|World', charSet4)).toEqual('hello\\$\\|\\\\|World');

    const charSet5 = ['|', '\\', '^', '$'];
    expect(escape('^hello|World$', charSet5)).toEqual('\\^hello\\|World\\$');
    expect(escape('^hello|\\World$', charSet5)).toEqual('\\^hello\\|\\\\World\\$');
    expect(escape('\\^hello|\\World$\\', charSet5)).toEqual('\\^hello\\|\\\\World\\$\\\\');
    expect(escape('\\\\^hello\\|\\\\World$\\\\', charSet5)).toEqual('\\\\\\^hello\\|\\\\World\\$\\\\');
  });

  test('must escape string unsafety', () => {
    expect(escape('hello\\World', [], false)).toEqual('hello\\World');
    expect(escape('hello\\World', ['\\'], false)).toEqual('hello\\\\World');
    expect(escape('hello\\World', ['\\', '\\'], false)).toEqual('hello\\\\World');

    const charSet1 = ['\\'];
    expect(escape('hello\\World', charSet1, false)).toEqual('hello\\\\World');
    expect(escape('hello\\\\World', charSet1, false)).toEqual('hello\\\\\\\\World');
    expect(escape('hello\\\\\\World', charSet1, false)).toEqual('hello\\\\\\\\\\\\World');

    const charSet2 = ['|'];
    expect(escape('hello|World', charSet2, false)).toEqual('hello\\|World');
    expect(escape('hello\\|World', charSet2, false)).toEqual('hello\\\\|World');
    expect(escape('hello\\\\|World', charSet2, false)).toEqual('hello\\\\\\|World');
    expect(escape('hello||World', charSet2, false)).toEqual('hello\\|\\|World');
    expect(escape('hello\\||World', charSet2, false)).toEqual('hello\\\\|\\|World');
    expect(escape('hello|\\\\|World', charSet2, false)).toEqual('hello\\|\\\\\\|World');

    const charSet3 = ['|', '\\'];
    expect(escape('hello|World', charSet3, false)).toEqual('hello\\|World');
    expect(escape('hello\\|World', charSet3, false)).toEqual('hello\\\\\\|World');
    expect(escape('hello\\\\|World', charSet3, false)).toEqual('hello\\\\\\\\\\|World');
    expect(escape('hello||World', charSet3, false)).toEqual('hello\\|\\|World');
    expect(escape('hello\\||World', charSet3, false)).toEqual('hello\\\\\\|\\|World');
    expect(escape('hello|\\\\|World', charSet3, false)).toEqual('hello\\|\\\\\\\\\\|World');

    const charSet4 = ['|', '$'];
    expect(escape('hello$|World', charSet4, false)).toEqual('hello\\$\\|World');
    expect(escape('hello\\$\\|World', charSet4, false)).toEqual('hello\\\\$\\\\|World');
    expect(escape('hello\\$\\\\|World', charSet4, false)).toEqual('hello\\\\$\\\\\\|World');
    expect(escape('hello$||World', charSet4, false)).toEqual('hello\\$\\|\\|World');
    expect(escape('hello\\$\\||World', charSet4, false)).toEqual('hello\\\\$\\\\|\\|World');
    expect(escape('hello\\$|\\\\|World', charSet4, false)).toEqual('hello\\\\$\\|\\\\\\|World');

    const charSet5 = ['|', '\\', '^', '$'];
    expect(escape('^hello|World$', charSet5, false)).toEqual('\\^hello\\|World\\$');
    expect(escape('^hello|\\World$', charSet5, false)).toEqual('\\^hello\\|\\\\World\\$');
    expect(escape('\\^hello|\\World$\\', charSet5, false)).toEqual('\\\\\\^hello\\|\\\\World\\$\\\\');
    expect(escape('\\\\^hello\\|\\\\World$\\\\', charSet5, false)).toEqual('\\\\\\\\\\^hello\\\\\\|\\\\\\\\World\\$\\\\\\\\');
  });
});
