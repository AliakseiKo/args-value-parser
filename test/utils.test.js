/* eslint-env jest */
const { escape } = require('../lib/utils');

describe(escape, () => {
  it('must escape \\ in the string by default', () => {
    expect(escape('hello\\World')).toEqual('hello\\\\World');
    expect(escape('!@"#№$;%^:&?* \\ .,/()[]{}')).toEqual('!@"#№$;%^:&?* \\\\ .,/()[]{}');
  });

  {
    const charSet1 = ['\\'];
    const charSet2 = ['|'];
    const charSet3 = ['|', '\\'];
    const charSet4 = ['|', '$'];
    const charSet5 = ['|', '\\', '^', '$'];

    it.each([
      [
        'hello\\World', [],
        ['hello\\World', 'hello\\World']
      ],
      [
        'hello\\World', ['\\'],
        ['hello\\\\World', 'hello\\\\World']
      ],
      [
        'hello\\World', ['\\', '\\'],
        ['hello\\\\World', 'hello\\\\World']
      ],

      [
        'hello\\World', charSet1,
        ['hello\\\\World', 'hello\\\\World']
      ],
      [
        'hello\\\\World', charSet1,
        ['hello\\\\World', 'hello\\\\\\\\World']
      ],
      [
        'hello\\\\\\World', charSet1,
        ['hello\\\\\\\\World', 'hello\\\\\\\\\\\\World']
      ],

      [
        'hello|World', charSet2,
        ['hello\\|World', 'hello\\|World']
      ],
      [
        'hello\\|World', charSet2,
        ['hello\\|World', 'hello\\\\|World']
      ],
      [
        'hello\\\\|World', charSet2,
        ['hello\\\\|World', 'hello\\\\\\|World']
      ],
      [
        'hello||World', charSet2,
        ['hello\\|\\|World', 'hello\\|\\|World']
      ],
      [
        'hello\\||World', charSet2,
        ['hello\\|\\|World', 'hello\\\\|\\|World']
      ],
      [
        'hello|\\\\|World', charSet2,
        ['hello\\|\\\\|World', 'hello\\|\\\\\\|World']
      ],


      [
        'hello|World', charSet3,
        ['hello\\|World', 'hello\\|World']
      ],
      [
        'hello\\|World', charSet3,
        ['hello\\|World', 'hello\\\\\\|World']
      ],
      [
        'hello\\\\|World', charSet3,
        ['hello\\\\\\|World', 'hello\\\\\\\\\\|World']
      ],
      [
        'hello||World', charSet3,
        ['hello\\|\\|World', 'hello\\|\\|World']
      ],
      [
        'hello\\||World', charSet3,
        ['hello\\|\\|World', 'hello\\\\\\|\\|World']
      ],
      [
        'hello|\\\\|World', charSet3,
        ['hello\\|\\\\\\|World', 'hello\\|\\\\\\\\\\|World']
      ],


      [
        'hello$|World', charSet4,
        ['hello\\$\\|World', 'hello\\$\\|World']
      ],
      [
        'hello\\$\\|World', charSet4,
        ['hello\\$\\|World', 'hello\\\\$\\\\|World']
      ],
      [
        'hello\\$\\\\|World', charSet4,
        ['hello\\$\\\\|World', 'hello\\\\$\\\\\\|World']
      ],
      [
        'hello$||World', charSet4,
        ['hello\\$\\|\\|World', 'hello\\$\\|\\|World']
      ],
      [
        'hello\\$\\||World', charSet4,
        ['hello\\$\\|\\|World', 'hello\\\\$\\\\|\\|World']
      ],
      [
        'hello\\$|\\\\|World', charSet4,
        ['hello\\$\\|\\\\|World', 'hello\\\\$\\|\\\\\\|World']
      ],

      [
        '^hello|World$', charSet5,
        ['\\^hello\\|World\\$', '\\^hello\\|World\\$']
      ],
      [
        '^hello|\\World$', charSet5,
        ['\\^hello\\|\\\\World\\$', '\\^hello\\|\\\\World\\$']
      ],
      [
        '\\^hello|\\World$\\', charSet5,
        ['\\^hello\\|\\\\World\\$\\\\', '\\\\\\^hello\\|\\\\World\\$\\\\']
      ],
      [
        '\\\\^hello\\|\\\\World$\\\\', charSet5,
        ['\\\\\\^hello\\|\\\\World\\$\\\\', '\\\\\\\\\\^hello\\\\\\|\\\\\\\\World\\$\\\\\\\\']
      ]
    ])('must escape string correctly', (str, chars, expected) => {
      expect(escape(str, chars, true)).toEqual(expected[0]);
      expect(escape(str, chars, false)).toEqual(expected[1]);
    });
  }
});
