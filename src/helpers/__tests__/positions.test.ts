import {
  calculateThresholds,
  isCandidateIdeal,
  calculateInterval,
  calculateMaxInterval,
  compareByKoef,
  sortCandidatesByKoef,
} from 'helpers/positions';

const mockedPosition = {
  applicationDate: '2021-11-20T12:23:20.326Z',
  closeDate: '2021-12-12T13:02:39.618Z',
  duties: [
    { id: 'fc463627-f9f4-4914-ae16-1029a0b06688', text: 'Написание тестов' },
  ],
  id: '2b6df402-1c85-4d0a-a3f4-737671e61a6c',
  job_function: {
    id: '64f4957c-217f-475a-83fd-58d7b4e091fe',
    name: 'Программист',
  },
  profiles: [],
  project: { id: '8ec68120-1af4-4869-a61d-5ad4eba05a84', name: 'CowerVallet' },
  requirements: [
    {
      id: '85bb9475-2293-4f97-848a-03e389affe51',
      technology: {
        id: '1',
      },
      level: {
        value: '3',
      },
      priority: {
        deviation: '0',
      },
    },
    {
      id: '85bb9475-2293-4f97-848a-03e389affe52',
      technology: {
        id: '2',
      },
      level: {
        value: '3',
      },
      priority: {
        deviation: '1',
      },
    },
    {
      id: '85bb9475-2293-4f97-848a-03e389affe53',
      technology: {
        id: '3',
      },
      level: {
        value: '2',
      },
      priority: {
        deviation: '2',
      },
    },
  ],
};

const mockedThresholds = [
  {
    technologyId: '1',
    threshold: 3,
  },
  {
    technologyId: '2',
    threshold: 2,
  },
  {
    technologyId: '3',
    threshold: 0,
  },
];

const mockedCandidate = {
  accountId: '3867aede-dde0-41fc-baea-c70a5f693e2b',
  companyStartDate: '2020-10-27T19:12:00.000Z',
  createdAt: '2021-11-22T19:14:02.547Z',
  department: { id: 'f8bac02f-9877-40c7-bfa1-c9231f018c0b', name: 'D1.JS' },
  email: 'test2020@test.com',
  id: '60651698-1b34-427b-9ecb-76ce5ff7f19a',
  job_function: {
    id: '64f4957c-217f-475a-83fd-58d7b4e091fe',
    name: 'Программист',
  },
  mobilePhone: '80447501736',
  name: 'Анна',
  patronymic: 'Сергеевна',
  skills: [
    {
      id: '94b612b5-8c9b-4eeb-b392-edbd988d26c0',
      technology: {
        id: '1',
      },
      level: {
        value: '2',
      },
    },
    {
      id: 'a9dd350c-6a0d-46ac-b624-0c006ce78f41',
      technology: {
        id: '2',
      },
      level: {
        value: '2',
      },
    },
  ],
  summary: 'It is a long established fact that a reader',
  surname: 'Русакович',
};

const mockedIdealCandidate = {
  ...mockedCandidate,
  skills: [
    {
      id: '94b612b5-8c9b-4eeb-b392-edbd988d26c0',
      technology: {
        id: '1',
      },
      level: {
        value: '3',
      },
    },
    {
      id: 'a9dd350c-6a0d-46ac-b624-0c006ce78f41',
      technology: {
        id: '2',
      },
      level: {
        value: '3',
      },
    },
    {
      id: 'a9dd350c-6a0d-46ac-b624-0c006ce78f42',
      technology: {
        id: '3',
      },
      level: {
        value: '1',
      },
    },
  ],
};

describe('Testing calculateThresholds function', () => {
  it('Returns right thresholds', () => {
    const mockedPosition2 = {
      ...mockedPosition,
      requirements: [
        {
          id: '85bb9475-2293-4f97-848a-03e389affe51',
          technology: {
            id: '1',
          },
          level: {
            value: '1',
          },
          priority: {
            deviation: '3',
          },
        },
      ],
    };
    const mockedThresholds2 = [
      {
        technologyId: '1',
        threshold: 0,
      },
    ];
    expect(calculateThresholds(mockedPosition2)).toEqual(mockedThresholds2);
  });
  it('Returns thresholds === 0', () => {
    expect(calculateThresholds(mockedPosition)).toEqual(mockedThresholds);
  });
});

describe('Testing isCandidateIdeal function', () => {
  it('Check, if profile skills are higher than required ones, return true', () => {
    expect(
      isCandidateIdeal(mockedThresholds, mockedIdealCandidate)
    ).toBeTruthy();
  });
  it('Check, if profile skills are lower than required ones, return false', () => {
    expect(isCandidateIdeal(mockedThresholds, mockedCandidate)).toBeFalsy();
  });
});

describe('Testing calculateMaxInterval function', () => {
  it('Returns 3.605551275463989 for mocked thresholds', () => {
    expect(calculateMaxInterval(mockedThresholds)).toEqual(3.605551275463989);
  });
});

describe('Testing calculateInterval function', () => {
  it('If candidate ideal returns 0', () => {
    expect(calculateInterval(mockedThresholds, mockedIdealCandidate)).toEqual(
      0
    );
  });
  it('If candidate does not have any of required skills return value equaled max interval', () => {
    const badCandidate = {
      ...mockedCandidate,
      skills: [],
    };
    expect(calculateInterval(mockedThresholds, badCandidate)).toEqual(
      calculateMaxInterval(mockedThresholds)
    );
  });
  it('For mocked candidate returns 1', () => {
    expect(calculateInterval(mockedThresholds, mockedCandidate)).toEqual(1);
  });
});

describe('Testing compareByKoef function', () => {
  it('Returns -1 if obj 1 koef is higher than obj 2 koef', () => {
    expect(compareByKoef({ koef: 2 }, { koef: 1 })).toEqual(-1);
  });
  it('Returns 1 if obj 1 koef is lower than obj 2 koef', () => {
    expect(compareByKoef({ koef: 0 }, { koef: 1 })).toEqual(1);
  });
  it('Returns 0 if koefs are equal', () => {
    expect(compareByKoef({ koef: 1 }, { koef: 1 })).toEqual(0);
  });
});

describe('Testing sortCandidatesByKoef function', () => {
  it('Returns sorted candidates array', () => {
    const mockedCandidates = [
      {
        id: 1,
        koef: 0.45,
      },
      {
        id: 2,
        koef: 0.64,
      },
      {
        id: 3,
        koef: 0.41,
      },
      {
        id: 4,
        koef: 0.87,
      },
      {
        id: 5,
        koef: 0.21,
      },
    ];
    const expected = [
      {
        id: 4,
        koef: 0.87,
      },
      {
        id: 2,
        koef: 0.64,
      },
      {
        id: 1,
        koef: 0.45,
      },
      {
        id: 3,
        koef: 0.41,
      },
      {
        id: 5,
        koef: 0.21,
      },
    ];
    expect(sortCandidatesByKoef(mockedCandidates)).toEqual(expected);
  });
});
